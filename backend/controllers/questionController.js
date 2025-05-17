const Question = require("../models/Question");
const Session = require("../models/Session");

exports.addQuestionsToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body;

        if (!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const createdQuestions = await Question.insertMany(
            questions.map((q) => ({
                session: sessionId,
                question: q.question,
                answer: q.answer,
            }))
        );

        // Add new question IDs to session.questions
        session.questions.push(...createdQuestions.map(q => q._id));
        await session.save();

        res.status(201).json({ message: "Questions added successfully", questions: createdQuestions });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


exports.togglePinQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        question.isPinned = !question.isPinned;
        await question.save();

        res.status(200).json({ message: "Pin status toggled", question });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


exports.updateQuestionNote = async (req, res) => {
    try {
        const questionId = req.params.id;
        const { note } = req.body;

        if (typeof note !== 'string') {
            return res.status(400).json({ message: "Note must be a string" });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        question.note = note;
        await question.save();

        res.status(200).json({ message: "Note updated", question });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
