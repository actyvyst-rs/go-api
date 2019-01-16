class APIError extends Error {
  constructor(status, code, detail) {
    super(detail);
    this.status = status ? status : 500;
    this.code = code;
  }
}

module.exports.APIError = APIError;
