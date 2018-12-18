const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');
const JSONAPISerializer = require('json-api-serializer');
const { defaultSampleSize } = require('../config');
const quizData = require('../data/quiz.js');

const quizSerializer = new JSONAPISerializer();
quizSerializer.register('Quiz');

router.get('/', (req, res) => {
  //   var sampleSize = parseInt(req.query.numq);
  let samplesize = defaultSampleSize;
  if (req.query.samplesize && Number(req.query.samplesize)) {
    samplesize = parseInt(req.query.samplesize);
  }

  quizData
    .getQuiz(samplesize)
    .then(quiz => {
      quiz.id = uuid();
      res.send(quizSerializer.serialize('Quiz', quiz));
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
