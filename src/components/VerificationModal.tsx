import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  getErrorActionSuggestion,
  handleVerificationError,
  shouldRetryError,
  VerificationErrorHandler,
} from '@/lib/error-handling';
import { useVerificationConfig, useVerificationMutation } from '@/lib/verification-hooks';
import { useVerification } from '@/providers/VerificationProvider';
import { getUniversalLink } from '@selfxyz/common';
import { SelfAppBuilder, SelfQRcode } from '@selfxyz/qrcode';
import { RefreshCw, Shield, Terminal, Zap } from 'lucide-react';
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
            <Terminal className='w-8 h-8 animate-pulse text-green-400 mb-4' />
            <p className='text-sm text-green-300'>[LOADING] Initializing authentication protocol...</p>
          </div>
        );

      case 'qr':
        return (
          <div className='flex flex-col items-center space-y-4'>
            <div className='text-center'>
              <p className='text-sm text-green-300 mb-4'>
                [QR-CODE] Scan authentication matrix to access terminal{' '}
                <strong className='text-white'>{tapTitle}</strong>
              </p>
            </div>

            <div className='bg-white border-2 border-green-700 p-4 rounded-lg'>
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

            {selfApp && (
              <a
                href={getUniversalLink(selfApp)}
                target='_blank'
                rel='noopener noreferrer'
                className='font-mono bg-black border-2 border-green-700 text-green-400 hover:bg-green-900/30 hover:border-green-500 hover:text-green-300 transition-colors px-4 py-2 text-sm block sm:hidden text-center'
              >
                OPEN SELF APP
              </a>
            )}
          </div>
        );

      case 'verifying':
        return (
          <div className='flex flex-col items-center justify-center py-8'>
            <Terminal className='w-8 h-8 animate-pulse text-green-400 mb-4' />
            <p className='text-sm text-green-300 text-center'>
              [PROCESSING] Authenticating user credentials...
              <br />
              {`> System verification in progress...`}
            </p>
          </div>
        );

      case 'success':
        return (
          <div className='flex flex-col items-center justify-center py-8'>
            <Zap className='w-12 h-12 text-green-400 mb-4' />
            <p className='text-lg font-semibold text-green-400 mb-2'>AUTHENTICATION SUCCESSFUL</p>
            <p className='text-sm text-green-300 text-center'>
              {`[SUCCESS] Access granted to terminal `}
              <strong className='text-white'>{tapTitle}</strong>
              {` and compatible nodes.`}
            </p>
          </div>
        );

      case 'error':
        return (
          <div className='space-y-4'>
            <div className='flex items-center gap-2 bg-black border-2 border-green-700 p-4'>
              <Shield className='h-4 w-4 text-green-400' />
              <p className='text-sm text-green-400'>[ERROR] {error || 'Authentication protocol failure'}</p>
            </div>

            {errorAction && <div className='text-sm text-green-300 text-center'>{`> ${errorAction}`}</div>}

            <div className='flex justify-center gap-2'>
              <button
                onClick={handleRetry}
                disabled={!canRetry}
                className='font-mono bg-black border-2 border-green-700 text-green-400 hover:bg-green-900/30 hover:border-green-500 hover:text-green-300 transition-colors px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
              >
                <RefreshCw className='w-4 h-4 mr-2' />
                {canRetry ? 'RETRY AUTH' : 'RETRY UNAVAILABLE'}
              </button>
              <button
                onClick={closeVerificationModal}
                className='font-mono bg-black border-2 border-green-700 text-green-400 hover:bg-green-900/30 hover:border-green-500 hover:text-green-300 transition-colors px-4 py-2 text-sm'
              >
                DISCONNECT
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isVerificationModalOpen} onOpenChange={closeVerificationModal}>
      <DialogContent className='sm:max-w-md bg-black border-2 border-green-700 font-mono'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-between text-green-400 text-xl tracking-wide'>
            AUTHENTICATION PROTOCOL
          </DialogTitle>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
