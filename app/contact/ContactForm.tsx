'use client';

import { FormEvent } from 'react';

const contactEmail = 'dailyguessthefootballer@gmail.com';

export default function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const subject = `[Footle] ${formData.get('topic')}`;
    const body = [
      `Name: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      '',
      'Message:',
      formData.get('message'),
    ].join('\n');
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-gray-200">
          <span>Your name</span>
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-[#03E690]"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-gray-200">
          <span>Your email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-[#03E690]"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm font-medium text-gray-200">
        <span>What is this about?</span>
        <select
          name="topic"
          defaultValue="General question"
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-[#03E690]"
        >
          <option>General question</option>
          <option>Game feedback or a bug</option>
          <option>Privacy or data request</option>
          <option>Advertising or partnership</option>
        </select>
      </label>

      <label className="block space-y-2 text-sm font-medium text-gray-200">
        <span>Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={7}
          className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-[#03E690]"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="rounded-lg bg-[#03E690] px-5 py-3 font-bold text-gray-950 transition-colors hover:bg-emerald-300"
        >
          Continue to email
        </button>
        <p className="text-sm leading-6 text-gray-400">
          This opens your email app with your message ready to send. Nothing is sent from this website.
        </p>
      </div>
    </form>
  );
}
