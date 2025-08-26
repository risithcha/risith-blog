import "./globals.css";
import Footer from "../components/Footer";

export const metadata = {
  title: "Risith's Blog",
  description: "A blog to document my coding journey and projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
