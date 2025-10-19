"use client";

import { useSession } from 'next-auth/react';
import { Avatar, Button, Card, Container, Modal } from '../../components';
import { TierListCard } from '@/components/tierlist';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import type { TierListPublic } from '@/types/tierlist';

export default function ClientProfil() {
  const { data: session, update } = useSession();
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const [mine, setMine] = React.useState<Array<{ id: string; title: string; updatedAt: string; championId?: string; coverImageUrl?: string }>>([]);
  const [loadingMine, setLoadingMine] = React.useState(false);
  const [liked, setLiked] = React.useState<Array<{ id: string; title: string; updatedAt: string; championId?: string; coverImageUrl?: string; views: number; likes: number }>>([]);
  const [loadingLiked, setLoadingLiked] = React.useState(false);
  const router = useRouter();

  const user = {
    username: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    avatarUrl: (session?.user?.image as string) ?? '',
  };

  const previewUrl = localPreview ?? user.avatarUrl;

  async function handleFileSelect(file: File) {
    try {
      const blobUrl = URL.createObjectURL(file);
      setLocalPreview(blobUrl);

      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/profile/avatar', { method: 'POST', body: form });
      const j = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(j.error || "Échec de l'upload de l'avatar");

      await update();
      setLocalPreview(null);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Erreur inconnue');
      setLocalPreview(null);
    }
  }

  const initials = (user.username || user.email || 'U').slice(0, 2).toUpperCase();

  React.useEffect(() => {
    let cancelled = false;
    async function loadMine() {
      try {
        setLoadingMine(true);
        const res = await fetch('/api/tierlists/mine');
        if (!res.ok) return;
        const j: { tierlists?: TierListPublic[] } = await res.json();
        if (!cancelled) {
          const mapped = (j.tierlists ?? []).map((t: TierListPublic) => ({
            id: t.id,
            title: t.title,
            updatedAt: t.updatedAt,
            championId: t.championId,
            coverImageUrl: t.coverImageUrl,
          }));
          setMine(mapped);
        }
      } finally {
        if (!cancelled) setLoadingMine(false);
      }
    }
    loadMine();
    async function loadLiked() {
      try {
        setLoadingLiked(true);
        const res = await fetch('/api/tierlists/liked');
        if (!res.ok) return;
        const j: { tierlists?: TierListPublic[] } = await res.json();
        if (!cancelled) {
          const mapped = (j.tierlists ?? []).map((t: TierListPublic) => ({
            id: t.id,
            title: t.title,
            updatedAt: t.updatedAt,
            championId: t.championId,
            coverImageUrl: t.coverImageUrl,
            views: t.views,
            likes: t.likes,
          }));
          setLiked(mapped);
        }
      } finally {
        if (!cancelled) setLoadingLiked(false);
      }
    }
    loadLiked();
    return () => { cancelled = true; };
  }, []);

  // In-page edit modal state
  const [editOpen, setEditOpen] = React.useState(false);
  const [formUsername, setFormUsername] = React.useState(user.username);
  const [formEmail, setFormEmail] = React.useState(user.email);
  const [saving, setSaving] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formOk, setFormOk] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (editOpen) {
      setFormUsername(user.username);
      setFormEmail(user.email);
      setFormError(null);
      setFormOk(null);
    }
  }, [editOpen, user.username, user.email]);

  async function onSubmitEdit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormOk(null);
    setSaving(true);
    try {
      if (formUsername !== user.username) {
        const r1 = await fetch('/api/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formUsername }),
        });
        const j1 = await r1.json().catch(()=>({}));
        if (!r1.ok) throw new Error(j1.error || 'Échec mise à jour pseudo');
      }
      if (formEmail !== user.email) {
        const r2 = await fetch('/api/profile/email', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formEmail }),
        });
        const j2 = await r2.json().catch(()=>({}));
        if (!r2.ok) throw new Error(j2.error || 'Échec mise à jour email');
      }
      await update();
      setFormOk('Profil mis à jour');
      setEditOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen py-8">
      <Container>
        {/* Header profil */}
        <Card className="mb-8 bg-white/5 border border-white/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar initials={initials} imageUrl={previewUrl} size="xl" editable onFileSelect={handleFileSelect} />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white mb-1">{user.username || '—'}</h1>
              <p className="text-gray-300 mb-3">{user.email || '—'}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4" />
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Button onClick={() => setEditOpen(true)}>Modifier le profil</Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mes Tier Lists */}
          <Card className="bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Mes Tier Lists</h2>
              <Link href="/tier-lists/new"><Button>+ Nouvelle Tier List</Button></Link>
            </div>
            {loadingMine ? (
              <p className="text-sm text-gray-400">Chargement…</p>
            ) : mine.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune tier list créée pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mine.map(t => (
                  <TierListCard
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    description={`MAJ ${new Date(t.updatedAt).toLocaleDateString()}`}
                    views={0}
                    likes={0}
                    gradientFrom="from-blue-600"
                    gradientTo="to-purple-500"
                    previewText={(t.championId || 'TL').slice(0,4).toUpperCase()}
                    championId={t.championId}
                    imageUrl={t.coverImageUrl}
                    onEdit={() => router.push(`/tier-lists/${t.id}`)}
                    onDelete={async () => {
                      if (!confirm('Supprimer cette tier list ?')) return;
                      const res = await fetch(`/api/tierlists/${t.id}`, { method: 'DELETE' });
                      if (res.ok) setMine(prev => prev.filter(x => x.id !== t.id));
                    }}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Tier Lists likées */}
          <Card className="bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Mes likes</h2>
            </div>
            {loadingLiked ? (
              <p className="text-sm text-gray-400">Chargement…</p>
            ) : liked.length === 0 ? (
              <p className="text-sm text-gray-400">Tu n&apos;as pas encore liké de tier list.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liked.map(t => (
                  <TierListCard
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    description={`MAJ ${new Date(t.updatedAt).toLocaleDateString()}`}
                    views={t.views}
                    likes={t.likes}
                    gradientFrom="from-blue-600"
                    gradientTo="to-purple-500"
                    previewText={(t.championId || 'TL').slice(0,4).toUpperCase()}
                    championId={t.championId}
                    imageUrl={t.coverImageUrl}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </Container>

      {/* Edit profile modal */}
      <Modal open={editOpen} title="Modifier le profil" onClose={() => setEditOpen(false)}>
        <form onSubmit={onSubmitEdit} className="space-y-4">
          {formError && <div className="text-sm text-red-400">{formError}</div>}
          {formOk && <div className="text-sm text-green-400">{formOk}</div>}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Pseudo</label>
            <input
              value={formUsername}
              onChange={e=>setFormUsername(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
              placeholder="Ton pseudo"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={formEmail}
              onChange={e=>setFormEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
              placeholder="toi@exemple.com"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
