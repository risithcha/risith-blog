import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="w-full">
      <div className="flex justify-between items-center p-6 max-w-4xl mx-auto w-full">
        <div className="text-blue-400 font-medium">Risith&apos;s Blog</div>
        <div className="flex space-x-8 text-sm text-gray-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/blog" className="hover:text-white">Blog Posts</Link>
          <Link href="/projects" className="hover:text-white">Projects</Link>
        </div>
      </div>
    </nav>
  );
}
