const {GoogleGenAI} = require("@google/genai");
const {conceptExplainPrompt, questionAnswerPrompt} = require("../utilis/prompts");

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


        let rawText = response.text;

        const cleanedText = rawText
            .replace(/^```json\s*/, "")  // Removes the opening ```json and any whitespace after it
            .replace(/```$/, "")         // Removes the closing ```
            .trim();                     // Trims any leading/trailing whitespace

        
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message
        });
    }
};



const generateConceptExplanation = async(req, res)=>{
    try {
        const {question } = req.body;
        
        if(!question){
            return res.status(400).json({message: "Missing required fields"});
        }

        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        let  rawText = response.text;

        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();

        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message
        });
    }
}

module.exports = {generateConceptExplanation, generateInterviewQuestions};