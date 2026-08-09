import { useEffect, useState } from 'react';
import { profile, resume } from '@/data/profile';
import { useIsMobile } from '@/hooks/useIsMobile';

type Availability = 'checking' | 'present' | 'missing';

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7.2 1.5h1.6v6.3l2.4-2.4 1.1 1.1L8 11.1 3.7 6.5l1.1-1.1 2.4 2.4z" />
      <path d="M2.4 12h11.2v1.6H2.4z" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M9 1.5h5.5V7h-1.6V4.2l-6 6L5.8 9l6-6H9z" />
      <path d="M2.5 3.5h4v1.6H4.1v6.8h6.8V9.5h1.6v4.1h-10z" />
    </svg>
  );
}

export default function Resume() {
  const [status, setStatus] = useState<Availability>('checking');
  const isMobile = useIsMobile();

  /*
   * The dev server answers unknown paths with index.html rather than a 404,
   * so a 200 alone does not prove the PDF is there — the content type does.
   */
  useEffect(() => {
    let cancelled = false;
    fetch(resume.href, { method: 'HEAD' })
      .then((response) => {
        const type = response.headers.get('content-type') ?? '';
        if (!cancelled) setStatus(response.ok && type.includes('pdf') ? 'present' : 'missing');
      })
      .catch(() => {
        if (!cancelled) setStatus('missing');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full flex-col bg-yaru-window text-white">
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-black/40 bg-yaru-headerbar px-3">
        <span className="truncate text-[13px] font-medium">{resume.filename}</span>
        <span className="hidden shrink-0 text-[11.5px] text-white/40 sm:inline">
          Updated {resume.updated}
        </span>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href={resume.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-[12.5px] transition-colors hover:bg-white/10"
          >
            <ExternalIcon className="h-3.5 w-3.5" />
            Open
          </a>
          <a
            href={resume.href}
            download={resume.filename}
            className="flex items-center gap-1.5 rounded-md bg-ubuntu-orange px-3 py-1.5 text-[12.5px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            Download
          </a>
        </div>
      </div>

      <div className="min-h-0 flex-1 bg-[#1a1a1a]">
        {status === 'checking' && (
          <div className="grid h-full place-items-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-ubuntu-orange" />
          </div>
        )}

        {status === 'missing' && (
          <div className="grid h-full place-items-center px-8 text-center">
            <div>
              <p className="text-[15px] font-medium">No CV has been published yet</p>
              <p className="mx-auto mt-2 max-w-[46ch] text-[13px] leading-relaxed text-white/55">
                Add the PDF to the project’s <code className="text-ubuntu-orange">public/</code>{' '}
                folder as{' '}
                <code className="text-ubuntu-orange">{resume.filename}</code> and it will appear
                here.
              </p>
            </div>
          </div>
        )}

        {status === 'present' &&
          (isMobile ? (
            /* Mobile browsers mostly refuse to render a PDF in an iframe. */
            <div className="grid h-full place-items-center px-8 text-center">
              <div>
                <p className="text-[15px] font-medium">{profile.name}</p>
                <p className="mt-1 text-[13px] text-white/55">{profile.title}</p>
                <a
                  href={resume.href}
                  download={resume.filename}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ubuntu-orange px-5 py-2.5 text-[14px] font-medium"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download CV
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={`${resume.href}#view=FitH`}
              title={`${profile.name} — curriculum vitae`}
              className="h-full w-full border-0"
            />
          ))}
      </div>
    </div>
  );
}
