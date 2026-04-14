'use client';
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

type FieldError = { message?: string };

// ─── Champ texte ──────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}
export function Input({ label, error, className, required, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className={clsx(
          'w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition',
          'focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
          className
        )}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  options: { value: string; label: string }[];
  placeholder?: string;
}
export function Select({ label, error, options, placeholder, className, required, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        defaultValue=""
        {...props}
        className={clsx(
          'w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition bg-white',
          'focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300',
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
}
export function Textarea({ label, error, className, required, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...props}
        rows={props.rows || 4}
        className={clsx(
          'w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition resize-none',
          'focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
          className
        )}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}

// ─── Upload fichier ───────────────────────────────────────────────
interface FileInputProps {
  label: string;
  error?: FieldError;
  accept?: string;
  register?: any;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function FileInput({ label, error, accept = '.pdf', register, name, onChange }: FileInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        {...(register && name ? register(name) : {})}
        className={clsx(
          'w-full rounded-lg border px-4 py-2.5 text-sm cursor-pointer',
          'file:mr-3 file:py-1 file:px-3 file:rounded file:border-0',
          'file:text-sm file:font-medium file:bg-[#1E3A5F] file:text-white',
          'hover:file:bg-[#C9A84C] transition',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
        )}
      />
      <p className="text-xs text-gray-400">PDF uniquement · 5 Mo maximum</p>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}

// ─── Bouton ───────────────────────────────────────────────────────
interface ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  type?: 'submit' | 'button' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
export function Button({ children, loading, variant = 'primary', type = 'submit', onClick, className, disabled }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={clsx(
        'px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2',
        variant === 'primary'
          ? 'bg-[#1E3A5F] text-white hover:bg-[#C9A84C] disabled:opacity-60'
          : 'border border-[#1E3A5F] text-[#1E3A5F] hover:bg-gray-50',
        className
      )}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── Alerte succès / erreur ───────────────────────────────────────
interface AlertProps {
  type: 'success' | 'error';
  message: string;
}
export function Alert({ type, message }: AlertProps) {
  return (
    <div className={clsx(
      'rounded-lg px-4 py-3 text-sm font-medium',
      type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
    )}>
      {message}
    </div>
  );
}
