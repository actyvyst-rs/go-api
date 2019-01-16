const express = require('express');
const router = express.Router();

const pingHandler = (req, res) => {
  res.json({
    data: {
      type: 'Ping',
      id: 0,
      attributes: {
        message: 'Up and running',
        // uri: req.req.originalUrl,
        service: 'GO destination API gateway'
      }
    }
  });
};

router.get('/', pingHandler);

module.exports = router;
