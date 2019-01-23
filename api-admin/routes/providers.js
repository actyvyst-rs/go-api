const express = require('express');
const router = express.Router();
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIError = require('jsonapi-serializer').Error;
const mongoose = require('mongoose');
const Provider = require('../models/Provider');
const crud = require('../data/provider');

const providerSerializer = new JSONAPISerializer('Provider', {
  id: '_id',
  attributes: ['name', 'description', 'contact']
});

router.get('/:id', async (req, res) => {
  try {
    const provider = await crud.getProvider(req.params.id);
    return res.send(providerSerializer.serialize(provider));
  } catch (err) {
    res.status(400).send(new JSONAPIError({ code: '123', title: err }));
    console.log(err);
  }
});

module.exports = router;
