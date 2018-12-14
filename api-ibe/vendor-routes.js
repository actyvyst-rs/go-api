var express = require('express');
var app = module.exports = express.Router();
var Vendor = require('./models/vendor');


// POST new vendor
app.post('/vendors', function (req, res) {
  if (!req.body.name) {
    return res.status(400).send({ "success": false, "msg": "Name of vendor required!" });
  }
 
  var newVendor = new Vendor({
    name: req.body.name,
    address: {
      street: req.body.address.street,
      postalcode: req.body.address.postalcode,
      streetnumber: req.body.address.streetnumber
    },
    vendorCategory: req.body.vendorCategory,
    licenceType: req.body.licenceType,
    image: req.body.image
  });
  newVendor.location.coordinates = req.body.location.coordinates;
  newVendor.save(function (err) {
    if (err) {
      console.log("some error: ", err);
      return res.json({ "success": false, "msg": "Error while creating Vendor", "error": err });
    }
    res.status(201).send({ "success": true, "msg": 'Successfully created new Vendor.' });
  });
});

app.get('/vendorsbycategory/:catId', function (req, res) {
  var catid = req.params.catId;
  Vendor.findByCategory(catid, function (err, vendors) {
    if (err) {
      return res.json({ "success": false, "msg": "No entry found with Cat-Id: "+catid, "error": err });
    }
 
    res.status(200).send({ "success": true, "result": vendors });
  });
});

app.post('/vendorsbylocation', function (req, res) {
  var coordinates = req.body.coordinates;
  var distance = req.body.maxdistance;

  Vendor.findByLocation(coordinates, distance, function (err, vendors) {
    if (err) {
      return res.json({ "success": false, "msg": "No entry found near: "+coordinates.toString(), "error": err });
    }
 
    res.status(200).send({ "success": true, "result": vendors });
  });
});
app.get('/vendors', function (req, res) {
  Vendor.find({}, function (err, vendors) {
    if (err) {
      return res.json({ "success": false, "msg": "Error while retrieving vendors", "error": err });
    }
    res.status(200).send({ "success": true, "result": vendors });
    
  });
});