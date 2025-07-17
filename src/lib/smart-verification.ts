import { checkMultipleTapsStatus } from './api';
import type { SmartVerificationResult } from '@/types/verification';
import type { BeerTapItem } from '@/types/beer';

export async function smartVerificationFlow(
  taps: BeerTapItem[],
  walletAddress: string
): Promise<SmartVerificationResult> {
  const tapIds = taps.map(tap => tap.id);
  
  try {
    // Check current status for all taps
    const statuses = await checkMultipleTapsStatus(tapIds, walletAddress);
    
    // Find taps that need verification
    const unverifiedTaps = statuses.filter(status => !status.isVerified).map(status => status.tapId);
    
    if (unverifiedTaps.length === 0) {
      return {
        success: true,
        unlockedTaps: tapIds,
        remainingTaps: [],
        message: 'All taps accessible'
      };
    }
    
    // Get all unlocked taps
    const unlockedTaps = statuses.filter(status => status.isVerified).map(status => status.tapId);
    
    return {
      success: unverifiedTaps.length === 0,
      unlockedTaps,
      remainingTaps: unverifiedTaps,
      message: unverifiedTaps.length > 0 
        ? `${unverifiedTaps.length} tap${unverifiedTaps.length !== 1 ? 's' : ''} need verification`
        : 'All taps accessible'
    };
  } catch (error) {
    console.error('Smart verification flow failed:', error);
    return {
      success: false,
      unlockedTaps: [],
      remainingTaps: tapIds,
      message: 'Failed to check verification status'
    };
  }
}

export async function progressiveVerification(
  tapIds: string[],
  walletAddress: string
): Promise<string[]> {
  const verifiedTaps: string[] = [];
  
  for (const tapId of tapIds) {
    try {
      const statuses = await checkMultipleTapsStatus([tapId], walletAddress);
      const status = statuses[0];
      
      if (status?.isVerified) {
        verifiedTaps.push(tapId);
      } else {
        // This tap needs verification
        // In a real implementation, this would trigger the verification flow
        // For now, we'll break and let the UI handle it
        break;
      }
    } catch (error) {
      console.error(`Failed to check verification for tap ${tapId}:`, error);
      break;
    }
  }
  
  return verifiedTaps;
}

export function findCompatibleTaps(
  taps: BeerTapItem[],
  targetTap: BeerTapItem
): BeerTapItem[] {
  if (!targetTap.identityVerification?.enabled) {
    return [];
  }
  
  return taps.filter(tap => {
    if (!tap.identityVerification?.enabled || tap.id === targetTap.id) {
      return false;
    }
    
    // Check if verification requirements are identical
    const target = targetTap.identityVerification;
    const current = tap.identityVerification;
    
    if (!target || !current) return false;
    
    return (
      target.minimumAge === current.minimumAge &&
      target.ofacCheck === current.ofacCheck &&
      target.requireNationality === current.requireNationality &&
      JSON.stringify(target.excludedCountries?.sort()) === JSON.stringify(current.excludedCountries?.sort()) &&
      JSON.stringify(target.allowedNationalities?.sort()) === JSON.stringify(current.allowedNationalities?.sort())
    );
  });
}

export function groupTapsByVerificationRequirements(
  taps: BeerTapItem[]
): Record<string, BeerTapItem[]> {
  const groups: Record<string, BeerTapItem[]> = {};
  
  for (const tap of taps) {
    if (!tap.identityVerification?.enabled) {
      continue;
    }
    
    const requirements = tap.identityVerification;
    const key = JSON.stringify({
      minimumAge: requirements.minimumAge,
      ofacCheck: requirements.ofacCheck,
      requireNationality: requirements.requireNationality,
      excludedCountries: requirements.excludedCountries?.sort(),
      allowedNationalities: requirements.allowedNationalities?.sort(),
    });
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(tap);
  }
  
  return groups;
}