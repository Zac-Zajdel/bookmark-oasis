import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center space-x-10 p-32">
        <p>Go to /login page</p>
        <ModeToggle />
      </div>
    </main>
  );
}
