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
    <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Contactez-nous</h1>
        <p className="text-gray-500 mb-8">Nous répondons dans les 24h ouvrées.</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {status !== 'idle' && (
            <div className="mb-6"><Alert type={status} message={serverMsg} /></div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

          <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-[#1E3A5F] mb-1">WhatsApp</p>
              <a href="https://wa.me/221XXXXXXX" target="_blank" rel="noopener noreferrer"
                className="hover:text-[#C9A84C] transition">+221 XX XXX XX XX</a>
            </div>
            <div>
              <p className="font-semibold text-[#1E3A5F] mb-1">Email</p>
              <a href="mailto:contact@winsagency.com" className="hover:text-[#C9A84C] transition">
                contact@winsagency.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <a href="https://wa.me/221XXXXXXX" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Nous contacter sur WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.428a.75.75 0 00.916.916l5.566-1.476A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 01-4.964-1.36l-.355-.212-3.683.976.976-3.567-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      </a>
    </main>
  );
}
