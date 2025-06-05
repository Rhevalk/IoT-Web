
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Menu from "@/components/layout/menu"
import PlantInfoCard from "./PlantInfoCard"
import NilaInfoCard from "./NilaInfoCard"
import LeleInfoCard from "./LeleInfoCard"

const menuOps = [
  { name: "Data", href: "/data", icon_f: "/nav-icon/log-f.svg", color: "bg-blue-400"     , icon_s: "/nav-icon/log-s.svg"},
  { name: "Home", href: "/", icon_f: "/nav-icon/home-f.svg", color: "bg-orange-400"      , icon_s: "/nav-icon/home-s.svg"},
  { name: "Admin", href: "/admin", icon_f: "/nav-icon/admin-f.svg", color: "bg-green-400", icon_s: "/nav-icon/admin-s.svg"},
];


export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session');

  if (!adminSession) {
    redirect('/login');
  }


  return (
    <div className="pb-18">
      <Menu opsi={menuOps}/>

      <div className="flex flex-col gap-6 p-6">
        <PlantInfoCard></PlantInfoCard>
        <NilaInfoCard></NilaInfoCard>
        <LeleInfoCard></LeleInfoCard>
      </div>

    </div>
  );
}
