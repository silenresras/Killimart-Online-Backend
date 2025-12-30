// models/trainingData.model.js
import mongoose from 'mongoose';

const trainingDataSchema = new mongoose.Schema({
  question: String,
  response: String,
});

export default mongoose.model('TrainingData', trainingDataSchema);
