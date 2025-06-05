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
  color: string;
  href: string;
  icon_f: string;
  icon_s: string;
};

type MenuProps = {
  opsi: MenuItem[];
};

export default function Menu({ opsi = [] } : MenuProps) {
  const pathname = usePathname();

  return (
    <div className="z-10 p-4 fixed bottom-0 bg-[#ffffff] h-18 w-screen flex justify-center gap-9 rounded-tl-4xl rounded-tr-4xl drop-shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
      {opsi.map((item, index) => (
        <div key={index} className={`flex items-center justify-center h-12 w-12 rounded-full ${pathname === item.href ? item.color : 'bg-transparant'}`}>
          <Link href={item.href} className="group h-10 w-10 flex flex-col items-center justify-center">
            <img src={pathname === item.href ? item.icon_s : item.icon_f} alt={item.name} className="h-6 w-6 transform hover:scale-110 transition-all duration-200" />
          </Link>
        </div>
      ))}
    </div>
  );
}
