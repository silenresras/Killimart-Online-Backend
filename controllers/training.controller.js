// controllers/training.controller.js
import TrainingData from '../models/trainingData.model.js';

export const trainChatbot = async (req, res) => {
  const { question, response } = req.body;

  if (!question || !response) {
    return res.status(400).json({ message: 'Both question and response are required.' });
  }

  try {
    const entry = new TrainingData({ question, response });
    await entry.save();
    return res.status(201).json({ message: 'Training data saved successfully.' });
  } catch (error) {
    console.error('Training error:', error);
    return res.status(500).json({ message: 'Failed to save training data.' });
  }
};
