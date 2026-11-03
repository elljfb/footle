'use client';

import { useEffect, useRef, useState } from 'react';
import type { GeneratorItem } from '../../lib/football-generators';

interface GeneratorToolProps {
  title: string;
  description: string;
  itemLabel: string;
  items: string[];
  itemDetails: Record<string, GeneratorItem>;
  pageUrl: string;
}

function getAge(dateOfBirth: string, today: string): number {
  const [birthYear, birthMonth, birthDay] = dateOfBirth.split('-').map(Number);
  const [year, month, day] = today.split('-').map(Number);
  return year - birthYear - (month < birthMonth || (month === birthMonth && day < birthDay) ? 1 : 0);
}

export default function GeneratorTool({
  title,
  description,
  itemLabel,
  items,
  itemDetails,
  pageUrl,
}: GeneratorToolProps) {
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [today, setToday] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
    if (items.length > 0) {
      setResult(items[Math.floor(Math.random() * items.length)]);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const resultData = result ? itemDetails[result] : undefined;
  const resultDetails = resultData
    ? [
      ...resultData.details,
      ...(resultData.dateOfBirth && today
        ? [{ label: 'Age', value: String(getAge(resultData.dateOfBirth, today)) }]
        : []),
    ]
    : [];
  const getResultText = (item: string | null) => {
    if (!item) return '';
    const itemData = itemDetails[item];
    const details = [
      ...(itemData?.details ?? []),
      ...(itemData?.dateOfBirth && today
        ? [{ label: 'Age', value: String(getAge(itemData.dateOfBirth, today)) }]
        : []),
    ];
    return `My random ${itemLabel.toLowerCase()} is ${item}!${details.length ? ` ${details.map(({ label, value }) => `${label}: ${value}`).join(' · ')}` : ''}`;
  };

  const pickDifferentItem = () => {
    if (items.length < 2) return items[0] ?? null;
    let nextItem = result;
    while (nextItem === result) {
      nextItem = items[Math.floor(Math.random() * items.length)];
    }
    return nextItem;
  };

  const generate = () => {
    if (isGenerating || items.length === 0) return;
    setAnnouncement('');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const nextItem = pickDifferentItem();
      setResult(nextItem);
      setAnnouncement(getResultText(nextItem));
      return;
    }

    setIsGenerating(true);
    intervalRef.current = setInterval(() => {
      setResult(items[Math.floor(Math.random() * items.length)]);
    }, 75);
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      const nextItem = pickDifferentItem();
      setResult(nextItem);
      setIsGenerating(false);
      setAnnouncement(getResultText(nextItem));
      timeoutRef.current = null;
    }, 1050);
  };

  const shareText = getResultText(result);
  const shareUrl = `https://footle.club${pageUrl}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setAnnouncement('Result and link copied to clipboard.');
    } catch (error) {
      console.error('Failed to copy generator result:', error);
      setAnnouncement('Could not copy the result. Please check your browser clipboard permissions.');
    }
  };

  const shareResult = async () => {
    if (!navigator.share) {
      setAnnouncement('Sharing is not supported in this browser. You can copy the result or share it on X.');
      return;
    }

    try {
      await navigator.share({ title, text: shareText, url: shareUrl });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Failed to share generator result:', error);
      setAnnouncement('Could not open the share menu. You can copy the result or share it on X.');
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-800/80 shadow-2xl">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-gray-900 to-gray-900 px-6 py-10 text-center sm:px-10 sm:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#03E690]/10 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#03E690]">{itemLabel} generator</p>
        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-300">{description}</p>

        <div
          aria-hidden="true"
          className="season-result-enter mx-auto mt-8 flex min-h-36 max-w-2xl flex-col items-center justify-center rounded-2xl border border-[#03E690]/30 bg-gray-950/70 px-5 py-7 shadow-inner sm:min-h-44"
          key={result}
        >
          <p className={`break-words text-3xl font-black tracking-tight text-white sm:text-5xl ${isGenerating ? 'text-[#03E690]' : ''}`}>
            {result ?? 'Ready when you are'}
          </p>
          {resultDetails.length > 0 && (
            <dl className="mt-5 flex flex-wrap justify-center gap-2">
              {resultDetails.map(({ label, value }) => (
                <div key={label} className="rounded-full border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm">
                  <dt className="inline text-gray-400">{label}: </dt>
                  <dd className="inline font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <p className="mt-4 min-h-5 text-sm text-gray-300" role="status" aria-live="polite">{announcement}</p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={generate}
            disabled={isGenerating || items.length === 0}
            className="min-w-52 rounded-xl bg-[#03E690] px-6 py-3.5 font-bold text-gray-950 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
          >
            {isGenerating ? 'Picking...' : `Generate ${itemLabel}`}
          </button>
          <button
            type="button"
            onClick={copyResult}
            disabled={isGenerating || !result}
            className="rounded-xl border border-gray-600 bg-gray-800 px-5 py-3.5 font-semibold text-white transition hover:border-gray-400 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy result
          </button>
          <button
            type="button"
            onClick={shareResult}
            disabled={isGenerating || !result}
            className="rounded-xl border border-gray-600 bg-gray-800 px-5 py-3.5 font-semibold text-white transition hover:border-gray-400 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Share
          </button>
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={isGenerating || !result}
            tabIndex={isGenerating || !result ? -1 : undefined}
            onClick={(event) => {
              if (isGenerating || !result) event.preventDefault();
            }}
            className="rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            Share on X
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          {isGenerating ? 'The next pick is on its way…' : `${items.length.toLocaleString()} ${itemLabel.toLowerCase()}s in the generator`}
        </p>
      </div>
    </section>
  );
}
