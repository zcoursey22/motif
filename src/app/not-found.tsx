export default function NotFound() {
  return (
    <main className="flex flex-col gap-4 grow items-center justify-center">
      <h1 className="text-neutral-500 dark:text-neutral-400 flex gap-4 items-center">
        <span className="text-indigo-400 dark:text-indigo-300 text-xl py-4 pr-4 border-r-2 border-neutral-300 dark:border-neutral-600">
          404
        </span>
        <span className="text-md">This page does not exist.</span>
      </h1>
    </main>
  );
}
