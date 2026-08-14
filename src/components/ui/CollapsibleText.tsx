'use client';

import { ChevronDown } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { IconButton } from './Button';

export function CollapsibleText({
  text,
  className,
  spanClassName,
}: {
  text: string;
  className?: string;
  spanClassName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const firstLine = text.split('\n')[0];

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const hasNewline = text.includes('\n');
    const tooWide = el.scrollWidth > el.clientWidth + 1;
    setOverflows(hasNewline || tooWide);
  }, [text, expanded]);

  return (
    <div
      className={`flex ${expanded ? 'items-start' : 'items-center'} gap-2 w-full ${className ?? ''}`}
    >
      <span
        ref={textRef}
        className={`grow block overflow-hidden pr-4 ${
          expanded ? 'whitespace-pre-wrap' : 'whitespace-nowrap text-ellipsis'
        } ${spanClassName ?? ''}`}
      >
        {expanded ? text : firstLine}
      </span>
      {overflows && (
        <IconButton
          variant="ghost"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse text' : 'Expand text'}
          className="shrink-0"
          icon={ChevronDown}
          iconClassName={`transition-transform duration-100 ${expanded ? 'rotate-180' : ''}`}
        />
      )}
    </div>
  );
}
