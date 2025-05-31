import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function AdminPage() {
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session');

  if (!adminSession) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Halaman Admin</h1>
      <LogoutButton />
    </div>
  );
}
