import { ErrorConst } from "./errors";

interface IExtendableError {
  message: string;
  errors?: any;
  status?: number;
  isPublic?: boolean;
  stack: any;
}

class ExtendableError extends Error {
  errors: any;
  status?: number;
  isPublic?: boolean;
  isOperational: boolean = true;

  constructor(iExtendableError: IExtendableError) {
    super(iExtendableError.message);
    this.name = this.constructor.name;
    this.message = iExtendableError.message;
    this.stack = iExtendableError.stack;
    this.errors = iExtendableError.errors;
    this.status = iExtendableError.status;
    this.isPublic = iExtendableError.isPublic;
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
export class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(iExtendableError: IExtendableError) {
    super({
      message: iExtendableError.message,
      errors: iExtendableError.errors,
      status: ErrorConst.INTERNAL_SERVER_ERROR,
      isPublic: false,
      stack: iExtendableError.stack,
    });
  }
}
