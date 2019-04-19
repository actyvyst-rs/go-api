const moment = require('moment');
const Availability = require('../models/Availability');


const getAvailabilities = async (req, res) => {
    try {

        const availabilities = await Availability.getByDateRange(req.params.id, moment('2019-06-01', 'YYYY-MM-DD').toDate(), moment('2019-06-30', 'YYYY-MM-DD').toDate());

        for (let availability of availabilities) {
            console.log(availability);
        }
        return res.json(
            availabilities
        );
    } catch (err) {
        return res.status(500).send(activitySerializer.serializeError(err));
    }
};



module.exports.getAvailabilities = getAvailabilities;