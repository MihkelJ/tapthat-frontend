import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useVerificationStatus } from '@/lib/verification-hooks';
import { useVerification } from '@/providers/VerificationProvider';
import { AlertCircle, CheckCircle2, Loader2, Shield } from 'lucide-react';
import type { ElementType, SVGProps } from 'react';

interface VerificationStatusProps {
  tapId: string;
  className?: string;
  showButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationStatus({ tapId, className, showButton = true, size = 'md' }: VerificationStatusProps) {
  const { walletAddress, openVerificationModal } = useVerification();
  const { data: status, isLoading, isError, error } = useVerificationStatus(tapId, walletAddress);

  const handleVerifyClick = () => {
    openVerificationModal(tapId);
  };

  const getStatusConfig = (): {
    icon: ElementType;
    label: string;
    variant: BadgeProps['variant'];
    iconProps: SVGProps<SVGSVGElement>;
  } => {
    if (isLoading) {
      return {
        icon: Loader2,
        label: 'Checking...',
        variant: 'secondary',
        iconProps: { className: 'animate-spin' },
      };
    }

    if (isError) {
      return {
        icon: AlertCircle,
        label: 'Error',
        variant: 'destructive',
        iconProps: {},
      };
    }

    if (status?.data.isVerified) {
      const isExpiringSoon =
        status.data.result?.expiresAt && status.data.result.expiresAt - Date.now() < 60 * 60 * 1000; // 1 hour

      return {
        icon: CheckCircle2,
        label: isExpiringSoon ? 'Expires Soon' : 'Verified',
        variant: isExpiringSoon ? 'outline' : 'default',
        iconProps: {},
      };
    }

    return {
      icon: Shield,
      label: 'Verify Required',
      variant: 'outline',
      iconProps: {},
    };
  };

  const statusConfig = getStatusConfig();
  const IconComponent = statusConfig.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 h-6',
    md: 'text-sm px-3 py-1 h-7',
    lg: 'text-base px-4 py-2 h-8',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  if (status?.data.isVerified) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Badge variant={statusConfig.variant} className={sizeClasses[size]}>
          <IconComponent className={cn(iconSizes[size], 'mr-1')} {...statusConfig.iconProps} />
          {statusConfig.label}
        </Badge>
        {status.data.result?.verifiedAt && (
          <span className='text-xs text-muted-foreground'>
            {new Date(status.data.result.verifiedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
    );
  }

  if (showButton && !status?.data.isVerified && !isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          onClick={handleVerifyClick}
          variant='outline'
          size={buttonSize}
          className={cn(
            'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
            size === 'sm' && 'h-6 px-2 text-xs',
            size === 'md' && 'h-7 px-3 text-sm',
            size === 'lg' && 'h-8 px-4 text-base'
          )}
        >
          <Shield className={cn(iconSizes[size], 'mr-1')} />
          Verify Identity
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant={statusConfig.variant} className={sizeClasses[size]}>
        <IconComponent className={cn(iconSizes[size], 'mr-1')} {...statusConfig.iconProps} />
        {statusConfig.label}
      </Badge>
      {isError && <span className='text-xs text-destructive'>{error?.message || 'Check failed'}</span>}
    </div>
  );
}
