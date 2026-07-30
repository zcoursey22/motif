import SessionList from '../../components/SessionList';

export default function Sessions() {
  return (
    <main className="flex flex-col gap-4 grow items-stretch justify-start w-3xl pt-[25vh]">
      <h1 className="text-xl text-neutral-500 dark:text-neutral-400 text-center sr-only">
        Sessions
      </h1>
      <SessionList />
    </main>
  );
}
