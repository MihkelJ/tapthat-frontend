import { createContext, useContext, useState, type ReactNode } from 'react';
import { useWalletAddress } from '@/lib/user';

interface VerificationContextType {
  walletAddress: string | null;
  isVerificationModalOpen: boolean;
  currentVerifyingTap: string | null;
  openVerificationModal: (tapId: string) => void;
  closeVerificationModal: () => void;
  refreshVerificationStatus: (tapId?: string) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}

interface VerificationProviderProps {
  children: ReactNode;
}

export function VerificationProvider({ children }: VerificationProviderProps) {
  const walletAddress = useWalletAddress();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [currentVerifyingTap, setCurrentVerifyingTap] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openVerificationModal = (tapId: string) => {
    setCurrentVerifyingTap(tapId);
    setIsVerificationModalOpen(true);
  };

  const closeVerificationModal = () => {
    setIsVerificationModalOpen(false);
    setCurrentVerifyingTap(null);
  };

  const refreshVerificationStatus = (_tapId?: string) => {
    setRefreshTrigger(prev => prev + 1);
  };

  const contextValue: VerificationContextType = {
    walletAddress,
    isVerificationModalOpen,
    currentVerifyingTap,
    openVerificationModal,
    closeVerificationModal,
    refreshVerificationStatus,
  };

  // Use refreshTrigger to force re-renders when needed
  console.log('Refresh trigger:', refreshTrigger);

  return (
    <VerificationContext.Provider value={contextValue}>
      {children}
    </VerificationContext.Provider>
  );
}