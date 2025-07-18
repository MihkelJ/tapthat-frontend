import PurchaseButton from '@/components/PurchaseButton';
import type { PositiveResponse } from '@/lib/client.ts';
import ReactMarkdown from 'react-markdown';

interface BeerCardProps {
  beerTap: PositiveResponse['get /v1/beer-taps']['data']['beerTaps'][number];
}

function getTerminalFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function getBeerType(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('ipa')) return 'IPA';
  if (lowerTitle.includes('lager')) return 'LAGER';
  if (lowerTitle.includes('stout')) return 'STOUT';
  if (lowerTitle.includes('wheat')) return 'WHEAT';
  return 'BEER';
}

function getASCIIBadge(type: string): { badge: string; color: string } {
  switch (type) {
    case 'IPA':
      return {
        badge: '┌─────┐\n│ IPA │\n└─────┘',
        color: 'text-orange-400',
      };
    case 'LAGER':
      return {
        badge: '┌───────┐\n│ LAGER │\n└───────┘',
        color: 'text-yellow-400',
      };
    case 'STOUT':
      return {
        badge: '┌───────┐\n│ STOUT │\n└───────┘',
        color: 'text-gray-300',
      };
    case 'WHEAT':
      return {
        badge: '┌───────┐\n│ WHEAT │\n└───────┘',
        color: 'text-amber-400',
      };
    default:
      return {
        badge: '┌──────┐\n│ BEER │\n└──────┘',
        color: 'text-green-400',
      };
  }
}

// function extractABVAndIBU(description: string): { abv: string; ibu: string } {
//   const abvMatch = description.match(/\*\*ABV:\s*([^*]+)\*\*/);
//   const ibuMatch = description.match(/\*\*IBU:\s*([^*]+)\*\*/);

//   return {
//     abv: abvMatch ? abvMatch[1].trim() : 'N/A',
//     ibu: ibuMatch ? ibuMatch[1].trim() : 'N/A',
//   };
// }

export default function BeerCard({ beerTap }: BeerCardProps) {
  const filename = getTerminalFilename(beerTap.title);
  // const { abv, ibu } = extractABVAndIBU(beerTap.description);
  const beerType = getBeerType(beerTap.title);
  const { badge, color } = getASCIIBadge(beerType);

  return (
    <div className='relative h-full flex flex-col border-2 border-green-700 bg-black p-4 font-mono'>
      {/* Terminal Header */}
      <div className='mb-4'>
        <div className='text-green-300 text-xs sm:text-sm mb-2'>$ cat beer_{filename}.txt</div>
        <div className='border-b border-green-700 mb-3'></div>
      </div>

      {/* Beer Name and ASCII Badge */}
      <div className='mb-4 flex justify-between items-start'>
        <div className='text-green-400 text-xl sm:text-2xl font-bold tracking-wide flex-1'>
          {beerTap.title.toUpperCase()}
        </div>
        <div className={`text-xs leading-tight whitespace-pre font-mono ml-4 ${color}`}>{badge}</div>
      </div>

      {/* Terminal Data Readouts - TODO: Add back in */}
      {/* <div className='mb-4 space-y-1 text-xs sm:text-sm'>
        <div className='flex'>
          <span className='text-green-300 w-16'>ABV:</span>
          <span className='text-white'>{abv}</span>
        </div>
        <div className='flex'>
          <span className='text-green-300 w-16'>IBU:</span>
          <span className='text-white'>{ibu}</span>
        </div>
        <div className='flex'>
          <span className='text-green-300 w-16'>PRICE:</span>
          <span className='text-yellow-400'>
            {beerTap.transactionCurrency} {beerTap.transactionAmount}
          </span>
        </div>
      </div> */}

      {/* Description */}
      <div className='flex-1 mb-4'>
        <div className='text-green-300 text-xs sm:text-sm mb-2'># Description:</div>
        <div
          className='text-green-400 text-xs sm:text-sm leading-relaxed prose prose-sm prose-green max-w-none
                        prose-headings:text-green-400 prose-headings:font-bold prose-headings:text-xs
                        prose-p:text-green-400 prose-p:text-xs prose-p:my-1
                        prose-strong:text-white prose-strong:font-bold
                        prose-ul:text-green-400 prose-ul:text-xs prose-ul:my-1 prose-ul:list-none prose-ul:pl-0
                        prose-li:text-green-400 prose-li:text-xs prose-li:my-0 prose-li:before:content-["-"] prose-li:before:mr-2 prose-li:before:text-green-400'
        >
          <ReactMarkdown>{beerTap.description}</ReactMarkdown>
        </div>
      </div>

      {/* Purchase Button */}
      <div className='mt-auto pt-4 border-t border-green-700'>
        <PurchaseButton beerTap={beerTap} />
      </div>
    </div>
  );
}
