export function SiteFooter() {
  return (
    <div className="py-12 px-6 border-t border-[#27272a] bg-[#050505]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <span className="text-white font-bold text-xl tracking-tight">URGE</span>
          <p className="text-[#52525b] text-xs mt-1">Break the cycle.</p>
        </div>

        <div className="flex items-center gap-6 text-[#52525b] text-xs">
          <a href="/terms" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="/contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>

        <p className="text-[#27272a] text-xs">© 2026 URGE</p>
      </div>
    </div>
  );
}

