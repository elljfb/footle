import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-4 text-center text-sm text-gray-500">
      <Link href="https://forms.office.com/r/kiGKRpyTJM" className="hover:text-gray-700">
        Have Feedback or Suggestions?
      </Link>
      {' | '}
      <Link href="/privacy" className="hover:text-gray-700">
        Privacy Policy
      </Link>
    </footer>
  );
} 