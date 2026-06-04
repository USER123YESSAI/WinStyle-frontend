'use client';
import { useState } from 'react';
import { Input, Textarea, Button, Alert } from '@/components/ui/FormElements';
import { contactSchema, validateForm, ContactFormData } from '@/lib/schemas';
import api from '@/lib/api';

const EMPTY: ContactFormData = { nom: '', email: '', message: '' };

export default function ContactPage() {
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');

  const set = (field: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: '' }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateForm(contactSchema, form);
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }

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
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-600 mb-2 animate-fade-in">Contactez-nous</h1>
        <p className="text-gray-500 mb-6 animate-slide-up">Nous répondons dans les 24h ouvrées.</p>

        <div className="card-modern bg-white rounded-2xl border border-gray-100 p-6 animate-slide-up delay-100">
          {status !== 'idle' && (
            <div className="mb-6"><Alert type={status} message={serverMsg} /></div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Nom complet" required
              value={form.nom} onChange={set('nom')} placeholder="Votre nom"
              error={errors.nom ? { message: errors.nom } as any : undefined} />

            <Input label="Adresse e-mail" type="email" required
              value={form.email} onChange={set('email')} placeholder="exemple@email.com"
              error={errors.email ? { message: errors.email } as any : undefined} />

            <Textarea label="Message" required
              value={form.message} onChange={set('message')}
              placeholder="Comment pouvons-nous vous aider ?" rows={5}
              error={errors.message ? { message: errors.message } as any : undefined} />

            <Button loading={loading} className="w-full">Envoyer le message</Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-navy-600 mb-1">Email</p>
              <a href="mailto:contact@winsagency.com" className="hover:text-gold-400 transition-colors">
                contact@winsagency.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
