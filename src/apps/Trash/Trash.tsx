import { useState } from 'react';

const DISCARDED = [
  { name: 'deploy-friday-5pm.yml', note: 'Deleted for everyone’s safety' },
  { name: 'latest.tag', note: 'Pinned to a digest instead' },
  { name: 'works-on-my-machine.log', note: 'Containerised' },
  { name: 'prod-credentials.env', note: 'Moved to a secrets manager' },
  { name: 'manual-ssh-deploy.sh', note: 'Replaced by GitHub Actions' },
  { name: 'chmod-777.sh', note: 'We do not speak of this' },
];

export default function Trash() {
  const [emptied, setEmptied] = useState(false);

  return (
    <div className="flex h-full flex-col bg-yaru-window text-white">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-black/40 bg-yaru-headerbar px-4">
        <span className="text-[13.5px] font-medium">Trash</span>
        <button
          onClick={() => setEmptied(true)}
          disabled={emptied}
          className="rounded-md bg-white/10 px-3 py-1.5 text-[12.5px] transition-colors hover:bg-white/20 disabled:opacity-40"
        >
          Empty Trash
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {emptied ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <p className="text-[15px] text-white/70">Trash is empty.</p>
              <p className="mt-1 text-[13px] text-white/40">
                Bad practices permanently removed. Idempotent, naturally.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-1">
            {DISCARDED.map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-white/5"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-white/40" fill="currentColor" aria-hidden="true">
                  <path d="M6 7h12l-.9 12.1A2 2 0 0115.1 21H8.9a2 2 0 01-2-1.9zM4 5h16v2H4zm5-2h6v1.5H9z" />
                </svg>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-[13px]">{item.name}</span>
                  <span className="block truncate text-[12px] text-white/45">{item.note}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
