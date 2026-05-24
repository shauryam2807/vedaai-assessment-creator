import { ISection } from "@/types";
import { QuestionItem } from "./QuestionItem";

export function QuestionSection({ section }: { section: ISection }) {
  return (
    <div className="paper-section">
      <div className="section-header">
        <h3 className="section-title">
          Section {section.sectionLabel}: {section.title}
        </h3>
        {section.instructions && (
          <div className="section-instruction">({section.instructions})</div>
        )}
      </div>
      
      <div className="questions-container">
        {section.questions.map((q) => (
          <QuestionItem key={q.questionNumber} question={q} />
        ))}
      </div>
    </div>
  );
}
