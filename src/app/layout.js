// Imports
import "./globals.css";

// Metadata for the site
export const metadata = {
  title: "Risith's Blog",
  description: "A blog to document my coding journey and projects.",
};

// Root layout wrapper for the entire app
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
