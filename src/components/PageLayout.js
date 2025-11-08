// Imports
import Navigation from './Navigation';
import Footer from './Footer';

// Reusable page layout
// Includes navigation header and footer
export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
