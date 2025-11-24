// Imports
import './globals.css';
import { ThemeProvider } from 'next-themes';

// Metadata for the site
export const metadata = {
  title: "Risith's Blog",
  description: 'A blog to document my coding journey and projects.',
};

// Root layout wrapper for the entire app
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
