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

export interface VerificationStatus {
  isVerified: boolean;
  result?: VerificationResult;
  error?: string;
  cachedAt?: number;
}

export interface VerificationConfig {
  selfApp: unknown; // SelfApp object from @selfxyz/qrcode
  attestationId: 1 | 2;
  userContextData: string;
  expiresAt: number;
}

export interface VerificationRequirements {
  enabled: boolean;
  minimumAge: number;
  excludedCountries: string[];
  ofacCheck: boolean;
  requireNationality: boolean;
  allowedNationalities: string[];
  sessionTimeout: number;
}

export interface VerificationRequest {
  attestationId: 1 | 2;
  proof: unknown;
  pubSignals: unknown;
  userContextData: string;
}

export interface VerificationResponse {
  isVerified: boolean;
  result?: VerificationResult;
  error?: string;
}

export interface BulkVerificationStatus {
  tapId: string;
  isVerified: boolean;
  result?: VerificationResult;
  error?: string;
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