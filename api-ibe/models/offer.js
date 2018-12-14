var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var OfferSchema = new Schema({
    "title": {
        "type": String,
        "required": true
    },
    "description": {
        "type": String,
        "default": false
    },
    "image": {
    	"type": String,
    	"required": true
    },
    "vendor": {
    	"type": Schema.Types.ObjectId,
    	"required": true
    },
    "category": {
    	"type": Schema.Types.ObjectId,
    	"required": true
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
    "startDate": {
    	"type": Date,
    	"required": true
    },
    "endDate": {
    	"type": Date,
    	"required": true
    }
}, { "timestamps": true });

function _formatSearch(rawsearch){
	var query = {};
    if (rawsearch.vendor && rawsearch.vendor != "0"){
        query.vendor = {
            "$eq": mongoose.Types.ObjectId(rawsearch.vendor),
        };
    }
    if (rawsearch.category && rawsearch.category != "0"){
        query.category = {
            "$eq": mongoose.Types.ObjectId(rawsearch.category),
        };
    }
    if (rawsearch.startDate){
        query.startDate = {
            "$gte": new Date(rawsearch.startDate)
        };
    }else{
        query.startDate = {
            "$gte": new Date()
        };
    }
	return query;
}


OfferSchema.statics.search = function (search, coords, dist, callback){
	var s = _formatSearch(search);
	var query = this.aggregate([{
        "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": coords
            },
            "maxDistance": dist,
            "spherical": true,
            "distanceField": "distance",
            "query": s
        }
    }, {
        "$lookup": {
            "from": "offercategories",
            "localField": "category",
            "foreignField": "_id",
            "as": "offercategory"
        }
    }, {
        "$unwind": "$offercategory"
    }, {
        "$lookup": {
            "from": "vendors",
            "localField": "vendor",
            "foreignField": "_id",
            "as": "vendordata"
        }
    }, {
        "$unwind": "$vendordata"
    }, {
        "$project": {
            "offercategory._id": 0,
            "offercategory.icon": 0,
            "category": 0,
            "offercategory.__v": 0,
            "offercategory.createdAt": 0,
            "offercategory.updatedAt": 0,
            "vendordata._id": 0,
            "vendordata.icon": 0,
            "vendor": 0,
            "vendordata.__v": 0,
            "vendordata.createdAt": 0,
            "vendordata.updatedAt": 0,
            "vendordata.licenceType": 0,
            "vendordata.vendorCategory": 0
        }
    }, {
        "$sort": {
            "startDate": 1,
            "distance": 1
        }
    }]);
    query.exec(callback);
    return query;
}


OfferSchema.statics.findByLocation = function (coords, dist, callback){
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

OfferSchema.statics.findByVendorCategory = function (categoryid, callback){
	var query = this.find({});
	query.where({vendor: categoryid})
	.exec(callback);
	return query;
}

OfferSchema.statics.findByOfferCategory = function (categoryid, callback){
	var query = this.find({});
	query.where({category: categoryid})
	.exec(callback);
	return query;
}
module.exports = mongoose.model('Offer', OfferSchema);