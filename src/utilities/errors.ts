export namespace ErrorConst {
  // Http codes
  export const BAD_REQUEST = 400;
  export const UNAUTHORIZED = 401;
  export const FORBIDDEN = 403;
  export const NOT_FOUND = 404;
  export const REQUEST_TIME_OUT = 408;
  export const CONFLICT = 409;
  export const INTERNAL_SERVER_ERROR = 500;
  export const BAD_GATEWAY = 502;
  export const SERVICE_UNAVAILABLE = 503;
  export const GATEWAY_TIMEOUT = 504;

  // Error Messages
  export const GENERAL_ERROR_MSG = "Internal Server Error";
  export const HANDLER_NOT_FOUND = "Requested resource not found";
  export const INVALID_URI_FORMAT = "Invalid URI format";
  export const VALIDATION_ERROR_MSG = "Please pass valid payload";
  export const REQUEST_ERROR =
    "The request was made but no response was received";

  // Error codes
  export const MONGO_DUPLICATE_ERROR = 11000;
}

export class CustomError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.status = status;
  }
}
