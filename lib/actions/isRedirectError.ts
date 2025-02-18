// Custom type guard for redirect errors
function isRedirectError(error: unknown): error is Error {
    const NEXT_REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
    return (
      error instanceof Error &&
      'digest' in error &&
      (error as any).digest === NEXT_REDIRECT_ERROR_CODE
    );
  }
  export default isRedirectError;