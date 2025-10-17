import type { ObjectId } from 'mongodb';

export type TierRow = { name: string; items: string[] };

export type TierCategory = 'champion-skins' | 'items' | 'summoner-spells' | 'runes';

export interface TierListDoc {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  category?: TierCategory;
  categoryMeta?: Record<string, unknown>;
  championId?: string; // only for category 'champion-skins'
  tiers: TierRow[];
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierListCreateInput {
  title: string;
  category: TierCategory;
  championId?: string;
  categoryMeta?: Record<string, unknown>;
  tiers: TierRow[];
}

export interface TierListPublic {
  id: string;
  title: string;
  category: TierCategory;
  categoryMeta?: Record<string, unknown>;
  championId?: string;
  tiers: TierRow[];
  likes: number;
  views: number;
  updatedAt: string;
}
