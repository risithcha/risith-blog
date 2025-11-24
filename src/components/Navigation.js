// Imports
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

// Navigation bar stuff
export default function Navigation() {
  return (
    <nav className="w-full">
      <div className="flex justify-between items-center p-6 max-w-4xl mx-auto w-full">
        {/* Blog title - now clickable to go home */}
        <Link
          href="/"
          className="text-blue-400 dark:text-blue-400 font-medium hover:text-blue-300 dark:hover:text-blue-300 transition-colors"
        >
          Risith&apos;s Blog
        </Link>

        {/* Links to other pages */}
        <div className="flex items-center space-x-8 text-sm text-gray-700 dark:text-gray-300">
          <ThemeToggle />
          <Link
            href="/blog"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Blog Posts
          </Link>
          <Link
            href="/projects"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Projects
          </Link>
        </div>
      </div>
    </nav>
  );
}
