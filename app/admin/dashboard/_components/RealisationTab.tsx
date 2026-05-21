'use client';
import { useState } from 'react';
import RealisationsManager from '@/components/admin/RealisationsManager';

type RealisationLike = {
  id: number;
};

export default function RealisationTab({
  realisations,
  setRealisations
}: {
  realisations: RealisationLike[];
  setRealisations: React.Dispatch<React.SetStateAction<RealisationLike[]>>;
}) {
  return (
    <div>
      <RealisationsManager
        realisations={realisations as any}
        setRealisations={setRealisations as any}
      />
    </div>
  );
}

