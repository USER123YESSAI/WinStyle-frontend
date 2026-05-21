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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          🏆 Réalisations ({realisations.length})
        </h2>
      </div>

      <RealisationsManager
        realisations={realisations as any}
        setRealisations={setRealisations as any}
      />
    </div>
  );
}

