var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var VendorCategorySchema = new Schema({
    icon: {
        type: String
    },
    name: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('VendorCategory', VendorCategorySchema);