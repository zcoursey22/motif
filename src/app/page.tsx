import CaptureView from './components/CaptureForm';

export default function Home() {
  return (
    <main className="flex flex-col gap-4 grow items-center justify-start p-2 pt-[30vh]">
      <h1 className="text-xl text-neutral-700 dark:text-neutral-300">
        Log a practice session
      </h1>
      <CaptureView />
    </main>
  );
}
