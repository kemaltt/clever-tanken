import Link from "next/link";
import { Fuel } from "lucide-react";

export function Navbar() {
  return (
    <>
      {/* Logo - fixed to match burger menu position */}
      <Link 
        href="/" 
        className="fixed left-4 top-10 z-50 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-105 hover:bg-gray-100"
      >
        <Fuel className="h-6 w-6 text-[#0078BE]" />
      </Link>
    </>
  );
}


