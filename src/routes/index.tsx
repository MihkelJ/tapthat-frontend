import { CommandsMenu } from '@/components/CommandsMenu';
import { SystemInfo } from '@/components/SystemInfo';
import { TapThatLogo } from '@/components/TapThatLogo';
import { TerminalDescription } from '@/components/TerminalDescription';
import { TerminalHeader } from '@/components/TerminalHeader';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div className='min-h-screen bg-black text-green-400 font-mono'>
      <div className='container mx-auto px-4 py-8'>
        <TerminalHeader />
        <TapThatLogo text='TapThat' />
        <SystemInfo />
        <TerminalDescription />
        <CommandsMenu />
      </div>
    </div>
  );
}
