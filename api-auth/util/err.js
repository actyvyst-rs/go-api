class ParamError extends Error {
  constructor(msg, missingParams = []) {
    super(msg);
    this.missingParams = missingParams;
  }
}

module.exports.ParamError = ParamError;
