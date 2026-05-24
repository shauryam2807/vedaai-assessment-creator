import { IGeneratedPaper } from '../types';

/**
 * Generates a PDF buffer from a GeneratedPaper using html-pdf-node.
 * Builds a clean HTML template and converts it to a PDF buffer.
 */
export async function generatePDF(paper: IGeneratedPaper): Promise<Buffer> {
  // Dynamic import to handle html-pdf-node (CommonJS module)
  const htmlPdfNode = await import('html-pdf-node');
  const generatePdfFn = htmlPdfNode.default?.generatePdf || htmlPdfNode.generatePdf;

  const html = buildPaperHTML(paper);

  const file = { content: html };
  const options = {
    format: 'A4' as const,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm',
    },
    printBackground: true,
  };

  const pdfBuffer: Buffer = await generatePdfFn(file, options);
  return pdfBuffer;
}

/**
 * Builds a complete HTML document styled for clean PDF output.
 */
function buildPaperHTML(paper: IGeneratedPaper): string {
  const instructionsHTML = paper.instructions
    .map((inst) => `<li>${escapeHtml(inst)}</li>`)
    .join('\n');

  const sectionsHTML = paper.sections
    .map((section) => {
      const questionsHTML = section.questions
        .map((q) => {
          let questionBody = `
            <div class="question">
              <div class="question-header">
                <span class="q-number">Q${q.questionNumber}.</span>
                <span class="q-meta">
                  <span class="difficulty ${q.difficulty}">${q.difficulty.toUpperCase()}</span>
                  <span class="marks">[${q.marks} mark${q.marks > 1 ? 's' : ''}]</span>
                </span>
              </div>
              <p class="q-text">${escapeHtml(q.text)}</p>`;

          // Render MCQ options
          if (q.options && q.options.length > 0) {
            const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
            const optionsHTML = q.options
              .map(
                (opt, i) =>
                  `<div class="option">(${optionLabels[i] || i + 1}) ${escapeHtml(opt)}</div>`
              )
              .join('\n');
            questionBody += `<div class="options">${optionsHTML}</div>`;
          }

          // Answer key (separate page in real use, included here for completeness)
          questionBody += `
              <div class="answer-key">
                <strong>Answer:</strong> ${escapeHtml(q.answer)}
              </div>
            </div>`;

          return questionBody;
        })
        .join('\n');

      return `
        <div class="section">
          <h2 class="section-title">Section ${escapeHtml(section.sectionLabel)}: ${escapeHtml(section.title)}</h2>
          ${section.instructions ? `<p class="section-instructions"><em>${escapeHtml(section.instructions)}</em></p>` : ''}
          ${questionsHTML}
        </div>`;
    })
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(paper.title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #1a1a1a;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 { font-size: 18pt; margin-bottom: 5px; }
    .header .meta { font-size: 11pt; color: #555; }
    .header .meta span { margin: 0 10px; }
    .instructions {
      background: #f8f8f8;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px 20px;
      margin-bottom: 25px;
    }
    .instructions h3 { font-size: 12pt; margin-bottom: 8px; }
    .instructions li { margin-left: 20px; font-size: 10pt; margin-bottom: 3px; }
    .section { margin-bottom: 25px; }
    .section-title {
      font-size: 14pt;
      background: #2c3e50;
      color: white;
      padding: 8px 15px;
      border-radius: 3px;
      margin-bottom: 10px;
    }
    .section-instructions { margin-bottom: 12px; color: #555; font-size: 10pt; }
    .question {
      margin-bottom: 15px;
      padding: 10px 0;
      border-bottom: 1px dashed #e0e0e0;
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .q-number { font-weight: bold; font-size: 12pt; }
    .q-meta { font-size: 9pt; }
    .difficulty {
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 8pt;
      margin-right: 8px;
    }
    .difficulty.easy { background: #d4edda; color: #155724; }
    .difficulty.medium { background: #fff3cd; color: #856404; }
    .difficulty.hard { background: #f8d7da; color: #721c24; }
    .marks { font-weight: bold; color: #2c3e50; }
    .q-text { margin-bottom: 8px; }
    .options { margin-left: 25px; margin-bottom: 8px; }
    .option { margin-bottom: 3px; }
    .answer-key {
      background: #e8f5e9;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 10pt;
      margin-top: 8px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
      font-size: 9pt;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(paper.title)}</h1>
    <div class="meta">
      <span><strong>Subject:</strong> ${escapeHtml(paper.subject)}</span>
      <span><strong>Total Marks:</strong> ${paper.totalMarks}</span>
      <span><strong>Duration:</strong> ${paper.duration} minutes</span>
    </div>
  </div>

  <div class="instructions">
    <h3>General Instructions:</h3>
    <ol>
      ${instructionsHTML}
    </ol>
  </div>

  ${sectionsHTML}

  <div class="footer">
    Generated by VedaAI Assessment Creator
  </div>
</body>
</html>`;
}

/** Simple HTML entity escaper to prevent XSS in generated PDFs */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
