import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { COMPLETIONS, runCommand } from './commands';
import { profile } from '@/data/profile';
import { useWindows } from '@/store/windows';
import { getApp } from '@/apps/registry';

type Entry = { id: number; input: string | null; output: ReactNode[] };

const MAX_ENTRIES = 60;

function Prompt() {
  return (
    <>
      <span className="font-bold text-[#8ae234]">
        {profile.username}@{profile.hostname}
      </span>
      <span className="text-white">:</span>
      <span className="font-bold text-[#729fcf]">~</span>
      <span className="text-white">$ </span>
    </>
  );
}

const WELCOME: ReactNode[] = [
  <span key="w" className="text-white/85">
    Welcome to Ubuntu 24.04.2 LTS (GNU/Linux 6.8.0-generic x86_64)
  </span>,
  '',
  <span key="t" className="text-white/60">
    Type <span className="text-ubuntu-orange">help</span> for a list of commands, or{' '}
    <span className="text-ubuntu-orange">neofetch</span> to start.
  </span>,
  '',
];

export default function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 0, input: null, output: WELCOME },
  ]);
  const [draft, setDraft] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const open = useWindows((state) => state.open);

  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entries]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = useCallback(
    (raw: string) => {
      const ctx = {
        openApp: (appId: string) => {
          const app = getApp(appId);
          if (app) open(app.id, app.defaultSize);
        },
        clear: () => setEntries([]),
      };

      const output = runCommand(raw, ctx);

      setEntries((prev) => {
        // `clear` empties the buffer inside runCommand; don't re-append to it.
        const cleared = raw.trim().toLowerCase() === 'clear';
        const next = cleared
          ? []
          : [...prev, { id: nextId.current++, input: raw, output }];
        return next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next;
      });

      if (raw.trim()) {
        setHistory((prev) => [...prev, raw]);
      }
      setHistoryIndex(-1);
      setDraft('');
    },
    [open],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit(draft);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!history.length) return;
      const index = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setDraft(history[index]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === -1) return;
      const index = historyIndex + 1;
      if (index >= history.length) {
        setHistoryIndex(-1);
        setDraft('');
      } else {
        setHistoryIndex(index);
        setDraft(history[index]);
      }
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const match = COMPLETIONS.find((candidate) => candidate.startsWith(draft) && draft);
      if (match) setDraft(match);
      return;
    }

    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
      className="h-full overflow-y-auto bg-terminal-bg px-3 py-2 font-mono text-[13.5px] leading-[1.45] text-white/90"
    >
      {entries.map((entry) => (
        <div key={entry.id}>
          {entry.input !== null && (
            <div className="whitespace-pre-wrap break-words">
              <Prompt />
              <span className="text-white">{entry.input}</span>
            </div>
          )}
          {entry.output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap break-words">
              {line === '' ? '\u00a0' : line}
            </div>
          ))}
        </div>
      ))}

      <div className="flex items-baseline whitespace-pre-wrap">
        <Prompt />
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Terminal input"
          className="min-w-0 flex-1 bg-transparent text-white caret-ubuntu-orange outline-none"
        />
      </div>
    </div>
  );
}
