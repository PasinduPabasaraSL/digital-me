import { useState, type FormEvent } from 'react';
import { profile } from '@/data/profile';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * FormSubmit's AJAX endpoint is CORS-enabled and returns JSON, so the message
 * is genuinely delivered and the button reflects the real request state.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const update = (field: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message from ${form.name}`,
          _template: 'table',
        }),
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      window.setTimeout(() => setStatus('idle'), 4000);
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'Unknown error');
    }
  }

  const disabled = status === 'sending';

  return (
    <div className="flex h-full flex-col bg-yaru-window text-white">
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-black/40 bg-yaru-headerbar px-4">
        <span className="text-[13.5px] font-medium">New Message</span>
        <span className="ml-auto text-[12px] text-white/40">To: {profile.email}</span>
      </div>

      <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-white/8 px-4 py-2.5">
          <label className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-[12.5px] text-white/45">From</span>
            <input
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Your name"
              className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-white/30"
            />
          </label>
        </div>

        <div className="shrink-0 border-b border-white/8 px-4 py-2.5">
          <label className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-[12.5px] text-white/45">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-white/30"
            />
          </label>
        </div>

        <textarea
          required
          value={form.message}
          onChange={update('message')}
          placeholder="Tell me about your project…"
          className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3.5 text-[14px] leading-relaxed outline-none placeholder:text-white/30"
        />

        <div className="flex shrink-0 items-center gap-3 border-t border-black/40 bg-yaru-sidebar px-4 py-3">
          <button
            type="submit"
            disabled={disabled}
            className="rounded-md bg-ubuntu-orange px-5 py-2 text-[13.5px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>

          {status === 'sent' && (
            <span className="text-[13px] text-[#8ae234]">Message sent — thanks, I'll reply soon.</span>
          )}

          {status === 'error' && (
            <span className="text-[13px] text-[#ff7b72]">
              Could not send ({error}).{' '}
              <a
                href={`mailto:${profile.email}`}
                className="underline underline-offset-2 hover:text-ubuntu-orange"
              >
                Email me directly
              </a>
              .
            </span>
          )}

          {status === 'idle' && (
            <span className="ml-auto text-[12px] text-white/35">
              Goes straight to {profile.email}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
