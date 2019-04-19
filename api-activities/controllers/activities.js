const Activity = require('../models/Activity');
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const mongoose = require('mongoose');
const util = require('util');

const deserializer = new JSONAPIDeserializer();
const serializer = require('../serializer/Activity');

// Create new Activity
const createActivity = async (req, res, next) => {
    try {
        let data = req.body.data[0].attributes;
        console.log(util.inspect(data, false, null, true));
        let activity = new Activity(data);
        await activity.save();
        return res.json({ msg: 'done' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
    }
}

const updateActivity = async (req, res, next) => {
    try {
        let data = req.body.data[0].attributes;
        const matchPhrase = {
            _id: mongoose.Types.ObjectId(req.params.id)
        };
        let activity = await Activity.updateOne({ _id: matchPhrase._id }, { $set: data }).exec();
        return res.json({ msg: 'done' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
    }
}

module.exports.createActivity = createActivity;
module.exports.updateActivity = updateActivity;