const Question = require('../models/question');

var getQuiz = numQuestions => {
  return new Promise((resolve, reject) => {
    Question.aggregate(
      [{ $sample: { size: numQuestions } }],
      (err, questions) => {
        if (err) {
          reject(err);
        } else {
          var quiz = {};
          quiz.questions = questions;
          quiz.questions.forEach(question => {
            question.solution = shuffle(question.options);
          });
          resolve(quiz);
        }
      }
    );
  });
};

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  var solution = 0;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    if (currentIndex === solution) {
      solution = randomIndex;
    } else {
      if (randomIndex === solution) {
        solution = currentIndex;
      }
    }
  }

  return solution;
}

module.exports.getQuiz = getQuiz;
