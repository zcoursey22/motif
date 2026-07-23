export default function Home() {
  return (
    <main className="flex flex-col grow justify-center items-center gap-2">
      <textarea
        className="bg-gray-800 text-white py-2 px-4 rounded-lg focus:outline-hidden min-w-lg resize-none border-1 border-gray-600"
        rows={3}
        placeholder="What did you work on today?"
      />
      <button className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg cursor-pointer">
        Submit
      </button>
    </main>
  );
}
