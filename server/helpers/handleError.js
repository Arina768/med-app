export default class ApiError extends Error {
  constructor(code, message, errors = []) {
    super(message);
    this.code = code;
    this.message = message;
    this.errors = errors;
  }

  static UnauthorizedError(message = "Unauthorized user") {
    return new ApiError(401, message);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static AuthenticationError(message) {
    return new ApiError(403, message);
  }

  static NotFoundError(message) {
    return new ApiError(404, message);
  }

  static ValidationError(message) {
    return new ApiError(422, message);
  }
}
