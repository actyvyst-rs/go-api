const { ParamError } = require('./err');

// Extracts key/value pairs from obj for keys specified in params and returns them as object. If one ore more keys are missing, it returns a ParamError containing a list of missing parameters

const extractRequestParams = (obj, params) => {
  return new Promise((resolve, reject) => {
    let result = {};
    let missingParams = [];
    if (!obj || !params) {
      return reject(new Error('Invalid args'));
    }
    Object.keys(params).forEach(key => {
      if (obj[key]) {
        result[key] = obj[key];
      } else {
        missingParams.push(key);
      }
    });
    if (missingParams.length === 0) {
      return resolve(result);
    } else {
      console.log(missingParams);
      return reject(new ParamError('Parameters could not be found'));
    }
  });
};

module.exports.extractRequestParams = extractRequestParams;
