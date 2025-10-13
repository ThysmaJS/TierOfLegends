"use client";

import React from 'react';
import { TierListViewer, type Tier } from 'react-tierlist';

export default function ClientTierListViewer({ data }: { data: Tier[] }) {
  return <TierListViewer data={data} config={{ rowHeight: 96 }} />;
}
