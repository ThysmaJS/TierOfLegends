"use client";
import React from 'react';

type UserRow = { id: string; email: string; username?: string; role: 'USER' | 'ADMIN'; createdAt?: string };
type TierListRow = { id: string; title: string; category?: string; userId: string; likes: number; createdAt?: string; coverImageUrl?: string; authorUsername?: string; authorEmail?: string };

export default function ClientAdmin() {
  const [tab, setTab] = React.useState<'users' | 'tierlists'>('users');
  const [users, setUsers] = React.useState<UserRow[]>([]);
  const [tls, setTls] = React.useState<TierListRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [usersPage, setUsersPage] = React.useState(1);
  const [tlsPage, setTlsPage] = React.useState(1);
  const usersPageSize = 20;
  const tlsPageSize = 20;

  async function load() {
    setLoading(true); setError(null);
    try {
      const [uRes, tRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/tierlists'),
      ]);
      if (!uRes.ok) throw new Error('Erreur chargement users');
      if (!tRes.ok) throw new Error('Erreur chargement tier lists');
      const uj = await uRes.json();
      const tj = await tRes.json();
      setUsers(uj.users ?? []);
      setTls(tj.tierlists ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);
  React.useEffect(() => { setUsersPage(1); setTlsPage(1); }, [tab]);

  async function deleteUser(id: string) {
    if (!confirm('Supprimer ce compte utilisateur ? Cela supprimera aussi ses tier lists et likes.')) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Suppression utilisateur échouée');
      setUsers(prev => prev.filter(u => u.id !== id));
      setTls(prev => prev.filter(t => t.userId !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(id: string, role: 'USER' | 'ADMIN') {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
      if (!res.ok) throw new Error('Mise à jour du rôle échouée');
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function deleteTierList(id: string) {
    if (!confirm('Supprimer cette tier list ?')) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/admin/tierlists/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Suppression tier list échouée');
      setTls(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Administration</h1>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab==='users'?'bg-blue-600 text-white':'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Utilisateurs</button>
        <button onClick={() => setTab('tierlists')} className={`px-4 py-2 rounded ${tab==='tierlists'?'bg-blue-600 text-white':'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Tier Lists</button>
        <button onClick={load} disabled={loading} className="ml-auto px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50">Rafraîchir</button>
      </div>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Pseudo</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Rôle</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Créé le</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.slice((usersPage-1)*usersPageSize, (usersPage-1)*usersPageSize + usersPageSize).map(u => (
                <tr key={u.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-2 text-gray-100">{u.email}</td>
                  <td className="px-4 py-2 text-gray-300">{u.username ?? '-'}</td>
                  <td className="px-4 py-2 text-gray-300">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value as 'USER' | 'ADMIN')}
                      className="h-8 rounded bg-black/30 text-white px-2 outline-none ring-1 ring-white/15"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-gray-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => deleteUser(u.id)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length > usersPageSize && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm disabled:opacity-50"
                onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                disabled={usersPage === 1}
              >
                Précédent
              </button>
              <span className="text-gray-300 text-sm">Page {usersPage} / {Math.max(1, Math.ceil(users.length / usersPageSize))}</span>
              <button
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm disabled:opacity-50"
                onClick={() => setUsersPage(p => Math.min(Math.ceil(users.length / usersPageSize), p + 1))}
                disabled={usersPage >= Math.ceil(users.length / usersPageSize)}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}
      {tab === 'tierlists' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Aperçu</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Titre</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Catégorie</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Auteur</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Likes</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Créé le</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tls.slice((tlsPage-1)*tlsPageSize, (tlsPage-1)*tlsPageSize + tlsPageSize).map(t => (
                <tr key={t.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-2">
                    {t.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.coverImageUrl} alt="aperçu" className="w-24 h-14 object-cover rounded border border-white/10" />
                    ) : (
                      <div className="w-24 h-14 rounded bg-white/5 border border-white/10" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-100">{t.title}</td>
                  <td className="px-4 py-2 text-gray-300">{t.category ?? '-'}</td>
                  <td className="px-4 py-2 text-gray-400">{t.authorUsername ?? (t.authorEmail ?? t.userId)}</td>
                  <td className="px-4 py-2 text-gray-300">{t.likes}</td>
                  <td className="px-4 py-2 text-gray-400">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => deleteTierList(t.id)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tls.length > tlsPageSize && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm disabled:opacity-50"
                onClick={() => setTlsPage(p => Math.max(1, p - 1))}
                disabled={tlsPage === 1}
              >
                Précédent
              </button>
              <span className="text-gray-300 text-sm">Page {tlsPage} / {Math.max(1, Math.ceil(tls.length / tlsPageSize))}</span>
              <button
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm disabled:opacity-50"
                onClick={() => setTlsPage(p => Math.min(Math.ceil(tls.length / tlsPageSize), p + 1))}
                disabled={tlsPage >= Math.ceil(tls.length / tlsPageSize)}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
