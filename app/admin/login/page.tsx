'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Alert } from '@/components/ui/FormElements';
import { loginSchema, validateForm, LoginFormData } from '@/lib/schemas';
import api from '@/lib/api';

const EMPTY: LoginFormData = { email: '', password: '' };

export default function AdminLoginPage() {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const set = (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: '' }));
      setServerError('');
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateForm(loginSchema, form);
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('wins_token', res.data.token);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1E3A5F] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">WIN'S AGENCY</h1>
          <p className="text-sm text-gray-400 mt-1">Espace administrateur</p>
        </div>

        {serverError && <div className="mb-4"><Alert type="error" message={serverError} /></div>}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="E-mail" type="email" required
            value={form.email} onChange={set('email')} placeholder="Email@gmail.com"
            error={errors.email ? { message: errors.email } as any : undefined} />

          <Input label="Mot de passe" type="password" required
            value={form.password} onChange={set('password')} placeholder="••••••••"
            error={errors.password ? { message: errors.password } as any : undefined} />

          <Button loading={loading} className="w-full mt-2">Se connecter</Button>
        </form>
      </div>
    </main>
  );
}
