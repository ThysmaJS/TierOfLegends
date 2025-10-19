"use client";

import { Button } from '../ui';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TierListCardProps {
  id: string;
  title: string;
  description: string;
  likes: number;
  gradientFrom: string;
  gradientTo: string;
  previewText: string;
  championId?: string;
  imageUrl?: string;
  createdAt?: string;
  href?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  hideActions?: boolean;
}

export default function TierListCard({
  id,
  title,
  description,
  likes,
  gradientFrom,
  gradientTo,
  previewText,
  championId,
  imageUrl,
  href,
  onEdit,
  onDelete,
  hideActions,
  createdAt,
}: TierListCardProps) {
  const [img, setImg] = React.useState<string | null>(imageUrl || null);
  // Use a fixed aspect ratio for all cards so items/spells/runes don't look shorter than champion splashes
  const aspect = '16 / 9';
  const [likeCount, setLikeCount] = React.useState<number>(likes);
  const [liking, setLiking] = React.useState(false);
  const [liked, setLiked] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    async function pickRandom() {
      try {
        if (imageUrl) { setImg(imageUrl); return; }
        if (!championId) { setImg(null); return; }
        const res = await fetch(`/api/champions/${championId}`);
        if (!res.ok) return;
        const j = await res.json();
        const skins: Array<{ loading: string; splash?: string }> = j.skins || [];
        if (skins.length > 0) {
          // Préférer les splash (format large adapté au 16:9), fallback sur loading si aucune splash
          const splashPool = skins.filter(s => !!s.splash).map(s => s.splash as string);
          const pool = splashPool.length > 0 ? splashPool : skins.map(s => s.loading);
          const url = pool[Math.floor(Math.random() * pool.length)] || null;
          if (!cancelled) setImg(url);
        } else if (!cancelled) {
          setImg(null);
        }
      } catch {
        if (!cancelled) setImg(null);
      }
    }
    pickRandom();
    return () => { cancelled = true; };
  }, [championId, imageUrl]);

  const viewHref = href || `/tier-lists/${id}`;
  const isIconPng = !!img && img.toLowerCase().includes('.png');

  async function toggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    try {
      const method = liked ? 'DELETE' : 'POST';
      // optimistic
      setLiked((prev) => !prev);
      setLikeCount((c) => c + (liked ? -1 : 1));
      const res = await fetch(`/api/tierlists/${id}/like`, { method });
      if (res.status === 401) {
        // revert and redirect to login
        setLiked((prev) => !prev);
        setLikeCount((c) => c + (liked ? 1 : -1));
        window.location.href = '/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
        return;
      }
      if (!res.ok) {
        // revert
        setLiked((prev) => !prev);
        setLikeCount((c) => c + (liked ? 1 : -1));
        return;
      }
      const j = await res.json();
      if (typeof j.likes === 'number') setLikeCount(j.likes);
      setLiked(j.liked === true);
    } finally {
      setLiking(false);
    }
  }

  return (
  <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
  <Link href={viewHref} className="block cursor-pointer" aria-label={`Ouvrir ${title}`}>
        <div className={`relative ${img ? 'bg-black' : `bg-gradient-to-br ${gradientFrom} ${gradientTo}`}`} style={{ aspectRatio: aspect }}>
          {img ? (
            <>
              {/* Background fill to cover edges */}
              <Image
                src={img}
                alt=""
                aria-hidden
                fill
                className={`object-cover ${isIconPng ? 'blur-lg scale-110 opacity-70' : ''}`}
                quality={100}
                priority={false}
              />
              {/* Foreground visual */}
              {isIconPng ? (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <Image src={img} alt={title} width={320} height={320} className="w-4/5 h-4/5 object-contain" quality={100} />
                </div>
              ) : null}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">{previewText}</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-300 mb-1 line-clamp-2">{description}</p>
        {createdAt && (
          <div className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Créée le {new Date(createdAt).toLocaleDateString()}
          </div>
        )}

        <div className="flex items-center justify-end text-sm text-gray-400 mb-3">
          <button
            onClick={toggleLike}
            disabled={liking}
            className={`cursor-pointer flex items-center px-2 py-1 rounded transition-colors ${liked ? 'text-pink-400 bg-pink-400/10 border border-pink-400/20' : 'hover:bg-white/10'}`}
            aria-pressed={liked || false}
            aria-label={liked ? 'Retirer le like' : 'Liker'}
          >
            <svg className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount}
          </button>
        </div>

        {!hideActions && (
          <div className="flex gap-2">
            <Link href={viewHref} className="flex-1 cursor-pointer">
              <Button variant="primary" size="sm" className="w-full">Voir</Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1 cursor-pointer">Modifier</Button>
            {onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete} className="flex-1 cursor-pointer">Supprimer</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
