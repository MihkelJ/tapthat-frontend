import PurchaseButton from '@/components/PurchaseButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationStatus } from '@/components/VerificationStatus';
import type { PositiveResponse } from '@/lib/client';
import ReactMarkdown from 'react-markdown';

interface BeerCardProps {
  beerTap: PositiveResponse['get /v1/beer-taps']['data']['beerTaps'][number];
}

export default function BeerCard({ beerTap }: BeerCardProps) {
  const requiresVerification = beerTap.identityVerification?.enabled;

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader>
        <CardTitle className='text-lg'>{beerTap.title}</CardTitle>
        {requiresVerification && <VerificationStatus tapId={beerTap.id!} showButton={false} size='sm' />}
      </CardHeader>

      <CardContent className='flex-1 flex flex-col gap-4'>
        <div className='flex-1 prose prose-sm prose-zinc max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0'>
          <ReactMarkdown>{beerTap.description}</ReactMarkdown>
        </div>

        <div className='mt-auto space-y-2'>
          <PurchaseButton beerTap={beerTap} />
        </div>
      </CardContent>
    </Card>
  );
}
