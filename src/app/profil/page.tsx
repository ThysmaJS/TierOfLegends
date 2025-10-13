import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ClientProfil from '@/app/profil/ClientProfil';

export const runtime = 'nodejs';

export default async function ProfilPage() {
  const session = await auth();
  if (!session) {
    redirect('/login?callbackUrl=%2Fprofil');
  }
  return <ClientProfil />;
}
