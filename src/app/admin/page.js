
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
//import LogoutButton from './LogoutButton';
import Menu from "@/components/layout/menu"
import PlantInfoCard from "./PlantInfoCard"
import NilaInfoCard from "./NilaInfoCard"
import LeleInfoCard from "./LeleInfoCard"

const menuOps = [
  { name: "Data", href: "/data", icon: "/nav-icon/log-f.svg" },
  { name: "Home", href: "/", icon: "/nav-icon/home-f.svg" },
  { name: "Admin", href: "/admin", icon: "/nav-icon/admin-f.svg" },
];

export default function AdminPage() {
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session');

  if (!adminSession) {
    redirect('/login');
  }


  return (
    <div className="pb-32">
      <Menu opsi={menuOps}/>

      <div className="flex flex-col gap-6 p-6">
        <PlantInfoCard></PlantInfoCard>
        <NilaInfoCard></NilaInfoCard>
        <LeleInfoCard></LeleInfoCard>
      </div>

    </div>
  );
}
