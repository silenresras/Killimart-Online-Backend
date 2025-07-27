import mongoose from "mongoose";

const UntrainedQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

export default mongoose.model("UntrainedQuestion", UntrainedQuestionSchema);