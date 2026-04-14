'use client';
import { useState } from 'react';
import { Input, Select, Button, Alert, FileInput } from '@/components/ui/FormElements';
import { candidatureSchema, validateForm, CandidatureFormData } from '@/lib/schemas';
import api from '@/lib/api';

const POSTES = [
  { value: 'Hôtesse',          label: 'Hôtesse' },
  { value: 'Steward',          label: 'Steward' },
  { value: 'Serveur/Serveuse', label: 'Serveur / Serveuse' },
  { value: 'Nounou',           label: 'Nounou' },
  { value: 'Autre',            label: 'Autre' },
];

const EMPTY: CandidatureFormData = { nom: '', email: '', telephone: '', poste: '' };

export default function CandidaturePage() {
  const [form, setForm]           = useState(EMPTY);
  const [cvFile, setCvFile]       = useState<File | null>(null);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');

  const set = (field: keyof CandidatureFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: '' }));
    };

  const handleCv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCvFile(file);
    setErrors((p) => ({ ...p, cv: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation Joi
    const fieldErrors = validateForm(candidatureSchema, form);

    // Validation CV manuelle
    if (!cvFile) {
      fieldErrors.cv = 'Le CV est obligatoire';
    } else if (cvFile.type !== 'application/pdf') {
      fieldErrors.cv = 'Seuls les PDF sont acceptés';
    } else if (cvFile.size > 5 * 1024 * 1024) {
      fieldErrors.cv = 'Le fichier ne doit pas dépasser 5 Mo';
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nom',       form.nom);
      formData.append('email',     form.email);
      formData.append('telephone', form.telephone || '');
      formData.append('poste',     form.poste);
      formData.append('cv',        cvFile!);

      const res = await api.post('/candidatures', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('success');
      setServerMsg(res.data.message || 'Candidature envoyée avec succès !');
      setForm(EMPTY);
      setCvFile(null);
      setErrors({});
    } catch (err: any) {
      setStatus('error');
      const backendErrors = err.response?.data?.errors;
      setServerMsg(backendErrors?.[0] || err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Rejoignez notre équipe</h1>
        <p className="text-gray-500 mb-8">
          Vous êtes disponible, présentable et motivé ? Envoyez-nous votre candidature.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {status !== 'idle' && (
            <div className="mb-6">
              <Alert type={status} message={serverMsg} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Nom complet" required
              value={form.nom} onChange={set('nom')}
              placeholder="Votre nom complet"
              error={errors.nom ? { message: errors.nom } as any : undefined}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Adresse e-mail" type="email" required
                value={form.email} onChange={set('email')}
                placeholder="exemple@email.com"
                error={errors.email ? { message: errors.email } as any : undefined}
              />
              <Input
                label="Téléphone" type="tel"
                value={form.telephone} onChange={set('telephone')}
                placeholder="+221 XX XXX XX XX"
                error={errors.telephone ? { message: errors.telephone } as any : undefined}
              />
            </div>

            <Select
              label="Poste souhaité" required
              value={form.poste} onChange={set('poste')}
              options={POSTES} placeholder="-- Sélectionnez un poste --"
              error={errors.poste ? { message: errors.poste } as any : undefined}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Votre CV <span className="text-red-500">*</span>
              </label>
              <input
                type="file" accept=".pdf" onChange={handleCv}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm cursor-pointer
                  file:mr-3 file:py-1 file:px-3 file:rounded file:border-0
                  file:text-sm file:font-medium file:bg-[#1E3A5F] file:text-white
                  hover:file:bg-[#C9A84C] transition
                  ${errors.cv ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
              />
              <p className="text-xs text-gray-400">PDF uniquement · 5 Mo maximum</p>
              {errors.cv && <p className="text-xs text-red-500">{errors.cv}</p>}
            </div>

            <Button loading={loading} className="w-full">
              Envoyer ma candidature
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
