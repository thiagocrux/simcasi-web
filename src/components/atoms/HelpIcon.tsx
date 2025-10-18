import { CircleQuestionMark } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function HelpIcon({ text = '' }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const id = `info-tooltip`;
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setVisible(false);
    }

    if (visible) {
      document.addEventListener('keydown', onKey);
    }

    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        type="button"
        aria-describedby={text ? id : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)} // optional: toggle on click for touch
        className="bg-surface text-text-secondary focus-visible:ring-primary inline-flex h-5 w-5 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2"
      >
        <CircleQuestionMark size={14} />
        {text && visible && (
          <>
            <div
              id={id}
              role="tooltip"
              className="absolute top-full left-1/2 z-3 w-56 -translate-x-1/2 rounded-md border bg-white p-2 text-sm shadow-lg"
            >
              {text}
            </div>
          </>
        )}
      </button>
    </span>
  );
}
