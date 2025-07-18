export interface VerificationResult {
  isValid: boolean;
  isAgeValid: boolean;
  isOfacValid: boolean;
  nationality?: string;
  userIdentifier: string;
  attestationId: 1 | 2;
  verifiedAt: number;
  expiresAt: number;
}

export interface VerificationRequest {
  attestationId: 1 | 2;
  proof: unknown;
  pubSignals: unknown;
  userContextData: string;
}

export interface SmartVerificationResult {
  success: boolean;
  unlockedTaps: string[];
  remainingTaps: string[];
  message?: string;
}

export type VerificationError = {
  code: 'VERIFICATION_FAILED' | 'NETWORK_ERROR' | 'INVALID_PROOF' | 'EXPIRED_SESSION' | 'UNKNOWN_ERROR';
  message: string;
  details?: unknown;
};
