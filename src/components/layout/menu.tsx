/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';

/**
 * Komponen Menu yang fleksibel berdasarkan props opsi.
 * @param {Array} opsi - Daftar item menu, masing-masing berisi { name, href, icon }.
 */

type MenuItem = {
  name: string;
  href: string;
  icon: string;
};

type MenuProps = {
  opsi: MenuItem[];
};

export default function Menu({ opsi = [] } : MenuProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 bg-[#ffffff] h-16 w-screen flex justify-center gap-6 rounded-tl-4xl rounded-tr-4xl drop-shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
      {opsi.map((item, index) => (
        <div key={index} className={`flex h-full w-auto border-[#4f4f4f] ${pathname === item.href ? 'border-t-3' : 'border-none'}`}>
          <Link href={item.href} className="group h-full w-10 flex flex-col items-center justify-center">
            <img src={item.icon} alt={item.name} className="h-6 w-6 transform hover:scale-110 transition-all duration-200" />
            <h3 className="text-[#545454] h-0 mb-0 opacity-0 group-hover:opacity-100 group-hover:mb-4 transition-all duration-200">
              {item.name}
            </h3>
          </Link>
        </div>
      ))}
    </div>
  );
}
