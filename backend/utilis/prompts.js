const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (
`
  You are an AI trained to generate technical interview questions and answers.
  Task:
  - Role: ${role}
  - Candidate Experience: ${experience} years
  - Focus Topics: ${topicsToFocus}
  - Write ${numberOfQuestions} interview questions.
  - For each question, generate a detailed but beginner-friendly answer.
  - If the answer needs a code example, add a small code block inside.
  - Keep formatting very clean.
  - Return a pure JSON array like:
  [
    {
      "question": "Question here?",
      "answer": "Answer here."
    },
    ...
  ]
  Important: Do NOT add any extra text. Only return valid JSON.
  `)
  
  const conceptExplainPrompt = (question) => {
    return `
  You are an AI trained to generate explanations for a given interview question.
  Task:
  Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
  Question: "${question}"
  After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
  If the explanation includes a code example, provide a small code block.
  Keep the formatting very clean and clear.
  Return the result as a valid JSON object in the following format:
  {
    "title": "Short title here?",
    "explanation": "Explanation here."
  }
  Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
  `;
  };

  const customQuestionCorrectionPrompt = (question) => {
    return `
  You are an AI assistant helping users improve interview questions and generate answers.
  
  Task:
  - Fix any grammar or spelling issues in the user's question.
  - Then generate a concise, beginner-friendly answer.
  - If helpful, include a small code block in the answer.
  
  Return a valid JSON object like:
  {
    "correctedQuestion": "Corrected version of the question?",
    "answer": "Answer here."
  }
  
  Important: Do NOT include any extra text, explanation, or markdown. Only return valid JSON.
  User's Question: "${question}"
    `;
  };
  
  
  module.exports = { questionAnswerPrompt, conceptExplainPrompt, customQuestionCorrectionPrompt };
  