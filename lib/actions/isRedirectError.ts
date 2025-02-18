// Custom type guard for redirect errors
function isRedirectError(error: unknown): error is Error {
  const NEXT_REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';

  // First, check if error is an instance of Error and has the 'digest' property
  if (error instanceof Error && 'digest' in error) {
    // Safely assert that 'error' has the 'digest' property
    const e = error as { digest: string };

    // Check if the 'digest' matches the redirect error code
    return e.digest === NEXT_REDIRECT_ERROR_CODE;
  }

  return false;
}

export default isRedirectError;
