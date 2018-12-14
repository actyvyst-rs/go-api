var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VendorCategory = require('./vendorcategory');

// GEO-JSON Index für DB: db.vendors.createIndex({ location: "2dsphere" });
var vendorSchema = new Schema({
    "name": {
        "type": String,
        "required": true
    },
    "address": {
        "street": {
        	"type": String
        },
        "streetnumber": {
        	"type": String
        },
        "postalcode": {
        	"type": Number
        },
        "city": {
            "type": String
        }
        
    },
    "location": {
    	"type": {
            "type": String, 
            "default": "Point"
        },
    	"coordinates": {
            "type": [Number],
            "required": true 
        }
    },
    "vendorCategory": {
    	"type": Schema.Types.ObjectId
    },
    "licenceType": {
    	"type": Schema.Types.ObjectId
    },
    "image": {
    	"type": String
    }
}, { "timestamps": true });
 
vendorSchema.statics.findByCategory = function (categoryid, callback){
	var query = this.find({});
	query.where({vendorCategory: categoryid})
	.exec(callback);
	return query;
}
vendorSchema.statics.findByLocation = function (coords, dist, callback){
    // var query = this.find({
    //     location: {
    //         $nearSphere: {
    //             $geometry: {
    //                 type: "Point",
    //                 coordinates: coords
    //             },
    //             $maxDistance: dist
    //         }
    //     }
    // });
    var query = this.aggregate([
        { "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": coords
            }, 
            "maxDistance": dist,
            "spherical": true,
            "distanceField": "distance"
            
        }}
    ]);
    debugger;
    query.exec(callback);
    return query;
}

module.exports = mongoose.model('Vendor', vendorSchema);