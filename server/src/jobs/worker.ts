import { Worker, Job } from 'bullmq';
import { getRedisConnectionOptions } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { generateQuestions } from '../services/ai.service';
import { parseLLMResponse } from '../services/parser.service';
import { redis } from '../config/redis';
import { getIO } from '../websocket/socket';
import { AssessmentJobData } from './queue';
import { IAssignment } from '../types';

/**
 * Creates and returns the BullMQ worker that processes assessment generation jobs.
 * The worker is started during server initialization.
 */
export function startWorker(): Worker<AssessmentJobData> {
  const worker = new Worker<AssessmentJobData>(
    'assessment-generation',
    async (job: Job<AssessmentJobData>) => {
      const { assignmentId } = job.data;
      const startTime = Date.now();

      console.log(`🔄 Processing job ${job.id} for assignment ${assignmentId}`);

      // ── 1. Fetch assignment from MongoDB ──
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error(`Assignment ${assignmentId} not found`);
      }

      // ── 2. Update status to processing ──
      assignment.status = 'processing';
      await assignment.save();

      // ── 3. Emit "started" event ──
      const io = getIO();
      io.to(assignmentId).emit('generation:started', {
        assignmentId,
        message: 'Assessment generation has started',
      });

      // ── 4. Call AI service ──
      console.log(`🤖 Calling Gemini for assignment ${assignmentId}...`);
      const rawResponse = await generateQuestions(assignment.toObject() as IAssignment);

      // ── 5. Emit progress ──
      io.to(assignmentId).emit('generation:progress', {
        assignmentId,
        progress: 50,
        message: 'AI response received, parsing and validating...',
      });

      // ── 6. Parse & validate ──
      console.log(`📝 Parsing LLM response for assignment ${assignmentId}...`);
      const parsedPaper = parseLLMResponse(rawResponse, assignment.toObject() as IAssignment);

      // ── 7. Save GeneratedPaper to MongoDB ──
      const generatedPaper = await GeneratedPaper.create({
        assignmentId: assignment._id,
        title: parsedPaper.title,
        subject: parsedPaper.subject,
        totalMarks: parsedPaper.totalMarks,
        duration: parsedPaper.duration,
        instructions: parsedPaper.instructions,
        sections: parsedPaper.sections,
        metadata: {
          generatedAt: new Date(),
          modelUsed: 'gemini-1.5-flash',
          generationTimeMs: Date.now() - startTime,
        },
      });

      // ── 8. Update assignment ──
      assignment.status = 'completed';
      assignment.generatedPaperId = generatedPaper._id;
      await assignment.save();

      // ── 9. Cache in Redis (1 hour TTL) ──
      const cacheKey = `paper:${assignmentId}`;
      await redis.set(cacheKey, JSON.stringify(generatedPaper.toObject()), 'EX', 3600);
      console.log(`💾 Cached paper for assignment ${assignmentId}`);

      // ── 10. Emit "completed" event ──
      io.to(assignmentId).emit('generation:completed', {
        assignmentId,
        paperId: generatedPaper._id.toString(),
        message: 'Assessment paper generated successfully!',
      });

      const elapsed = Date.now() - startTime;
      console.log(`✅ Job ${job.id} completed in ${elapsed}ms`);

      return { paperId: generatedPaper._id.toString() };
    },
    {
      ...getRedisConnectionOptions(),
      concurrency: 3, // Process up to 3 jobs simultaneously
    }
  );

  // ── Error & failure handlers ──
  worker.on('failed', async (job, err) => {
    const assignmentId = job?.data?.assignmentId;
    console.error(`❌ Job ${job?.id} failed:`, err.message);

    if (assignmentId) {
      try {
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });

        const io = getIO();
        io.to(assignmentId).emit('generation:failed', {
          assignmentId,
          error: err.message || 'Assessment generation failed',
        });
      } catch (updateErr) {
        console.error('Failed to update assignment status on job failure:', updateErr);
      }
    }
  });

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  worker.on('error', (err) => {
    console.error('❌ Worker error:', err);
  });

  console.log('✅ BullMQ worker started for "assessment-generation" queue');
  return worker;
}
