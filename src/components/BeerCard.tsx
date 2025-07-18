import PurchaseButton from '@/components/PurchaseButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BeerTap } from '@/types/beer';
import ReactMarkdown from 'react-markdown';

interface BeerCardProps {
  beerTap: BeerTap['beerTaps'][number];
}

export default function BeerCard({ beerTap }: BeerCardProps) {
  return (
    <Card className='h-full flex flex-col'>
      <CardHeader>
        <CardTitle className='text-lg'>{beerTap.title}</CardTitle>
      </CardHeader>

      <CardContent className='flex-1 flex flex-col gap-4'>
        <div className='flex-1 prose prose-sm prose-zinc max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0'>
          <ReactMarkdown>{beerTap.description}</ReactMarkdown>
        </div>

        <div className='mt-auto'>
          <PurchaseButton beerTap={beerTap} />
        </div>
      </CardContent>
    </Card>
  );
}
