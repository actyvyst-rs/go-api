var JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports.ActivitySerializer = new JSONAPISerializer('Activity', {
    attributes: ['name', 'category', 'teaser', 'provider', 'images', 'location', 'description', 'infos']
});

