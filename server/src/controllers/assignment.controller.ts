import { Request, Response, NextFunction } from 'express';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { assessmentQueue } from '../jobs/queue';
import { redis } from '../config/redis';
import { generatePDF } from '../services/pdf.service';
import { IGeneratedPaper } from '../types';
import { FilterQuery } from 'mongoose';

/**
 * POST /api/assignments
 * Creates a new assignment and enqueues it for AI generation.
 */
export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await Assignment.create(req.body);

    // Enqueue the generation job
    await assessmentQueue.add('generate', {
      assignmentId: assignment._id.toString(),
    });

    console.log(`📋 Assignment ${assignment._id} created and queued`);

    res.status(201).json({
      success: true,
      data: {
        id: assignment._id,
        status: assignment.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assignments/:id
 * Returns a single assignment by ID.
 */
export async function getAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
      return;
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assignments
 * Returns a list of all assignments, optionally filtered by search.
 */
export async function listAssignments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search } = req.query;
    let query: FilterQuery<any> = {};

    if (search && typeof search === 'string') {
      query.title = { $regex: search, $options: 'i' };
    }

    const assignments = await Assignment.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/assignments/:id
 * Deletes an assignment and its generated paper.
 */
export async function deleteAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignmentId = req.params.id;
    
    // Delete the assignment
    const assignment = await Assignment.findByIdAndDelete(assignmentId);
    
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
      return;
    }

    // Delete the generated paper
    await GeneratedPaper.findOneAndDelete({ assignmentId });

    // Try to remove from cache
    try {
      await redis.del(`paper:${assignmentId}`);
    } catch (redisError) {
      console.warn('⚠️ Redis delete error (ignored):', redisError);
    }

    res.json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assignments/:id/paper
 * Returns the generated paper. Checks Redis cache first, falls back to MongoDB.
 */
export async function getGeneratedPaper(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignmentId = req.params.id;
    const cacheKey = `paper:${assignmentId}`;

    // 1. Check Redis cache
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`📦 Cache hit for paper:${assignmentId}`);
        res.json({
          success: true,
          data: JSON.parse(cached),
          source: 'cache',
        });
        return;
      }
    } catch (redisError) {
      console.warn('⚠️ Redis get error (ignoring and fetching from DB):', redisError);
    }

    // 2. Fallback to MongoDB
    const paper = await GeneratedPaper.findOne({ assignmentId });

    if (!paper) {
      res.status(404).json({
        success: false,
        message: 'Generated paper not found. It may still be processing.',
      });
      return;
    }

    // 3. Cache for future requests (1 hour)
    try {
      await redis.set(cacheKey, JSON.stringify(paper.toObject()), 'EX', 3600);
    } catch (redisError) {
      console.warn('⚠️ Redis set error (ignored):', redisError);
    }

    res.json({
      success: true,
      data: paper,
      source: 'database',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/assignments/:id/regenerate
 * Re-queues an existing assignment for a fresh generation run.
 */
export async function regenerateAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
      return;
    }

    // Reset status and clear previous paper reference
    assignment.status = 'pending';
    assignment.generatedPaperId = undefined;
    await assignment.save();

    // Invalidate cache
    try {
      await redis.del(`paper:${assignment._id.toString()}`);
    } catch (redisError) {
      console.warn('⚠️ Redis delete error (ignored):', redisError);
    }

    // Enqueue new job
    await assessmentQueue.add('generate', {
      assignmentId: assignment._id.toString(),
    });

    console.log(`🔄 Assignment ${assignment._id} re-queued for regeneration`);

    res.json({
      success: true,
      data: {
        id: assignment._id,
        status: 'pending',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assignments/:id/pdf
 * Generates and downloads a PDF of the assessment paper.
 */
export async function downloadPDF(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignmentId = req.params.id;

    const paper = await GeneratedPaper.findOne({ assignmentId });

    if (!paper) {
      res.status(404).json({
        success: false,
        message: 'Generated paper not found. Cannot generate PDF.',
      });
      return;
    }

    const pdfBuffer = await generatePDF(paper.toObject() as IGeneratedPaper);

    // Sanitize filename
    const filename = `${paper.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
