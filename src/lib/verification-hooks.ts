import type { VerificationRequest } from '@/types/verification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkMultipleTapsStatus, checkVerificationStatus, getVerificationConfig, verifyIdentity } from './api';

export function useVerificationConfig(tapId: string, walletAddress: string | null) {
  return useQuery({
    queryKey: ['verificationConfig', tapId, walletAddress],
    queryFn: () => getVerificationConfig(tapId, walletAddress!),
    enabled: !!tapId && !!walletAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useVerificationStatus(tapId: string, walletAddress: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['verificationStatus', tapId, walletAddress],
    queryFn: () => checkVerificationStatus(tapId, walletAddress!),
    enabled: options?.enabled !== false && !!tapId && !!walletAddress,
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
  });
}

export function useMultipleTapsStatus(tapIds: string[], walletAddress: string | null) {
  return useQuery({
    queryKey: ['multipleTapsStatus', tapIds, walletAddress],
    queryFn: () => checkMultipleTapsStatus(tapIds, walletAddress!),
    enabled: tapIds.length > 0 && !!walletAddress,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
}

export function useVerificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: VerificationRequest) => verifyIdentity(request),
    onSuccess: (_, variables) => {
      try {
        const userContextData = JSON.parse(variables.userContextData);
        const { tapId, walletAddress } = userContextData;

        // Invalidate verification status for this tap
        queryClient.invalidateQueries({
          queryKey: ['verificationStatus', tapId, walletAddress],
        });

        // Invalidate multiple taps status queries that might include this tap
        queryClient.invalidateQueries({
          queryKey: ['multipleTapsStatus'],
          predicate: query => {
            const [, tapIds] = query.queryKey;
            return Array.isArray(tapIds) && tapIds.includes(tapId);
          },
        });

        // Also invalidate any other verification-related queries
        queryClient.invalidateQueries({
          queryKey: ['verificationStatus'],
          predicate: query => {
            const [, , queryWalletAddress] = query.queryKey;
            return queryWalletAddress === walletAddress;
          },
        });
      } catch (error) {
        console.error('Error parsing userContextData:', error);
      }
    },
    onError: error => {
      console.error('Verification failed:', error);
    },
  });
}

export function useRefreshVerificationStatus() {
  const queryClient = useQueryClient();

  return (tapId?: string, walletAddress?: string) => {
    if (tapId && walletAddress) {
      queryClient.invalidateQueries({
        queryKey: ['verificationStatus', tapId, walletAddress],
      });
    } else if (walletAddress) {
      queryClient.invalidateQueries({
        queryKey: ['verificationStatus'],
        predicate: query => {
          const [, , queryWalletAddress] = query.queryKey;
          return queryWalletAddress === walletAddress;
        },
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['verificationStatus'],
      });
    }

    queryClient.invalidateQueries({
      queryKey: ['multipleTapsStatus'],
    });
  };
}

// Hook for smart verification flow
export function useSmartVerificationFlow(tapIds: string[], walletAddress: string | null) {
  const statusQuery = useMultipleTapsStatus(tapIds, walletAddress);
  const verificationMutation = useVerificationMutation();

  const getVerificationSummary = () => {
    if (!statusQuery.data) return null;

    const verified = statusQuery.data.filter(status => status.isVerified);
    const unverified = statusQuery.data.filter(status => !status.isVerified);

    return {
      total: statusQuery.data.length,
      verified: verified.length,
      unverified: unverified.length,
      verifiedTaps: verified.map(status => status.tapId),
      unverifiedTaps: unverified.map(status => status.tapId),
      progress: statusQuery.data.length > 0 ? (verified.length / statusQuery.data.length) * 100 : 0,
    };
  };

  const verifyForCompatibleTaps = async (tapId: string) => {
    try {
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      await getVerificationConfig(tapId, walletAddress);

      return new Promise<void>(resolve => {
        // In a real implementation, this would trigger the QR code flow
        // For now, we'll just resolve
        resolve();
      });
    } catch (error) {
      console.error('Failed to get verification config:', error);
      throw error;
    }
  };

  return {
    tapStatuses: statusQuery.data || [],
    isLoading: statusQuery.isLoading,
    isError: statusQuery.isError,
    error: statusQuery.error,
    verifyForCompatibleTaps,
    isVerifying: verificationMutation.isPending,
    summary: getVerificationSummary(),
  };
}
