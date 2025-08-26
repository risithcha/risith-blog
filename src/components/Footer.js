// The footer
export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Gotta advertise my self somehow... */}
        <div className="flex justify-center space-x-8 mb-4 text-sm text-gray-400">
          <a href="https://github.com" className="hover:text-white" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com" className="hover:text-white" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:risitha@gmail.com" className="hover:text-white">Email</a>
        </div>
        {/* "Copyright" stuff */}
        <div className="text-center text-gray-500 text-xs">
          2025 © Risith | Made by Risith
        </div>
      </div>
    </footer>
  );
}
