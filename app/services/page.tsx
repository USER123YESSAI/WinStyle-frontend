'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Input, Select, Textarea, Button, Alert } from '@/components/ui/FormElements';
import { serviceRequestSchema, validateForm, ServiceRequestFormData } from '@/lib/schemas';
import { useCms, resolveCmsMediaUrl } from '@/components/cms/CmsProvider';
import DynamicIcon from '@/components/ui/DynamicIcon';
import FaqSection from '@/components/ui/FaqSection';
import api from '@/lib/api';

const EMPTY: ServiceRequestFormData = {
  nom: '',
  entreprise: '',
  telephone: '',
  service: '',
  message: '',
  date_evenement: '',
};

export default function ServicesPage() {
  const { getSectionContent, isSectionActive } = useCms();
  const srvContent = getSectionContent('services_catalogue');

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  if (!isSectionActive('services_catalogue')) {
    return null;
  }

  const secteurs = Array.isArray(srvContent?.secteurs)
    ? [...srvContent.secteurs]
        .filter((s: any) => s.actif !== false)
        .sort((a: any, b: any) => (a.ordre ?? 0) - (b.ordre ?? 0))
    : [];

  // Options dynamiques du formulaire : combinées à partir des prestations actives et de form_options
  const dynamicServiceLabels = Array.from(
    new Set([
      ...secteurs.flatMap((s: any) =>
        Array.isArray(s.services)
          ? s.services.filter((item: any) => item.actif !== false).map((item: any) => item.label)
          : []
      ),
      ...(Array.isArray(srvContent?.form_options) ? srvContent.form_options : []),
    ])
  ).filter(Boolean);

  const formServiceOptions = dynamicServiceLabels.map((lbl: string) => ({
    value: lbl,
    label: lbl,
  }));

  const set =
    (field: keyof ServiceRequestFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: '' }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateForm(serviceRequestSchema, form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/services/request', form);
      setStatus('success');
      setServerMsg(res.data.message || 'Demande envoyée !');
      setForm(EMPTY);
      setErrors({});
    } catch (err: any) {
      setStatus('error');
      const be = err.response?.data?.errors;
      setServerMsg(be?.[0] || err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-navy-600 pt-28 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-navy-400/10 rounded-full blur-3xl animate-float delay-500" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
            {srvContent?.hero_subtitle || 'Ce que nous proposons'}
          </p>
          <h1 className="text-5xl font-black text-white mb-3">
            {srvContent?.hero_title || 'Nos Services'}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {srvContent?.hero_description}
          </p>
        </div>
      </section>

      {/* Onglets secteurs */}
      {secteurs.length > 0 && (
        <section className="bg-white border-b border-gray-200 sticky top-0 z-20 glass">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex overflow-x-auto">
              {secteurs.map((s: any, i: number) => (
                <button
                  key={s.id || s.num || i}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-2.5 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === i
                      ? 'border-gold-400 text-navy-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <DynamicIcon
                    name={s.icon}
                    className={`w-4 h-4 shrink-0 ${
                      activeTab === i ? 'text-gold-500' : 'text-gray-400'
                    }`}
                  />
                  <span>{s.titre}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Secteur actif */}
      {secteurs.map((s: any, i: number) => {
        if (activeTab !== i) return null;
        const activeSubServices = Array.isArray(s.services)
          ? s.services.filter((item: any) => item.actif !== false)
          : [];
        return (
          <section key={s.id || s.num || i} className="py-12 px-6 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Image du secteur */}
                <div
                  className={`relative h-72 sm:h-80 rounded-3xl overflow-hidden ${
                    s.couleur || 'bg-navy-800'
                  } card-modern`}
                >
                  <img
                    src={resolveCmsMediaUrl(s.img || '/images/services/hotesses-stewards.jpg')}
                    alt={s.titre}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-600/70 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                    <span className="text-gold-400 text-xs font-black uppercase tracking-widest">
                      {s.num}
                    </span>
                    <h2 className="text-white font-black text-2xl sm:text-3xl">{s.titre}</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">{s.detail}</p>
                  </div>
                </div>

                {/* Liste des services */}
                <div>
                  <h3 className="text-xl font-bold text-navy-600 mb-5">Ce que nous proposons</h3>
                  <div className="space-y-3">
                    {activeSubServices.map((srv: any, j: number) => (
                      <div
                        key={j}
                        className="flex items-start gap-4 p-3 bg-white rounded-xl border border-gray-100 card-modern"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold-400 font-black text-xs">
                            {String(j + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-navy-600 text-sm">{srv.label}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{srv.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <a
                      href="#demande-service"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          service: activeSubServices[0]?.label || s.titre || '',
                        }))
                      }
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-300 hover:shadow-glow"
                    >
                      <span>Demander ce service</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Formulaire de demande de service */}
      <section id="demande-service" className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-2">
              {srvContent?.form_subtitle || 'Devis & Réservation'}
            </p>
            <h2 className="text-3xl font-black text-navy-600 mb-2">
              {srvContent?.form_title || 'Faire une demande de service'}
            </h2>
            <p className="text-gray-500 text-sm">{srvContent?.form_description}</p>
          </div>

          <div className="card-modern bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-8">
            {status !== 'idle' && (
              <div className="mb-6">
                <Alert type={status} message={serverMsg} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom complet"
                  required
                  value={form.nom}
                  onChange={set('nom')}
                  placeholder="Votre nom complet"
                  error={errors.nom ? ({ message: errors.nom } as any) : undefined}
                />
                <Input
                  label="Entreprise / Organisation"
                  value={form.entreprise}
                  onChange={set('entreprise')}
                  placeholder="Nom de votre structure (optionnel)"
                  error={errors.entreprise ? ({ message: errors.entreprise } as any) : undefined}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Téléphone"
                  type="tel"
                  required
                  value={form.telephone}
                  onChange={set('telephone')}
                  placeholder="+235 65 09 60 24"
                  error={errors.telephone ? ({ message: errors.telephone } as any) : undefined}
                />
                <Input
                  label="Date de l'événement (optionnel)"
                  type="date"
                  value={form.date_evenement}
                  onChange={set('date_evenement')}
                  error={
                    errors.date_evenement ? ({ message: errors.date_evenement } as any) : undefined
                  }
                />
              </div>

              <Select
                label="Service souhaité"
                required
                value={form.service}
                onChange={set('service')}
                options={formServiceOptions}
                placeholder="-- Sélectionnez un service --"
                error={errors.service ? ({ message: errors.service } as any) : undefined}
              />

              <Textarea
                label="Détails de votre besoin"
                required
                value={form.message}
                onChange={set('message')}
                placeholder="Précisez le type d'événement, le nombre de personnes, la durée, le lieu..."
                rows={4}
                error={errors.message ? ({ message: errors.message } as any) : undefined}
              />

              <Button loading={loading} className="w-full">
                Envoyer ma demande
              </Button>
            </form>
          </div>
        </div>
      </section>

      <FaqSection />
    </main>
  );
}
