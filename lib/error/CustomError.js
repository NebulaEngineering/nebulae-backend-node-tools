const INTERNAL_SERVER_ERROR_CODE = 00001;
const PERMISSION_DENIED = 00002;

/**
 * Custom Error
 */
class CustomError extends Error {
  constructor(name, method, code = INTERNAL_SERVER_ERROR_CODE, message = '') {
    super(message);
    this.code = code;
    this.name = name;
    this.method = method;
  }

  getContent() {
    return {
      name: this.name,
      code: this.code,
      msg: this.message,
    }
  }
}

/**
 * @returns {{CustomError:CustomError, INTERNAL_SERVER_ERROR_CODE: number, PERMISSION_DENIED:number}}
 */
module.exports = {
  CustomError,
  INTERNAL_SERVER_ERROR_CODE,
  PERMISSION_DENIED,
} 