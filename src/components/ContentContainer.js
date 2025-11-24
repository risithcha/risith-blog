// Reusable content container
// Provides consistent max-width and padding across pages
export default function ContentContainer({ children, className = '' }) {
  return (
    <div className={`flex-1 max-w-4xl mx-auto px-6 w-full ${className}`}>
      {children}
    </div>
  );
}
