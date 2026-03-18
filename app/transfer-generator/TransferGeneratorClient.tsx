'use client';

import Link from 'next/link';
import { useState } from 'react';
import { generateTransferRumour, TransferRumour } from '../../lib/transfer-generator';

export default function TransferGeneratorClient() {
  const [rumour, setRumour] = useState<TransferRumour>(() => generateTransferRumour());
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);

  const handleGenerate = () => {
    setRumour(generateTransferRumour());
  };

  const generateShareText = () => {
    return [
      'Fake Football Transfer Rumor',
      '',
      rumour.fullText,
      '',
      'Make your own: https://footle.club/transfer-generator',
    ].join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setShowShareConfirmation(true);
      setTimeout(() => setShowShareConfirmation(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const shareText = generateShareText();
    const encodedText = encodeURIComponent(shareText);
    const url = encodeURIComponent('https://footle.club/transfer-generator');

    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?text=${encodedText}`
      : `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Transfer Generator</p>
        <h1 className="text-4xl font-bold text-white">Fake Football Transfer Maker</h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg">
          Generate random transfer rumors, fake transfer news, and shareable football transfer chaos in one click.
        </p>
      </header>

      <section className="rounded-3xl border border-gray-700 bg-gray-800/90 p-6 shadow-xl">
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950/40 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Breaking News</p>
          <p className="mt-4 text-xl text-gray-200 leading-relaxed">
            <span className="font-semibold text-white">{rumour.player}</span> {rumour.phrase}{' '}
            <span className="font-semibold text-amber-300">{rumour.club}</span> for{' '}
            <span className="font-semibold text-white">{rumour.fee}</span>, {rumour.source}.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Generate New Rumor
          </button>
          <button
            onClick={handleCopy}
            className="rounded-xl bg-gray-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-gray-600"
          >
            Copy Result
          </button>
          <button
            onClick={() => handleSocialShare('twitter')}
            className="rounded-xl bg-[#1DA1F2] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#1a8cd8]"
          >
            Share to X
          </button>
          <button
            onClick={() => handleSocialShare('facebook')}
            className="rounded-xl bg-[#4267B2] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#365899]"
          >
            Share to Facebook
          </button>
        </div>

        {showShareConfirmation && (
          <p className="mt-3 text-center text-green-400">Result copied to clipboard!</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-700 bg-gray-800/70 p-5 text-center">
        <h2 className="text-2xl font-bold text-white">Play Footle</h2>
        <p className="mt-2 text-gray-400">
          Try the main daily football guessing game and the other modes once you&apos;ve generated a few transfer rumors.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-200"
          >
            Play Now
          </Link>
          <Link
            href="/career"
            className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-600"
          >
            Try Career Mode
          </Link>
        </div>
      </section>
    </div>
  );
}
