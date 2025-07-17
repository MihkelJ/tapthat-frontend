import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  getErrorActionSuggestion,
  handleVerificationError,
  shouldRetryError,
  VerificationErrorHandler,
} from '@/lib/error-handling';
import { useVerificationConfig, useVerificationMutation } from '@/lib/verification-hooks';
import { useVerification } from '@/providers/VerificationProvider';
import { SelfAppBuilder, SelfQRcode } from '@selfxyz/qrcode';
import { AlertCircle, CheckCircle2, Loader2, RefreshCw, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface VerificationModalProps {
  tapId: string;
  tapTitle: string;
  onVerificationComplete?: (success: boolean) => void;
}

export function VerificationModal({ tapId, tapTitle, onVerificationComplete }: VerificationModalProps) {
  const { walletAddress, isVerificationModalOpen, closeVerificationModal } = useVerification();
  const [verificationStep, setVerificationStep] = useState<'loading' | 'qr' | 'verifying' | 'success' | 'error'>(
    'loading'
  );
  const [error, setError] = useState<string | null>(null);
  const [errorAction, setErrorAction] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);

  const configQuery = useVerificationConfig(tapId, walletAddress);
  const verificationMutation = useVerificationMutation();
  const errorHandler = VerificationErrorHandler.getInstance();

  const selfApp = useMemo(() => {
    if (!configQuery.data?.data) {
      return null;
    }

    console.log(configQuery.data.data);
    try {
      return new SelfAppBuilder({
        ...configQuery.data.data,
      }).build();
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [configQuery.data]);

  useEffect(() => {
    if (!isVerificationModalOpen) {
      setVerificationStep('loading');
      setError(null);
    }
  }, [isVerificationModalOpen]);

  useEffect(() => {
    if (configQuery.isSuccess) {
      setVerificationStep('qr');
    } else if (configQuery.isError) {
      const verificationError = handleVerificationError(configQuery.error, tapId, walletAddress || '');
      errorHandler.logError(verificationError, { tapId, walletAddress: walletAddress || '', action: 'load_config' });

      setVerificationStep('error');
      setError(verificationError.message);
      setErrorAction(getErrorActionSuggestion(verificationError));
      setCanRetry(shouldRetryError(verificationError));
    }
  }, [configQuery.isSuccess, configQuery.isError, configQuery.error, tapId, walletAddress, errorHandler]);

  useEffect(() => {
    if (verificationMutation.isSuccess) {
      setVerificationStep('success');
      onVerificationComplete?.(true);
      setTimeout(() => {
        closeVerificationModal();
      }, 2000);
    } else if (verificationMutation.isError) {
      const verificationError = handleVerificationError(verificationMutation.error, tapId, walletAddress || '');
      errorHandler.logError(verificationError, {
        tapId,
        walletAddress: walletAddress || '',
        action: 'verify_identity',
      });

      setVerificationStep('error');
      setError(verificationError.message);
      setErrorAction(getErrorActionSuggestion(verificationError));
      setCanRetry(shouldRetryError(verificationError));
      onVerificationComplete?.(false);
    }
  }, [
    verificationMutation.isSuccess,
    verificationMutation.isError,
    verificationMutation.error,
    onVerificationComplete,
    closeVerificationModal,
    tapId,
    walletAddress,
    errorHandler,
  ]);

  const handleRetry = () => {
    setError(null);
    setErrorAction(null);
    setCanRetry(false);
    setVerificationStep('loading');
    configQuery.refetch();
  };

  const renderContent = () => {
    switch (verificationStep) {
      case 'loading':
        return (
          <div className='flex flex-col items-center justify-center py-8'>
            <Loader2 className='w-8 h-8 animate-spin text-primary mb-4' />
            <p className='text-sm text-muted-foreground'>Loading verification configuration...</p>
          </div>
        );

      case 'qr':
        return (
          <div className='flex flex-col items-center space-y-4'>
            <div className='text-center'>
              <p className='text-sm text-muted-foreground mb-4'>
                Scan this QR code with your Self app to verify your identity for <strong>{tapTitle}</strong>
              </p>
            </div>

            <div className='bg-white p-4 rounded-lg border'>
              {selfApp && (
                <SelfQRcode
                  selfApp={selfApp}
                  onSuccess={() => {
                    setVerificationStep('success');
                    onVerificationComplete?.(true);
                    setTimeout(() => {
                      closeVerificationModal();
                    }, 2000);
                  }}
                  onError={error => {
                    const verificationError = handleVerificationError(error, tapId, walletAddress || '');
                    errorHandler.logError(verificationError, {
                      tapId,
                      walletAddress: walletAddress || '',
                      action: 'qr_scan',
                    });

                    setVerificationStep('error');
                    setError(verificationError.message);
                    setErrorAction(getErrorActionSuggestion(verificationError));
                    setCanRetry(shouldRetryError(verificationError));
                    onVerificationComplete?.(false);
                  }}
                  size={250}
                />
              )}
            </div>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                Please scan this QR code with the Self app to verify your identity
              </p>
            </div>
          </div>
        );

      case 'verifying':
        return (
          <div className='flex flex-col items-center justify-center py-8'>
            <Loader2 className='w-8 h-8 animate-spin text-primary mb-4' />
            <p className='text-sm text-muted-foreground text-center'>
              Verifying your identity...
              <br />
              This may take a few moments.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className='flex flex-col items-center justify-center py-8'>
            <CheckCircle2 className='w-12 h-12 text-green-500 mb-4' />
            <p className='text-lg font-semibold text-green-700 mb-2'>Verification Successful!</p>
            <p className='text-sm text-muted-foreground text-center'>
              You now have access to <strong>{tapTitle}</strong> and other compatible taps.
            </p>
          </div>
        );

      case 'error':
        return (
          <div className='space-y-4'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error || 'An error occurred during verification'}</AlertDescription>
            </Alert>

            {errorAction && <div className='text-sm text-muted-foreground text-center'>{errorAction}</div>}

            <div className='flex justify-center gap-2'>
              <Button onClick={handleRetry} variant='outline' disabled={!canRetry}>
                <RefreshCw className='w-4 h-4 mr-2' />
                {canRetry ? 'Try Again' : 'Retry Not Available'}
              </Button>
              <Button onClick={closeVerificationModal} variant='secondary'>
                Close
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isVerificationModalOpen} onOpenChange={closeVerificationModal}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-between'>
            Identity Verification
            <Button variant='ghost' size='sm' onClick={closeVerificationModal} className='h-auto p-0'>
              <X className='h-4 w-4' />
            </Button>
          </DialogTitle>
          <DialogDescription>Verify your identity to access age-restricted beer taps.</DialogDescription>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
