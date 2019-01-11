const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  id: String,
  started: { type: Date, default: Date.now },
  questions: [
    {
      question: String,
      island: String,
      category: String,
      options: [String],
      solution: Number,
      guess: { type: Number, default: -1 } // -1 for not tried yet
    }
  ]
});

module.exports = mongoose.model('Quiz', quizSchema);
