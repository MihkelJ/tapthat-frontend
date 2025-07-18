import { Button } from '@/components/ui/button';
import { formatWalletAddress } from '@/lib/user';
import { cn } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface ConnectWalletProps {
  className?: string;
  showAddress?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
}

export function ConnectWallet({ className, showAddress = true, variant = 'default' }: ConnectWalletProps) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) {
          return (
            <Button variant={variant} className={cn('opacity-50 cursor-not-allowed', className)} disabled>
              Loading...
            </Button>
          );
        }

        if (!connected) {
          return (
            <Button
              variant={variant}
              onClick={openConnectModal}
              className={cn('bg-primary hover:bg-primary/90', className)}
            >
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported) {
          return (
            <Button variant='destructive' onClick={openChainModal} className={className}>
              Wrong Network
            </Button>
          );
        }

        return (
          <div className={cn('flex items-center gap-2', className)}>
            {showAddress && (
              <Button variant='outline' onClick={openAccountModal} className='font-mono'>
                {formatWalletAddress(account.address)}
              </Button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

// Simple version that just shows connect/disconnect
export function SimpleConnectWallet({ className }: { className?: string }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) return null;

        if (!connected) {
          return (
            <Button onClick={openConnectModal} className={className}>
              Connect Wallet
            </Button>
          );
        }

        return <ConnectWallet className={className} showAddress={true} />;
      }}
    </ConnectButton.Custom>
  );
}
