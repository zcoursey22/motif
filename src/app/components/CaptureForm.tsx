'use client';

import { Play } from 'lucide-react';
import { useRef, useState } from 'react';

export default function CaptureForm() {
  const [rawText, setRawText] = useState('');
  const rawTextElement = useRef<HTMLTextAreaElement>(null);

  const rawTextHasValue = rawText.trim().length > 0;

  const handleSubmit = () => {
    if (!rawTextHasValue) return;
    setRawText('');
  };

  const handleTextAreaContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) rawTextElement.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div
      onClick={handleTextAreaContainerClick}
      className="flex flex-col gap-2 justify-center items-stretch w-2xl max-w-[100%] bg-white dark:bg-neutral-700 p-4 pr-3 rounded-3xl cursor-text shadow-xs focus-within:shadow-lg"
    >
      <textarea
        className="focus:outline-hidden resize-none pl-2 pt-2 field-sizing-content max-h-60 overflow-y-auto scrollbar-thin scrollbar-gutter-stable placeholder-gray-500 dark:placeholder-gray-300"
        placeholder="How did it go?"
        onChange={e => setRawText(e.currentTarget.value)}
        value={rawText}
        onKeyDown={handleKeyDown}
        autoFocus
        ref={rawTextElement}
      />
      <div className="flex flex-col items-end min-h-9 pr-1 pointer-events-none">
        <button
          className="bg-green-600 hover:bg-green-500 aria-disabled:bg-mist-300 dark:aria-disabled:bg-mist-500 text-white aria-disabled:text-gray-100 dark:aria-disabled:text-gray-400 p-2 rounded-lg cursor-pointer aria-disabled:cursor-text pointer-events-auto"
          aria-disabled={!rawTextHasValue}
          onClick={handleSubmit}
          aria-label="Submit"
        >
          <Play size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
