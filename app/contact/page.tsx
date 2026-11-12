'use client';

import { useState } from 'react';
import { Input, Textarea, Button, Alert } from '@/components/ui/FormElements';
import { contactSchema, validateForm, ContactFormData } from '@/lib/schemas';
import { useCms } from '@/components/cms/CmsProvider';
import FaqSection from '@/components/ui/FaqSection';
import api from '@/lib/api';

const EMPTY: ContactFormData = { nom: '', email: '', message: '' };

export default function ContactPage() {
  const { getSectionContent } = useCms();
  const contactInfo = getSectionContent('contact_info');

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');

  const set =
    (field: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: '' }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateForm(contactSchema, form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setStatus('success');
      setServerMsg(res.data.message || 'Message envoyé !');
      setForm(EMPTY);
      setErrors({});
    } catch (err: any) {
      setStatus('error');
      setServerMsg(err.response?.data?.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 mb-12">
        <h1 className="text-3xl font-bold text-navy-600 mb-2 animate-fade-in">
          {contactInfo?.page_title || 'Contactez-nous'}
        </h1>
        <p className="text-gray-500 mb-6 animate-slide-up">
          {contactInfo?.page_subtitle || 'Nous répondons dans les 24h ouvrées.'}
        </p>

        <div className="card-modern bg-white rounded-2xl border border-gray-100 p-6 animate-slide-up delay-100">
          {status !== 'idle' && (
            <div className="mb-6">
              <Alert type={status} message={serverMsg} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Nom complet"
              required
              value={form.nom}
              onChange={set('nom')}
              placeholder="Votre nom"
              error={errors.nom ? ({ message: errors.nom } as any) : undefined}
            />

            <Input
              label="Adresse e-mail"
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="exemple@email.com"
              error={errors.email ? ({ message: errors.email } as any) : undefined}
            />

            <Textarea
              label="Message"
              required
              value={form.message}
              onChange={set('message')}
              placeholder="Comment pouvons-nous vous aider ?"
              rows={5}
              error={errors.message ? ({ message: errors.message } as any) : undefined}
            />

            <Button loading={loading} className="w-full">
              Envoyer le message
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-navy-600 mb-1">Email</p>
              {contactInfo?.email_primary && (
                <a
                  href={`mailto:${contactInfo.email_primary}`}
                  className="hover:text-gold-400 transition-colors break-all block"
                >
                  {contactInfo.email_primary}
                </a>
              )}
              {contactInfo?.email_secondary && (
                <a
                  href={`mailto:${contactInfo.email_secondary}`}
                  className="hover:text-gold-400 transition-colors break-all block mt-1"
                >
                  {contactInfo.email_secondary}
                </a>
              )}
            </div>
            <div>
              <p className="font-semibold text-navy-600 mb-1">Téléphone</p>
              {contactInfo?.phone_primary && (
                <a
                  href={`tel:${contactInfo.phone_primary}`}
                  className="hover:text-gold-400 transition-colors block"
                >
                  {contactInfo.phone_primary}
                </a>
              )}
              {contactInfo?.phone_secondary && (
                <a
                  href={`tel:${contactInfo.phone_secondary}`}
                  className="hover:text-gold-400 transition-colors block mt-1"
                >
                  {contactInfo.phone_secondary}
                </a>
              )}
            </div>
            <div>
              <p className="font-semibold text-navy-600 mb-1">Adresse & Horaires</p>
              <p>{contactInfo?.address || "N'Djaména, Tchad"}</p>
              {contactInfo?.hours && (
                <p className="text-xs text-gray-400 mt-1">{contactInfo.hours}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <FaqSection />
    </main>
  );
}
