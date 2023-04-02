const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class BaseError extends Error {
  constructor(
    name,
    statusCode,
    description
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

//api Specific Errors
class APIError extends BaseError {
  constructor(
    description = "Internal Server Error",
  ) {
    super("API Internal Error", STATUS_CODES.INTERNAL_ERROR, description);
  }
}

//400
class BadRequestError extends BaseError {
  constructor(
    description = "Bad Request",
  ) {
    super("Bad Request", STATUS_CODES.BAD_REQUEST, description);
  }
}

//400
class NotFoundError extends BaseError {
  constructor(
    description = "Not Found",
  ) {
    super("Not Found", STATUS_CODES.NOT_FOUND, description);
  }
}

class AuthorizeError extends BaseError {
  constructor(
    description = "Access denied.",
  ) {
    super("Access denied.", STATUS_CODES.UN_AUTHORISED, description);
  }
}

module.exports = {
  APIError,
  BadRequestError,
  NotFoundError,
	AuthorizeError
};