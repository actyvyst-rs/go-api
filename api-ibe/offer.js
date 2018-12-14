var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var OfferSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: false
    },
    image: {
    	type: String,
    	required: true
    },
    vendor: {
    	type: String,
    	required: true
    },
    category: {
    	type: String,
    	required: true
    },
    latitude: {
    	type: Number,
    	required: true
    },
    longitude: {
    	type: Number,
    	required: true
    },
    startDate: {
    	type: Date
    },
    endDate: {
    	type: Date
    },
}, { timestamps: true });
 
module.exports = mongoose.model('Offer', OfferSchema);