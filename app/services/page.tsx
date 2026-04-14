'use client';
import { useState } from 'react';
import { Input, Select, Textarea, Button, Alert } from '@/components/ui/FormElements';
import { serviceRequestSchema, validateForm, ServiceRequestFormData } from '@/lib/schemas';
import api from '@/lib/api';

const SERVICES = [
  { value: 'Accueil & Protocole',           label: 'Accueil & Protocole' },
  { value: 'Hôtesses & Stewards',           label: 'Hôtesses & Stewards' },
  { value: 'Modèles photo & Égéries',       label: 'Modèles photo & Égéries' },
  { value: 'Communication',                 label: 'Communication' },
  { value: 'Nounous & Personnel de ménage', label: 'Nounous & Personnel de ménage' },
  { value: 'Serveurs & Serveuses',          label: 'Serveurs & Serveuses' },
  { value: 'Formation professionnelle',     label: 'Formation professionnelle' },
  { value: 'Agence',                        label: 'Agence' },
];

const SERVICE_LIST = [
  { num: '01', label: 'Accueil & Protocole' },
  { num: '02', label: 'Hôtesses & Stewards' },
  { num: '03', label: 'Modèles photo & Égéries' },
  { num: '04', label: 'Communication' },
  { num: '05', label: 'Nounous & Personnel de ménage' },
  { num: '06', label: 'Serveurs & Serveuses' },
  { num: '07', label: 'Formation professionnelle' },
  { num: '08', label: 'Agence' },
];

const EMPTY: ServiceRequestFormData = {
  nom: '', entreprise: '', telephone: '', service: '', message: '', date_evenement: '',
};

export default function ServicesPage() {
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');

  const set = (field: keyof ServiceRequestFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: '' }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateForm(serviceRequestSchema, form);
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }
    setLoading(true);
    try {
      const res = await api.post('/services/request', form);
      setStatus('success');
      setServerMsg(res.data.message || 'Demande envoyée !');
      setForm(EMPTY);
      setErrors({});
    } catch (err: any) {
      setStatus('error');
      const backendErrors = err.response?.data?.errors;
      setServerMsg(backendErrors?.[0] || err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const col1 = SERVICE_LIST.slice(0, 4);
  const col2 = SERVICE_LIST.slice(4);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-[#0E2240] text-white pt-36 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Nos Services</h1>
          <p className="text-blue-200 text-lg">Du personnel qualifié, disponible et professionnel pour tous vos besoins.</p>
        </div>
      </section>

      {/* Liste des services numérotés */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0E2240] text-center mb-3">NOS SERVICES</h2>
          <div className="w-16 h-1 bg-[#C9A84C] mx-auto mb-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-0">
            {/* Colonne gauche */}
            <div>
              {col1.map((s) => (
                <div key={s.num} className="flex items-center gap-4 py-4 border-b border-gray-200">
                  <span className="text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-1 rounded">{s.num}</span>
                  <span className="font-semibold text-[#0E2240]">{s.label}</span>
                </div>
              ))}
            </div>
            {/* Colonne droite */}
            <div>
              {col2.map((s) => (
                <div key={s.num} className="flex items-center gap-4 py-4 border-b border-gray-200">
                  <span className="text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-1 rounded">{s.num}</span>
                  <span className="font-semibold text-[#0E2240]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0E2240] mb-2">Faire une demande</h2>
          <p className="text-gray-500 mb-8">Décrivez votre besoin, nous vous répondons dans les 24h.</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {status !== 'idle' && (
              <div className="mb-6"><Alert type={status} message={serverMsg} /></div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Nom complet" required
                  value={form.nom} onChange={set('nom')} placeholder="Votre nom"
                  error={errors.nom ? { message: errors.nom } as any : undefined} />
                <Input label="Entreprise / Organisation"
                  value={form.entreprise} onChange={set('entreprise')} placeholder="Optionnel"
                  error={errors.entreprise ? { message: errors.entreprise } as any : undefined} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Téléphone" type="tel"
                  value={form.telephone} onChange={set('telephone')} placeholder="+221 XX XXX XX XX"
                  error={errors.telephone ? { message: errors.telephone } as any : undefined} />
                <Input label="Date de l'événement" type="date"
                  value={form.date_evenement} onChange={set('date_evenement')}
                  error={errors.date_evenement ? { message: errors.date_evenement } as any : undefined} />
              </div>

              <Select label="Type de service" required
                value={form.service} onChange={set('service')}
                options={SERVICES} placeholder="-- Sélectionnez un service --"
                error={errors.service ? { message: errors.service } as any : undefined} />

              <Textarea label="Décrivez votre besoin" required
                value={form.message} onChange={set('message')}
                placeholder="Nombre de personnes requis, durée, contexte de l'événement..." rows={5}
                error={errors.message ? { message: errors.message } as any : undefined} />

              <Button loading={loading} className="w-full">Envoyer ma demande</Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
