'use client';
import { useState } from 'react';
import { Input, Select, Textarea, Button, Alert } from '@/components/ui/FormElements';
import { serviceRequestSchema, validateForm, ServiceRequestFormData } from '@/lib/schemas';
import api from '@/lib/api';

const SECTEURS = [
  {
    num: '01',
    icon: '👔',
    titre: 'consultante en ressources humaine',
    img: '/images/services/hotesses-stewards.jpg',
    couleur: 'bg-blue-900',
    services: [
      { label: 'Hôtesses & Stewards', desc: 'Pour événements, entreprises et cérémonies officielles' },
      { label: 'Employés domestiques', desc: 'Gouvernantes, nounous, cuisiniers, personnels de maison' },
      { label: 'Événementiel & Consultance', desc: 'Organisation, coordination, conseil RH' },
      { label: 'Formation & Coaching', desc: 'Développement personnel, posture, protocole, présentation' },
    ],
    detail: 'Un recrutement rigoureux, un suivi professionnel.',
  },
  {
    num: '02',
    icon: '✂️',
    titre: 'Confection sur Mesure',
    img: '/images/services/confection.jpg',
    couleur: 'bg-amber-900',
    services: [
      { label: 'Tenues soirée & gala', desc: 'Robes de soirée, smokings, tenues de cérémonie' },
      { label: 'Uniformes professionnels', desc: 'Tenues pour entreprises, hôtels, compagnies' },
      { label: 'Prêt-à-porter moderne', desc: 'Collections femme & homme inspirées du continent' },
      { label: 'Vêtements sur commande', desc: 'À partir de 10 000 FCFA selon complexité' },
    ],
    detail: '#WinstyleFashion — Élégance et authenticité africaine.',
  },
  {
    num: '03',
    icon: '🌿',
    titre: 'Cosmétique Naturelle',
    img: '/images/services/cosmetique.jpg',
    couleur: 'bg-green-900',
    services: [
      { label: 'Shampoing ultra-doux au miel', desc: 'Nettoyage doux adapté aux cheveux africains' },
      { label: 'Crème hydratante antipelliculaire', desc: 'Soin du cuir chevelu naturel et efficace' },
      { label: 'Huile de chébé anti-alopécie', desc: 'Ingrédient traditionnel du Tchad — pousse et force' },
      { label: 'Huile essentielle pour la repousse', desc: 'Stimulation du follicule pileux' },
      { label: 'Poudre de chébé du Tchad', desc: 'Masque capillaire ancestral naturel' },
      { label: 'Manuel capillaire', desc: 'Guide pratique pour l\'entretien des cheveux afro' },
    ],
    detail: 'Entre 5 000 et 15 000 FCFA selon le produit.',
  },
];

const FORM_SERVICES = [
  { value: 'Accueil & Protocole',           label: 'Accueil & Protocole' },
  { value: 'Hôtesses & Stewards',           label: 'Hôtesses & Stewards' },
  { value: 'Modèles photo & Égéries',       label: 'Modèles photo & Égéries' },
  { value: 'Communication',                 label: 'Communication' },
  { value: 'Nounous & Personnel de ménage', label: 'Nounous & Personnel de ménage' },
  { value: 'Serveurs & Serveuses',          label: 'Serveurs & Serveuses' },
  { value: 'Formation professionnelle',     label: 'Formation professionnelle' },
  { value: 'Confection sur mesure',         label: 'Confection sur mesure' },
  { value: 'Cosmétique / Produits capillaires', label: 'Cosmétique / Produits capillaires' },
  { value: 'Agence',                        label: 'Autre / Agence' },
];

const EMPTY: ServiceRequestFormData = { nom: '', entreprise: '', telephone: '', service: '', message: '', date_evenement: '' };

export default function ServicesPage() {
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [activeTab, setActiveTab] = useState(0);

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
      setForm(EMPTY); setErrors({});
    } catch (err: any) {
      setStatus('error');
      const be = err.response?.data?.errors;
      setServerMsg(be?.[0] || err.response?.data?.message || 'Une erreur est survenue.');
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative bg-[#0E2240] pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-4">Ce que nous proposons</p>
          <h1 className="text-5xl font-black text-white mb-4">Nos Services</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Trois domaines d'excellence complémentaires — Agence de placement, Confection sur mesure et Cosmétique naturelle.
          </p>
        </div>
      </section>

      {/* Onglets secteurs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {SECTEURS.map((s, i) => (
              <button key={s.num} onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === i
                    ? 'border-[#C9A84C] text-[#0E2240]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}>
                <span>{s.icon}</span> {s.titre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Secteur actif */}
      {SECTEURS.map((s, i) => (
        activeTab === i && (
          <section key={s.num} className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Image du secteur */}
                <div className={`relative h-80 sm:h-96 rounded-3xl overflow-hidden ${s.couleur}`}>
                  <img src={s.img} alt={s.titre} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2240]/70 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                    <span className="text-[#C9A84C] text-xs font-black uppercase tracking-widest">{s.num}</span>
                    <h2 className="text-white font-black text-2xl sm:text-3xl">{s.titre}</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">{s.detail}</p>
                  </div>
                </div>

                {/* Liste des services */}
                <div>
                  <h3 className="text-xl font-bold text-[#0E2240] mb-6">Ce que nous proposons</h3>
                  <div className="space-y-4">
                    {s.services.map((srv, j) => (
                      <div key={j} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#C9A84C] font-black text-xs">{String(j + 1).padStart(2, '0')}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0E2240] text-sm">{srv.label}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{srv.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      ))}

      {/* Formulaire */}
      <section className="py-16 px-6 bg-[#0E2240]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">Travaillons ensemble</p>
            <h2 className="text-3xl font-black text-white mb-3">Faire une demande</h2>
            <p className="text-white/50">Décrivez votre besoin, nous vous répondons dans les 24h.</p>
          </div>

          <div className="bg-white rounded-2xl p-8">
            {status !== 'idle' && (
              <div className="mb-6"><Alert type={status} message={serverMsg} /></div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Nom complet" required value={form.nom} onChange={set('nom')} placeholder="Votre nom"
                  error={errors.nom ? { message: errors.nom } as any : undefined} />
                <Input label="Entreprise / Organisation" value={form.entreprise} onChange={set('entreprise')} placeholder="Optionnel"
                  error={errors.entreprise ? { message: errors.entreprise } as any : undefined} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Téléphone" type="tel" value={form.telephone} onChange={set('telephone')} placeholder="+235 XX XX XX XX"
                  error={errors.telephone ? { message: errors.telephone } as any : undefined} />
                <Input label="Date de l'événement" type="date" value={form.date_evenement} onChange={set('date_evenement')}
                  error={errors.date_evenement ? { message: errors.date_evenement } as any : undefined} />
              </div>
              <Select label="Type de service" required value={form.service} onChange={set('service')}
                options={FORM_SERVICES} placeholder="-- Sélectionnez un service --"
                error={errors.service ? { message: errors.service } as any : undefined} />
              <Textarea label="Décrivez votre besoin" required value={form.message} onChange={set('message')}
                placeholder="Détails, nombre de personnes, contexte..." rows={4}
                error={errors.message ? { message: errors.message } as any : undefined} />
              <Button loading={loading} className="w-full">Envoyer ma demande</Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
