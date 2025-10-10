"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { Button, Modal } from '@/components';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [username, setUsername] = React.useState(session?.user?.name ?? '');
  const [email, setEmail] = React.useState(session?.user?.email ?? '');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  function onClose() {
    router.push('/profil');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);
    try {
      // Update username first
      if (username !== (session?.user?.name ?? '')) {
        const res1 = await fetch('/api/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        const j1 = await res1.json().catch(()=>({}));
        if (!res1.ok) throw new Error(j1.error || 'Échec mise à jour pseudo');
      }
      // Update email if changed
      if (email !== (session?.user?.email ?? '')) {
        const res2 = await fetch('/api/profile/email', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const j2 = await res2.json().catch(()=>({}));
        if (!res2.ok) throw new Error(j2.error || 'Échec mise à jour email');
      }
      await update();
      setOk('Profil mis à jour');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open title="Modifier le profil" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-400">{error}</div>}
        {ok && <div className="text-sm text-green-400">{ok}</div>}

        <div>
          <label className="block text-sm text-gray-300 mb-1">Pseudo</label>
          <input
            value={username}
            onChange={e=>setUsername(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
            placeholder="Ton pseudo"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
            placeholder="toi@exemple.com"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </div>
      </form>
    </Modal>
  );
}
