// Imports
import Link from 'next/link';

// Footer with copyright and legal links
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center text-gray-600 dark:text-gray-500 text-xs space-y-1">
          <div>
            &copy; 2025{' '}
            <Link
              href="/admin"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Risith
            </Link>{' '}
            | Made with ❤️ by Risith
          </div>
          <div>
            Licensed under{' '}
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 dark:hover:text-white"
            >
              AGPL v3.0
            </a>{' '}
            ·{' '}
            <a
              href="/legal"
              className="underline hover:text-gray-900 dark:hover:text-white"
            >
              Legal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
