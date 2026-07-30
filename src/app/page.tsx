import CaptureView from '../components/CaptureForm';

export default function Home() {
  return (
    <main className="flex flex-col gap-4 grow items-center justify-start w-3xl pt-[25vh]">
      <h1 className="text-xl text-neutral-500 dark:text-neutral-400">
        Log a practice session
      </h1>
      <CaptureView />
    </main>
  );
}
