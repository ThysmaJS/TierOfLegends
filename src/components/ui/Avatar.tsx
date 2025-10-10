"use client";

import Image from 'next/image';
import React from 'react';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
  imageUrl?: string;
  onEdit?: () => void; // optional legacy handler
  onFileSelect?: (file: File) => void; // new: file picker callback
}

export default function Avatar({ initials, size = 'lg', editable = false, className = '', imageUrl, onEdit, onFileSelect }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-4xl'
  } as const;

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  function triggerPick() {
    if (onFileSelect && inputRef.current) {
      inputRef.current.click();
    } else if (onEdit) {
      onEdit();
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (onFileSelect) onFileSelect(file);
    // reset input so selecting the same file again still fires change
    e.currentTarget.value = '';
  }

  const isDataLike = !!imageUrl && (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:'));

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Avatar"
            fill
            sizes="128px"
            className="object-cover"
            priority
            unoptimized={isDataLike}
          />
        ) : (
          <span className="text-white font-bold">{initials}</span>
        )}
      </div>
      {editable && (
        <>
          <button
            type="button"
            aria-label="Changer l'avatar"
            onClick={triggerPick}
            className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
        </>
      )}
    </div>
  );
}
