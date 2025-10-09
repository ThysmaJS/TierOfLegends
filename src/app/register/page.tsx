"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function passwordChecks(pw: string) {
  return {
    length: pw.length >= 8 && pw.length <= 64,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
    nospace: !/\s/.test(pw),
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const pw = passwordChecks(password);
  const allOk = pw.length && pw.lower && pw.upper && pw.digit && pw.special && pw.nospace && password === confirm && !!username && !!email;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!allOk) {
      setError('Mot de passe ou champs invalides');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });
      const j = await res.json().catch(()=>({}));
      if (!res.ok) {
        setError(j.error || 'Inscription impossible');
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Register error', err);
      setError('Inscription impossible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-sm px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
          <p className="text-gray-300 text-sm mt-2">Rejoins Tier of Legends</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 shadow">
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (<div className="text-sm text-red-400">{error}</div>)}

            <div>
              <label htmlFor="username" className="block text-sm text-gray-300 mb-1">Pseudo</label>
              <input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
                placeholder="Pseudo"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
                placeholder="toi@exemple.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-300 mb-1">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <ul className="mt-2 text-xs space-y-1">
                <li className={pw.length ? 'text-green-400' : 'text-gray-400'}>• 8 à 64 caractères</li>
                <li className={pw.lower ? 'text-green-400' : 'text-gray-400'}>• 1 minuscule</li>
                <li className={pw.upper ? 'text-green-400' : 'text-gray-400'}>• 1 majuscule</li>
                <li className={pw.digit ? 'text-green-400' : 'text-gray-400'}>• 1 chiffre</li>
                <li className={pw.special ? 'text-green-400' : 'text-gray-400'}>• 1 caractère spécial</li>
                <li className={pw.nospace ? 'text-green-400' : 'text-gray-400'}>• Pas d'espace</li>
              </ul>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm text-gray-300 mb-1">Confirmer le mot de passe</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !allOk}
              className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium"
            >{loading ? 'Création du compte…' : 'Créer un compte'}</button>
          </form>

          <p className="text-sm text-gray-400 mt-4 text-center">
            Déjà inscrit ?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
