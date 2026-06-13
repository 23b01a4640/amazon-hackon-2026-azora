import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#111827] text-white border-b border-[#1E293B] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex justify-between items-center">
        <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#00A8E1]">
          Azora
        </Link>
        <div className="flex gap-6 font-semibold">
          <Link href="/" className="hover:text-[#00A8E1] transition-colors">Home</Link>
          <Link href="/bundles" className="hover:text-[#00A8E1] transition-colors">Bundles</Link>
          <Link href="/checkout" className="hover:text-[#00A8E1] transition-colors">Checkout</Link>
        </div>
      </div>
    </nav>
  );
}
