import { IGeneratedPaper } from "@/types";
import { PaperHeader } from "./PaperHeader";
import { StudentInfoSection } from "./StudentInfoSection";
import { QuestionSection } from "./QuestionSection";
import { ActionBar } from "./ActionBar";

export function QuestionPaper({ paper }: { paper: IGeneratedPaper }) {
  return (
    <>
      <div className="paper-wrapper" id="question-paper">
        <PaperHeader paper={paper} />
        <StudentInfoSection />
        
        {paper.instructions && paper.instructions.length > 0 && (
          <div className="general-instructions">
            <div className="instructions-title">General Instructions:</div>
            <ul className="instructions-list">
              {paper.instructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ul>
          </div>
        )}

        {paper.sections.map((section, idx) => (
          <QuestionSection key={idx} section={section} />
        ))}
      </div>
      
      <ActionBar assignmentId={paper.assignmentId} paperId={paper._id} />
    </>
  );
}
