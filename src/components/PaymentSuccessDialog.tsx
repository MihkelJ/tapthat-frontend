import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BeerTap, ServerResponse } from '@/types/beer';

interface PaymentSuccessDialogProps {
  location: string;
  beerTapsResponse: ServerResponse<BeerTap>;
}

export default function PaymentSuccessDialog({ location, beerTapsResponse }: PaymentSuccessDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentId, setPaymentId] = useState<string>('');
  
  // Check URL for success parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success') === 'true';
    const id = urlParams.get('paymentId');
    
    if (success && id) {
      setPaymentId(id);
      setIsOpen(true);
    }
  }, []);

  const beerTap = useMemo(() => {
    if (!beerTapsResponse?.data?.beerTaps) return null;
    return beerTapsResponse.data.beerTaps.find(tap => tap.location.toLowerCase() === location.toLowerCase());
  }, [beerTapsResponse, location]);

  const handleClose = () => {
    setIsOpen(false);
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            Payment Successful!
          </DialogTitle>
          <DialogDescription>
            Your beer purchase has been completed successfully.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {paymentId && (
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Payment ID:</strong> {paymentId}
              </div>
              <div className="text-sm">
                <strong>Status:</strong> 
                <span className="ml-1 capitalize text-green-600">
                  Completed
                </span>
              </div>
            </div>
          )}
          
          {beerTap && (
            <div className="border-t pt-4">
              <div className="text-sm text-muted-foreground">
                <strong>Beer:</strong> {beerTap.title}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Location:</strong> {beerTap.location}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Amount:</strong> {beerTap.transactionAmount} {beerTap.transactionCurrency}
              </div>
            </div>
          )}
          
          <Button onClick={handleClose} className="w-full">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
