"use client";

import { Button } from '../ui';

interface TierListCardProps {
  title: string;
  description: string;
  views: number;
  likes: number;
  gradientFrom: string;
  gradientTo: string;
  previewText: string;
  onView?: () => void;
  onEdit?: () => void;
}

export default function TierListCard({
  title,
  description,
  views,
  likes,
  gradientFrom,
  gradientTo,
  previewText,
  onView,
  onEdit
}: TierListCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Preview Image */}
      <div className={`aspect-video bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
        <span className="text-white text-lg font-semibold">{previewText}</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
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
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={onView} className="flex-1">
            Voir
          </Button>
          <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1">
            Modifier
          </Button>
        </div>
      </div>
    </div>
  );
}
