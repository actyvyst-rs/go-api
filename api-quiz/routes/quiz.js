const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');
const { defaultSampleSize } = require('../config');
const quizData = require('../data/quiz.js');

router.get('/', (req, res) => {
  //   var sampleSize = parseInt(req.query.numq);
  quizData
    .getQuiz(defaultSampleSize)
    .then(quiz => {
      res.status(200).json({
        data: {
          type: 'Quiz',
          id: uuid(),
          attributes: {
            questions: quiz.questions
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errors: [
          {
            status: 500,
            code: 'serviceNotAvailable',
            ref_id: uuid(),
            title: 'Service not available',
            details: err.msg,
            source: { parameters: ['database'] }
          }
        ]
      });
    });
});

module.exports = router;
