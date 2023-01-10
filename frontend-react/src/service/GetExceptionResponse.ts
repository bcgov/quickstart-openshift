import ExceptionResponse from '../types/ExceptionResponse';

/**
 * Retrieve the exception response and parse it to a ExceptionResponse object.
 *
 * @param {unknown | Error} error the error instance to be handled.
 * @returns {ExceptionResponse} an exception response instance containin
 * errorMessage and fields.
 */
function getExceptionResponse(error: unknown | Error): ExceptionResponse {
  if (error instanceof Error) {
    try {
      const excResponse: ExceptionResponse = JSON.parse(String(error.message));
      return excResponse;
    } catch (e) {
      return {
        errorMessage: 'Unable to parse JSON response. Maybe the server is down!?',
        fields: []
      };
    }
  }

  return {
    errorMessage: String(error),
    fields: []
  };
}

export default getExceptionResponse;
