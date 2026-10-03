'use client';

import { useEffect, useRef, useState } from 'react';

type Role = 'user' | 'assistant';
interface Turn {
  role: Role;
  text: string;
  source?: 'gemini' | 'rules';
  streaming?: boolean;
}

const API = 'http://localhost:5000/api/v1';

const SUGGESTIONS = [
  'Give me my full financial summary',
  'What should I fix first?',
  'How is my emergency fund?',
  'Am I saving enough?',
  'Walk me through my goals',
];

export default function ChatBot() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (near) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [turns]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;

    setBusy(true);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';

    const history = turns.map(({ role, text }) => ({ role, text }));
    setTurns((t) => [
      ...t,
      { role: 'user', text: q },
      { role: 'assistant', text: '', streaming: true },
    ]);

    let acc = '';
    const paint = (chunk: string) => {
      acc += chunk;
      setTurns((t) => {
        const copy = [...t];
        copy[copy.length - 1] = { role: 'assistant', text: acc, streaming: true };
        return copy;
      });
    };

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history }),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => null);
        throw new Error(
          errBody?.error?.code
            ? `${errBody.error.code}: ${errBody.error.message}`
            : `HTTP ${res.status}`,
        );
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let source: 'gemini' | 'rules' = 'gemini';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const frames = buf.split('\n\n');
        buf = frames.pop() ?? '';

        for (const frame of frames) {
          const line = frame.split('\n').find((l) => l.startsWith('data:'));
          if (!line) continue;

          let evt: any;
          try {
            evt = JSON.parse(line.slice(5).trim());
          } catch {
            continue;
          }

          if (evt.type === 'delta') paint(evt.text ?? '');
          else if (evt.type === 'done') source = evt.source ?? 'gemini';
          else if (evt.type === 'error') paint(`\n\n_Error: ${evt.message}_`);
        }
      }

      setTurns((t) => {
        const copy = [...t];
        copy[copy.length - 1] = { role: 'assistant', text: acc, source, streaming: false };
        return copy;
      });
    } catch (err) {
      const msg = (err as Error).message;
      setTurns((t) => {
        const copy = [...t];
        copy[copy.length - 1] = {
          role: 'assistant',
          text: `**Could not reach the analysis service**\n\n${msg}`,
          streaming: false,
        };
        return copy;
      });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function autoGrow(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 148) + 'px';
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-paper text-ink">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-leaf text-sm font-bold text-paper">
          ₹
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">FinSight Chat</div>
          <div className="truncate text-xs text-ink/60">
            Numbers from the engine · wording from Gemini
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {turns.length === 0 && (
            <div className="rounded-2xl border border-line bg-mist p-5 text-sm leading-relaxed text-ink/80">
              Ask me about your finances. Every number I quote comes from the FinSight
              engine — I only explain what the rules already found.
            </div>
          )}

          {turns.map((t, i) => (
            <Bubble key={i} turn={t} />
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={busy}
                className="shrink-0 rounded-full border border-line bg-mist px-3 py-1 text-xs text-ink/80 transition hover:border-leaf/40 hover:text-ink disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 rounded-xl border border-line bg-paper p-0.5 transition focus-within:border-leaf/60 focus-within:ring-2 focus-within:ring-leaf/15">
              <textarea
                ref={inputRef}
                value={input}
                onChange={autoGrow}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask about your finances…"
                className="max-h-36 min-h-[44px] w-full resize-none rounded-[10px] bg-transparent px-3 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink/40"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf text-base font-bold text-paper transition hover:bg-leafdark disabled:opacity-40"
              aria-label="Send"
            >
              ➤
            </button>
          </form>

          <p className="mt-2 text-center text-[11px] text-ink/50">
            Numbers computed by the rules engine · wording generated by AI · not financial advice
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Bubble({ turn }: { turn: Turn }) {
  const isUser = turn.role === 'user';

  return (
    <div
      className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}
      style={{ animation: 'msgIn .35s cubic-bezier(.22,1,.36,1) both' }}
    >
      {!isUser && (
        <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-leaf/25 bg-leaf/10 text-xs text-leafdark">
          ✦
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-leaf font-medium text-paper'
            : 'border border-line bg-mist text-ink'
        }`}
      >
        {isUser ? (
          <span>{turn.text}</span>
        ) : turn.text ? (
          <div
            className="fs-md"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(turn.text) }}
          />
        ) : (
          <div className="flex items-center gap-1.5 py-1">
            <Dot delay="0ms" />
            <Dot delay="150ms" />
            <Dot delay="300ms" />
          </div>
        )}

        {turn.streaming && turn.text && (
          <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-leaf" />
        )}

        {turn.source === 'rules' && !turn.streaming && (
          <div className="mt-2 text-[11px] italic text-gold">
            Engine-only summary (AI unavailable)
          </div>
        )}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="block h-1.5 w-1.5 rounded-full bg-leaf"
      style={{ animation: `bounceDot 1.2s ${delay} infinite cubic-bezier(.4,0,.2,1)` }}
    />
  );
}

/* Minimal markdown — escapes first so it's XSS-safe for model output */
function renderMarkdown(src: string): string {
  const esc = (s: string) =>
    s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

  const inline = (s: string) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/(^|\s)\*([^*\n]+)\*/g, '$1<em>$2</em>');

  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${para.join('<br/>')}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      out.push(`<ul>${list.join('')}</ul>`);
      list = [];
    }
  };

  for (const raw of String(src).split('\n')) {
    const line = raw.replace(/\s+$/, '');
    const h = line.match(/^\s*#{1,4}\s+(.*)$/);
    const li = line.match(/^\s*[-*•]\s+(.*)$/);

    if (h) {
      flushPara();
      flushList();
      out.push(`<h3>${inline(h[1])}</h3>`);
    } else if (li) {
      flushPara();
      list.push(`<li>${inline(li[1])}</li>`);
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(inline(line));
    }
  }
  flushPara();
  flushList();
  return out.join('');
}