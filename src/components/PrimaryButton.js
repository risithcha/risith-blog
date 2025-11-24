// Reusable primary button
export default function PrimaryButton({
  children,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}) {
  const baseClasses =
    'bg-purple-400 hover:bg-purple-300 disabled:bg-gray-600 text-black px-4 py-2 rounded font-medium transition-colors';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}
