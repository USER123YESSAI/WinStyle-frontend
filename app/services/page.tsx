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
      <section className="relative bg-navy-600 pt-28 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-navy-400/10 rounded-full blur-3xl animate-float delay-500" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">Ce que nous proposons</p>
          <h1 className="text-5xl font-black text-white mb-3">Nos Services</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Trois domaines d'excellence complémentaires — Agence de placement, Confection sur mesure et Cosmétique naturelle.
          </p>
        </div>
      </section>

      {/* Onglets secteurs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 glass">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {SECTEURS.map((s, i) => (
              <button key={s.num} onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === i
                    ? 'border-gold-400 text-navy-600'
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
          <section key={s.num} className="py-12 px-6 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Image du secteur */}
                <div className={`relative h-72 sm:h-80 rounded-3xl overflow-hidden ${s.couleur} card-modern`}>
                  <img src={s.img} alt={s.titre} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-600/70 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                    <span className="text-gold-400 text-xs font-black uppercase tracking-widest">{s.num}</span>
                    <h2 className="text-white font-black text-2xl sm:text-3xl">{s.titre}</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">{s.detail}</p>
                  </div>
                </div>

                {/* Liste des services */}
                <div>
                  <h3 className="text-xl font-bold text-navy-600 mb-5">Ce que nous proposons</h3>
                  <div className="space-y-3">
                    {s.services.map((srv, j) => (
                      <div key={j} className="flex items-start gap-4 p-3 bg-white rounded-xl border border-gray-100 card-modern">
                        <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold-400 font-black text-xs">{String(j + 1).padStart(2, '0')}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-navy-600 text-sm">{srv.label}</p>
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

    </main>
  );
}
