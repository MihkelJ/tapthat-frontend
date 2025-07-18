import { cn } from '@/lib/utils';
import { useVerificationStatus } from '@/lib/verification-hooks';
import { useVerification } from '@/providers/VerificationProvider';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { AlertCircle, Lock, Terminal, Zap } from 'lucide-react';
import type { ElementType, SVGProps } from 'react';

interface VerificationStatusProps {
  tapId: string;
  className?: string;
  showButton?: boolean;
}

export function VerificationStatus({ tapId, className, showButton = true }: VerificationStatusProps) {
  const { openConnectModal } = useConnectModal();
  const { walletAddress, openVerificationModal } = useVerification();
  const { data: status, isLoading, isError, error } = useVerificationStatus(tapId, walletAddress);

  const handleVerifyClick = () => {
    if (!tapId) {
      throw new Error('Tap ID is required!');
    }

    if (!walletAddress) {
      openConnectModal?.();
      return;
    }

    openVerificationModal(tapId);
  };

  const getStatusConfig = (): {
    icon: ElementType;
    label: string;
    variant: 'default' | 'secondary' | 'destructive';
    iconProps: SVGProps<SVGSVGElement>;
  } => {
    if (isLoading) {
      return {
        icon: Terminal,
        label: 'SCANNING...',
        variant: 'secondary',
        iconProps: { className: 'animate-pulse' },
      };
    }

    if (isError) {
      return {
        icon: AlertCircle,
        label: 'ACCESS DENIED',
        variant: 'destructive',
        iconProps: {},
      };
    }

    if (status?.data.isVerified) {
      const isExpiringSoon =
        status.data.result?.expiresAt && status.data.result.expiresAt - Date.now() < 60 * 60 * 1000; // 1 hour

      return {
        icon: Zap,
        label: isExpiringSoon ? 'TOKEN EXPIRING' : 'AUTHENTICATED',
        variant: isExpiringSoon ? 'secondary' : 'default',
        iconProps: {},
      };
    }

    return {
      icon: Lock,
      label: 'AUTH REQUIRED',
      variant: 'secondary',
      iconProps: {},
    };
  };

  const statusConfig = getStatusConfig();
  const IconComponent = statusConfig.icon;

  if (status?.data.isVerified) {
    return (
      <div className={cn('flex items-center gap-2 font-mono', className)}>
        <div className='flex items-center gap-2 bg-black border border-green-700 text-green-400 px-3 py-1 h-7 text-sm'>
          <IconComponent className='w-4 h-4 mr-1' {...statusConfig.iconProps} />
          {statusConfig.label}
        </div>
        {status.data.result?.verifiedAt && (
          <span className='text-xs text-green-300'>{new Date(status.data.result.verifiedAt).toLocaleTimeString()}</span>
        )}
      </div>
    );
  }

  if (showButton && !status?.data.isVerified && !isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          onClick={handleVerifyClick}
          className='font-mono bg-black border-2 border-green-700 text-green-400 hover:bg-green-900/30 hover:border-green-500 hover:text-green-300 transition-colors h-7 px-3 text-sm'
        >
          <div className='flex items-center justify-center gap-1'>
            <Lock className='w-4 h-4' />
            AUTHENTICATE
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 font-mono', className)}>
      <div className='flex items-center gap-2 bg-black border border-green-700 text-green-400 px-3 py-1 h-7 text-sm'>
        <IconComponent className='w-4 h-4 mr-1' {...statusConfig.iconProps} />
        {statusConfig.label}
      </div>
      {isError && <span className='text-xs text-green-300'>{error?.message || 'SYSTEM ERROR'}</span>}
    </div>
  );
}
