const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { port, mongoURI } = require('./config');
const quizRoutes = require('./routes/quiz');

const server = express();

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log(err);
  });

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/', quizRoutes);

// app.get('/', (req, res) => {
//   res.json({
//     questions: [
//       {
//         question: 'Frage 1',
//         options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
//         solution: 3
//       },
//       {
//         question: 'Frage 2',
//         options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
//         solution: 2
//       },
//       {
//         question: 'Frage 3',
//         options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
//         solution: 1
//       },
//       {
//         question: 'Frage 4',
//         options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
//         solution: 0
//       },
//       {
//         question: 'Frage 5',
//         options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
//         solution: 2
//       }
//     ]
//   });
// });

server.listen(port, () => {
  console.log(`Quiz-Service listening on port ${port}`);
});
