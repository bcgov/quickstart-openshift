import FieldExceptionResponse from './FieldExceptionResponse';

type ExceptionResponse = {
  errorMessage: string
  fields: Array<FieldExceptionResponse>
}

export default ExceptionResponse;
