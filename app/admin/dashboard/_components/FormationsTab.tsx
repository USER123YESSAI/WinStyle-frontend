'use client';
import { useState } from 'react';
import FormationsManager from '@/components/admin/FormationsManager';

type FormationLike = { id: number };

export default function FormationsTab({
  formations,
  setFormations
}: {
  formations: FormationLike[];
  setFormations: React.Dispatch<React.SetStateAction<FormationLike[]>>;
}) {
  return (
    <div>
      <FormationsManager
        formations={formations as any}
        setFormations={setFormations as any}
      />
    </div>
  );
}


