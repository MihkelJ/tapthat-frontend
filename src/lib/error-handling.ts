import type { VerificationError } from '@/types/verification';

export function handleVerificationError(error: unknown, _tapId: string, _walletAddress: string): VerificationError {
  const errorObj = error as Record<string, unknown>;
  
  // Handle network errors
  if (errorObj.name === 'NetworkError' || (typeof errorObj.message === 'string' && errorObj.message.includes('fetch'))) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to verification service. Please check your internet connection and try again.',
      details: error,
    };
  }

  // Handle HTTP errors
  if (typeof errorObj.status === 'number') {
    switch (errorObj.status) {
      case 400:
        return {
          code: 'INVALID_PROOF',
          message: 'Invalid verification data provided. Please try again.',
          details: error,
        };
      case 401:
        return {
          code: 'VERIFICATION_FAILED',
          message: 'Identity verification failed. Please ensure your documents are valid and try again.',
          details: error,
        };
      case 403:
        return {
          code: 'VERIFICATION_FAILED',
          message: 'Access denied. You may not meet the age or location requirements for this tap.',
          details: error,
        };
      case 404:
        return {
          code: 'VERIFICATION_FAILED',
          message: 'Verification configuration not found. Please contact support.',
          details: error,
        };
      case 429:
        return {
          code: 'VERIFICATION_FAILED',
          message: 'Too many verification attempts. Please wait before trying again.',
          details: error,
        };
      case 500:
        return {
          code: 'VERIFICATION_FAILED',
          message: 'Verification service is temporarily unavailable. Please try again later.',
          details: error,
        };
      default:
        return {
          code: 'UNKNOWN_ERROR',
          message: `Verification failed with status ${errorObj.status}. Please try again.`,
          details: error,
        };
    }
  }

  // Handle expired session
  if (typeof errorObj.message === 'string' && (errorObj.message.includes('expired') || errorObj.message.includes('timeout'))) {
    return {
      code: 'EXPIRED_SESSION',
      message: 'Your verification session has expired. Please start the verification process again.',
      details: error,
    };
  }

  // Handle specific Self.xyz errors
  if (typeof errorObj.message === 'string' && errorObj.message.includes('Self')) {
    return {
      code: 'VERIFICATION_FAILED',
      message: 'Self.xyz verification failed. Please ensure you have the latest version of the Self app and try again.',
      details: error,
    };
  }

  // Handle QR code errors
  if (typeof errorObj.message === 'string' && (errorObj.message.includes('QR') || errorObj.message.includes('scan'))) {
    return {
      code: 'VERIFICATION_FAILED',
      message: 'QR code scanning failed. Please try scanning the code again.',
      details: error,
    };
  }

  // Default error
  return {
    code: 'UNKNOWN_ERROR',
    message: (typeof errorObj.message === 'string' ? errorObj.message : 'An unknown error occurred during verification. Please try again.'),
    details: error,
  };
}

export function getErrorMessage(error: VerificationError): string {
  return error.message;
}

export function getErrorActionSuggestion(error: VerificationError): string {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Check your internet connection and try again.';
    case 'INVALID_PROOF':
      return 'Please restart the verification process.';
    case 'VERIFICATION_FAILED':
      return 'Please verify your documents and try again.';
    case 'EXPIRED_SESSION':
      return 'Please start a new verification session.';
    default:
      return 'Please try again or contact support if the problem persists.';
  }
}

export function shouldRetryError(error: VerificationError): boolean {
  return error.code === 'NETWORK_ERROR' || error.code === 'UNKNOWN_ERROR';
}

export function getRetryDelay(error: VerificationError): number {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 3000; // 3 seconds
    case 'UNKNOWN_ERROR':
      return 5000; // 5 seconds
    default:
      return 0; // No retry
  }
}

export class VerificationErrorHandler {
  private static instance: VerificationErrorHandler;
  private errorLog: VerificationError[] = [];

  static getInstance(): VerificationErrorHandler {
    if (!VerificationErrorHandler.instance) {
      VerificationErrorHandler.instance = new VerificationErrorHandler();
    }
    return VerificationErrorHandler.instance;
  }

  logError(error: VerificationError, context?: { tapId?: string; walletAddress?: string; action?: string }): void {
    const errorWithContext = {
      ...error,
      timestamp: Date.now(),
      context,
    };

    this.errorLog.push(errorWithContext);
    
    // Keep only last 50 errors
    if (this.errorLog.length > 50) {
      this.errorLog = this.errorLog.slice(-50);
    }

    // Log to console for debugging
    console.error('Verification error:', errorWithContext);
  }

  getErrorHistory(): VerificationError[] {
    return [...this.errorLog];
  }

  clearErrorHistory(): void {
    this.errorLog = [];
  }

  getErrorsByType(code: VerificationError['code']): VerificationError[] {
    return this.errorLog.filter(error => error.code === code);
  }
}