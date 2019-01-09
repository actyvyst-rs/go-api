class APIError extends Error {
  constructor(status, code, detail) {
    super(detail);
    this.status = status ? status : 500;
    this.code = code;
  }
}

APIError.ErrorCodes = {
  GENERIC: 0,
  AUTH_USER_ALREADY_EXISTS: 1
};

module.exports.APIError = APIError;
