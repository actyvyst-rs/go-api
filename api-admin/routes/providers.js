const express = require('express');
const router = express.Router();
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPIError = require('jsonapi-serializer').Error;
const Provider = require('../models/Provider');

const providerSerializer = new JSONAPISerializer('Provider', {
  id: '_id',
  attributes: ['name', 'description', 'contact']
});
const providerDeserializer = new JSONAPIDeserializer();

router
  .route('/')
  .get((req, res) => {})
  .post((req, res) => {});

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const provider = await Provider.getById(req.params.id);
      return res.send(providerSerializer.serialize(provider));
    } catch (err) {
      res.status(400).send(
        new JSONAPIError({
          code: 'ADMIN_GET_PROVIDER',
          title: err,
          detail: err
        })
      );
      console.log(err);
    }
  })
  .put(async (req, res) => {})
  .patch(async (req, res) => {
    try {
      const providerPatch = await providerDeserializer.deserialize(req.body);
      console.log(JSON.stringify(providerPatch));
      const { id, ...update } = providerPatch;
      const oldProvider = await Provider.updateById(id, update);
      res.send(providerSerializer.serialize(oldProvider));
    } catch (err) {
      res.status(400).send(
        new JSONAPIError({
          code: 'ADMIN_UPDATE_PROVIDER',
          title: err,
          detail: err
        })
      );
      console.log(err);
    }
  })
  .post(async (req, res) => {});

module.exports = router;
