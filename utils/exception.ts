'use strict';

class CustomError extends Error {
  statusCode: number;
  message: string;
  type: string;

  constructor(message: string, httpCode: number, type: string = 'LOGIC') {
    super(message);
    this.statusCode = httpCode;
    this.message = message;
    this.type = type;
  }
}

export { CustomError };
