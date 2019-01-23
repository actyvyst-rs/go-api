const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    data: {
      type: 'Ping',
      id: 0,
      attributes: {
        message: 'Up and running',
        service: 'GO destination API Admin'
      }
    }
  });
});

module.exports = router;
