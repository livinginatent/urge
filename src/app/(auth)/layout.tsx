import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Simple back link */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="text-[#52525b] text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>URGE</span>
        </Link>
      </div>
      
      {children}
    </div>
  );
}
