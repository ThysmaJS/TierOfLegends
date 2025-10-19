import { requireAdminSession } from '@/lib/authz';
import ClientAdmin from '@/app/admin/ClientAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const admin = await requireAdminSession();
  if (!admin) {
    return <div className="p-6 text-red-400">Accès refusé</div>;
  }
  return <ClientAdmin />;
}
