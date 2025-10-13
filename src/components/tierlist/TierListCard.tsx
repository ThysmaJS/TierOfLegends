"use client";

import { Button } from '../ui';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TierListCardProps {
  id: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  gradientFrom: string;
  gradientTo: string;
  previewText: string;
  championId: string;
  href?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  hideActions?: boolean;
}

export default function TierListCard({
  id,
  title,
  description,
  views,
  likes,
  gradientFrom,
  gradientTo,
  previewText,
  championId,
  href,
  onEdit,
  onDelete,
  hideActions,
}: TierListCardProps) {
  const [img, setImg] = React.useState<string | null>(null);
  const [aspect, setAspect] = React.useState<string>('16 / 9');
  React.useEffect(() => {
    let cancelled = false;
    async function pickRandom() {
      try {
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
  }, [championId]);

  const viewHref = href || `/tier-lists/${id}`;

  return (
    <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={viewHref} className="block">
        <div className={`relative bg-gradient-to-br ${gradientFrom} ${gradientTo}`} style={{ aspectRatio: aspect }}>
          {img ? (
            <Image
              src={img}
              alt={title}
              fill
              className="object-contain"
              onLoadingComplete={(el) => {
                // Calcule le ratio réel de l'image pour que le conteneur s'adapte et évite tout recadrage
                const w = el.naturalWidth || 1215;
                const h = el.naturalHeight || 717;
                setAspect(`${w} / ${h}`);
              }}
            />
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
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {views} vues
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likes} likes
          </span>
        </div>

        {!hideActions && (
          <div className="flex gap-2">
            <Link href={viewHref} className="flex-1">
              <Button variant="primary" size="sm" className="w-full">Voir</Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1">Modifier</Button>
            {onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete} className="flex-1">Supprimer</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
