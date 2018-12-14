var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var OfferCategorySchema = new Schema({
    icon: {
        type: String
    },
    name: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('OfferCategory', OfferCategorySchema);