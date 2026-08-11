'use client';

import { SelfRating } from '@/lib/constants';
import { Star } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';

const ORDER = Object.values(SelfRating);

type StarState = 'filled' | 'gaining' | 'losing' | 'empty';

interface StarRatingProps {
  value: SelfRating | null;
  onChange?: (value: SelfRating | null) => void;
  disabled?: boolean;
  label?: string;
}

export function StarRating({
  value,
  onChange,
  disabled = false,
  label = 'Rating',
}: StarRatingProps) {
  const [hover, setHover] = useState(0); // 0 = none, else 1..n
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = value ? ORDER.indexOf(value) + 1 : 0; // 0 = unrated
  const shown = hover || current;

  const commit = (pos: number) => {
    onChange?.(pos === 0 ? null : ORDER[pos - 1]);
    refs.current[Math.max(0, pos - 1)]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    let next = current;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(ORDER.length, current + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(0, current - 1);
        break;
      default:
        return;
    }
    e.preventDefault();
    if (next !== current) commit(next);
  };

  const classify = (star: number): StarState => {
    if (hover > 0 && hover === current) {
      return star <= current ? 'losing' : 'empty';
    }
    if (hover > current) {
      if (star <= current) return 'filled';
      if (star <= hover) return 'gaining';
      return 'empty';
    }
    if (hover > 0 && hover < current) {
      if (star <= hover) return 'filled';
      if (star <= current) return 'losing';
      return 'empty';
    }
    return star <= current ? 'filled' : 'empty';
  };

  const starClass = (state: StarState) =>
    state === 'filled'
      ? 'fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400'
      : state === 'gaining'
        ? 'fill-yellow-600 text-yellow-600 dark:fill-yellow-300 dark:text-yellow-300'
        : state === 'losing'
          ? 'fill-none text-yellow-600 dark:fill-none dark:text-yellow-300'
          : 'fill-none text-neutral-300 dark:fill-none dark:text-neutral-700';

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`flex items-stretch justify-center ${disabled ? 'field-busy pointer-events-none' : ''}`}
    >
      {ORDER.map((rating, i) => {
        const star = i + 1;

        return (
          <button
            key={rating}
            ref={el => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={current === star}
            aria-label={rating}
            tabIndex={current === star || (current === 0 && i === 0) ? 0 : -1}
            onClick={() => commit(star === current ? 0 : star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer rounded-sm px-0.25 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Star
              className={`${starClass(classify(star))}`}
              size={18}
              strokeWidth={2.5}
            />
          </button>
        );
      })}
    </div>
  );
}
