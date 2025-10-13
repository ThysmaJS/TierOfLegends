import type { ObjectId } from 'mongodb';

export type TierRow = { name: string; items: string[] };

export interface TierListDoc {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  championId: string;
  tiers: TierRow[];
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierListCreateInput {
  title: string;
  championId: string;
  tiers: TierRow[];
}

export interface TierListPublic {
  id: string;
  title: string;
  championId: string;
  tiers: TierRow[];
  likes: number;
  views: number;
  updatedAt: string;
}
