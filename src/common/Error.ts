export enum ErrorType {
  INVALID_ARGUMENT = 'Invalid Argument',
  EXECUTION_FAILURE = 'Execution failure'
}

namespace Error {
  export function fail(message: string, type: ErrorType) {
    if (type === ErrorType.INVALID_ARGUMENT)
      console.info(`ℹ️ Please check the API reference for more information: http://localhost.com`);
    throw new window['Error'](`(${type}) ${message}`);
  }
}

export default Error;
