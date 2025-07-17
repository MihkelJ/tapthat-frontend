import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { PositiveResponse } from '@/lib/client';
import { cn } from '@/lib/utils';
import { useMultipleTapsStatus } from '@/lib/verification-hooks';
import { useVerification } from '@/providers/VerificationProvider';
import { AlertCircle, CheckCircle2, Loader2, Shield, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BulkVerificationIndicatorProps {
  taps: PositiveResponse['get /v1/beer-taps']['data']['beerTaps'];
  className?: string;
  showDetails?: boolean;
}

export function BulkVerificationIndicator({ taps, className, showDetails = false }: BulkVerificationIndicatorProps) {
  const { walletAddress, openVerificationModal } = useVerification();
  const tapIds = taps.map(tap => tap.id!);
  const { data: statuses, isLoading, isError } = useMultipleTapsStatus(tapIds, walletAddress);

  const [verificationProgress, setVerificationProgress] = useState(0);

  useEffect(() => {
    if (statuses) {
      const verifiedCount = statuses.filter(status => status.isVerified).length;
      const progress = tapIds.length > 0 ? (verifiedCount / tapIds.length) * 100 : 0;
      setVerificationProgress(progress);
    }
  }, [statuses, tapIds.length]);

  const getUnverifiedTaps = () => {
    if (!statuses) return [];
    return statuses.filter(status => !status.isVerified);
  };

  const getVerifiedCount = () => {
    if (!statuses) return 0;
    return statuses.filter(status => status.isVerified).length;
  };

  const handleBulkVerify = () => {
    const unverifiedTaps = getUnverifiedTaps();
    if (unverifiedTaps.length > 0) {
      openVerificationModal(unverifiedTaps[0].tapId);
    }
  };

  const verifiedCount = getVerifiedCount();
  const totalTaps = tapIds.length;
  const unverifiedTaps = getUnverifiedTaps();

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2 p-3 rounded-lg bg-muted/50', className)}>
        <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>Checking verification status...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('flex items-center gap-2 p-3 rounded-lg bg-destructive/10', className)}>
        <AlertCircle className='w-4 h-4 text-destructive' />
        <span className='text-sm text-destructive'>Failed to check verification status</span>
      </div>
    );
  }

  if (verifiedCount === totalTaps) {
    return (
      <div className={cn('flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200', className)}>
        <CheckCircle2 className='w-4 h-4 text-green-600' />
        <span className='text-sm text-green-700 font-medium'>All {totalTaps} taps accessible</span>
        <Badge variant='secondary' className='ml-auto'>
          <Users className='w-3 h-3 mr-1' />
          {totalTaps}
        </Badge>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3 p-3 rounded-lg bg-muted/50', className)}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Shield className='w-4 h-4 text-muted-foreground' />
          <span className='text-sm font-medium'>
            {verifiedCount} of {totalTaps} taps accessible
          </span>
        </div>
        <Badge variant='outline'>{Math.round(verificationProgress)}%</Badge>
      </div>

      <Progress value={verificationProgress} className='h-2' />

      {unverifiedTaps.length > 0 && (
        <div className='flex items-center justify-between'>
          <span className='text-xs text-muted-foreground'>
            {unverifiedTaps.length} tap{unverifiedTaps.length !== 1 ? 's' : ''} need verification
          </span>
          <Button onClick={handleBulkVerify} size='sm' className='h-7 px-3 text-xs'>
            <Shield className='w-3 h-3 mr-1' />
            Verify Access
          </Button>
        </div>
      )}

      {showDetails && statuses && (
        <div className='space-y-1 pt-2 border-t'>
          <p className='text-xs font-medium text-muted-foreground mb-2'>Tap Status:</p>
          {statuses.map(status => {
            const tap = taps.find(t => t.id === status.tapId);
            if (!tap) return null;

            return (
              <div key={status.tapId} className='flex items-center justify-between text-xs'>
                <span className='truncate max-w-[150px]'>{tap.title}</span>
                {status.isVerified ? (
                  <Badge variant='secondary' className='h-5 px-2 text-xs'>
                    <CheckCircle2 className='w-3 h-3 mr-1' />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant='outline' className='h-5 px-2 text-xs'>
                    <Shield className='w-3 h-3 mr-1' />
                    Needs Verification
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
