'use client';

import { useEffect, useState } from 'react';

interface ArticleShareOptionsProps {
  title: string;
}

export default function ArticleShareOptions({ title }: ArticleShareOptionsProps) {
  const [message, setMessage] = useState('');
  const [currentUrl, setCurrentUrl] = useState('https://footle.club');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage('Article link copied.');
    } catch {
      setMessage('Could not copy the link. Please copy it from your browser address bar.');
    }
  };

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(currentUrl);

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Share this article">
      <span className="mr-1 text-sm font-semibold text-gray-300">Share</span>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 transition-colors hover:border-[#03E690] hover:text-[#03E690]"
      >
        Copy link
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 transition-colors hover:border-[#03E690] hover:text-[#03E690]"
      >
        Share on X
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 transition-colors hover:border-[#03E690] hover:text-[#03E690]"
      >
        Facebook
      </a>
      {message && <span role="status" className="w-full text-sm text-[#03E690]">{message}</span>}
    </div>
  );
}
