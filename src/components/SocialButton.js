import Image from 'next/image';
import Link from 'next/link';

// Reusable social button stuff with consistent styling
export default function SocialButton({ href, icon, label, isEmail = false }) {
  const ButtonContent = () => (
    <>
      {/* Replaced <img> with Next.js <Image /> for optimization. If icon is SVG or remote, unoptimized is set. */}
      <Image
        src={icon}
        alt={label}
        className="w-5 h-5"
        width={20}
        height={20}
        unoptimized
      />
      {label}
    </>
  );

  const buttonClass =
    'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-mono text-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2';

  if (isEmail) {
    return (
      <Link href={href} className={buttonClass}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass}
    >
      <ButtonContent />
    </Link>
  );
}
