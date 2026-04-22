import React from 'react';

interface AdvertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdvertiseModal({ isOpen, onClose }: AdvertiseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-gray-800 shadow-2xl">
        <div className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Advertise On Footle
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Promote your business or website for $25 a month
              </h2>
              <p className="mt-2 text-gray-300">
                Reach football fans on a growing daily game platform built for repeat visits.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 transition-colors hover:text-white"
              aria-label="Close"
              type="button"
            >
              x
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-amber-400/30 bg-gray-900/70 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
                Audience
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                Around 1,500 players every month and growing rapidly
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Players regularly come back for the daily challenge and often explore multiple
                game modes in the same visit, helping advertisers get repeated visibility.
              </p>
            </div>

            <div className="rounded-xl border border-sky-400/30 bg-gray-900/70 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
                What You Get
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                Banner placement plus a dofollow backlink
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Promote your business, product, or website with a banner advert on footle.club
                and a dofollow backlink to your site.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900/60 p-5">
            <h3 className="text-lg font-semibold text-white">Why it works</h3>
            <div className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
              <p>
                Footle visitors are highly engaged. Many players stay on the site to finish a
                game, compare results, and try additional modes like league games, archives, and
                custom challenges.
              </p>
              <p>
                That means your advert is shown to people who are not just clicking in and out,
                but spending time on the website and interacting with multiple pages.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5">
            <h3 className="text-lg font-semibold text-white">Interested?</h3>
            <p className="mt-2 text-sm leading-6 text-gray-200">
              Email{" "}
              <a
                href="mailto:dailyguessthefootballer@gmail.com"
                className="font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
              >
                dailyguessthefootballer@gmail.com
              </a>{" "}
              for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
