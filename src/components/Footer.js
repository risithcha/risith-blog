// The footer
export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs">
          2025 © Risith | Made by <a 
            href="https://risithcha.com/admin" 
            className="hover:text-white transition-colors" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Risith
          </a>
        </div>
      </div>
    </footer>
  );
}
