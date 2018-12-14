var express = require('express');
 
var app = module.exports = express.Router();
 
var Offer = require('./models/offer');
var OfferCategory = require('./models/offercategory'); 
// POST
// Create a new Offer
app.post('/offers', function (req, res) {
  if (!req.body.title) {
    return res.status(400).send({ "success": false, "msg": "No appropriate data send to store offer!" });
  }
 
  var newOffer = new Offer({
    title: req.body.title,
    description: req.body.description,
    vendor: req.body.vendor,
    category: req.body.category,
    location: req.body.location,
    address: {
      street: req.body.address.street,
      postalcode: req.body.address.postalcode,
      streetnumber: req.body.address.streetnumber,
      city: req.body.address.city
    },
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    image: req.body.image
  });
 
  newOffer.save(function (err) {
    if (err) {
      console.log("some error: ", err);
      return res.json({ "success": false, "msg": "Error while creating offer", "error": err });
    }
    res.status(201).send({ "success": true, "msg": 'Successfully created new offer.' });
  });
});

// Create new offer category
app.post('/offercategory', function (req, res) {
  if (!req.body.name) {
    return res.status(400).send({ "success": false, "msg": "No appropriate data send to store offer category!" });
  }
 
  var newOfferCategory = new OfferCategory({
    name: req.body.name,
    icon: req.body.icon
  });
 
  newOfferCategory.save(function (err) {
    if (err) {
      console.log("some error: ", err);
      return res.json({ "success": false, "msg": "Error while creating offer category", "error": err });
    }
    res.status(201).send({ "success": true, "msg": 'Successfully created new offer category.' });
  });
});


// GET
// Get all Offers
app.get('/offers', function (req, res) {
  Offer.find({}, function (err, offers) {
    if (err) {
      return res.json({ "success": false, "msg": "Error while retrieving offers", "error": err });
    }
    res.status(200).send({ "success": true, "result": offers });
    
  });
});
app.post('/search/offers', function (req, res){
  var search = req.body.searchcriteria;
  var coordinates = req.body.coordinates;
  var distance = req.body.maxdistance;
  Offer.search(search, coordinates, distance, function (err, offers) {
    if (err) {
      return res.json({ "success": false, "msg": "No entries found. An error occurred.", "error": err });
    }
 
    res.status(200).send({ "success": true, "result": offers });
  });
});

app.post('/offersbylocation', function (req, res) {
  var coordinates = req.body.coordinates;
  var distance = req.body.maxdistance;

  Offer.findByLocation(coordinates, distance, function (err, offers) {
    if (err) {
      return res.json({ "success": false, "msg": "No entry found near: "+coordinates.toString(), "error": err });
    }
 
    res.status(200).send({ "success": true, "result": offers });
  });
});

app.post('/offersbycategory', function (req, res) {
  var category = req.body.categoryid;
  

  Offer.findByOfferCategory(category, function (err, offers) {
    if (err) {
      return res.json({ "success": false, "msg": "No entry found near: "+coordinates.toString(), "error": err });
    }
 
    res.status(200).send({ "success": true, "result": offers });
  });
});