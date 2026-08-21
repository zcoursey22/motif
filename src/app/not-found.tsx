export default function NotFound() {
  return (
    <main className="flex flex-col gap-4 grow items-center justify-center pt-4 pb-8">
      <h1 className="text-neutral-500 dark:text-neutral-400 flex gap-4 items-center">
        <span className="font-medium text-indigo-500 dark:text-indigo-400 text-xl py-4 pr-4 border-r-2 border-neutral-300 dark:border-neutral-600">
          404
        </span>
        <span className="text-md">This page does not exist.</span>
      </h1>
    </main>
  );
}
