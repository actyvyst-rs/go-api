const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const AvailabilitySchema = new Schema({
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

// Get availabilities for an activity in a given daterange
AvailabilitySchema.statics.getByDateRange = async function (activityId, startRange, endRange) {
    try {
        console.log(activityId);
        console.log(startRange);
        console.log(endRange);
        return await this.find({
            activity: new mongoose.Types.ObjectId(activityId),
            $and: [{
                    startDate: {
                        $gte: startRange
                    }
                },
                {
                    startDate: {
                        $lte: endRange
                    }
                }
            ]
        }).exec();
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = Availability = mongoose.model('availabilities', AvailabilitySchema);