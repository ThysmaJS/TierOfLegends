"use client";

import React from 'react';

type PasswordInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  autoComplete?: string;
  invalid?: boolean;
  className?: string;
};

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = '••••••••',
  autoComplete,
  invalid = false,
  className = '',
}: PasswordInputProps) {
  const [show, setShow] = React.useState(false);
  const toggle = () => setShow((s) => !s);

  const base = 'w-full bg-white/10 border rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400';
  const border = invalid ? 'border-red-500/60' : 'border-white/20';

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className={[base, border, className].filter(Boolean).join(' ')}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute inset-y-0 right-2 my-auto h-8 w-8 grid place-items-center text-gray-300 hover:text-white"
        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        title={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {show ? (
          // Eye off icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-6.94"/>
            <path d="M1 1l22 22"/>
            <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c.61 0 1.18-.16 1.67-.44"/>
            <path d="M14.47 14.47 9.53 9.53"/>
            <path d="M10.58 5.08A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-4.35 5.94"/>
          </svg>
        ) : (
          // Eye icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  );
}
