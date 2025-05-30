const { GoogleGenAI } = require("@google/genai");
const {conceptExplainPrompt,questionAnswerPrompt,customQuestionCorrectionPrompt} = require("../utilis/prompts");

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});




const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    // Validate inputs
    if (!role || !experience || !topicsToFocus) {
      return res.status(400).json({ message: "Role, experience, and topicsToFocus are required" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    // Clean and parse the AI response
    const cleanedText = response?.text
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON?.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message
    });
  }
};

const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const cleanedText = response?.text
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message
    });
  }
};

const addCustomQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    // Basic validation
    if (!question || typeof question !== "string") {
      return res.status(400).json({ message: "Session ID and question are required." });
    }

    const prompt = customQuestionCorrectionPrompt(question);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(500).json({ message: "No response text from AI." });
    }
    // console.log("Gemini response:", rawText);

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();
    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error adding custom question:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
  addCustomQuestion
};
