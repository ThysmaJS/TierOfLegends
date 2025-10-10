"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { sanitizeCallbackUrl } from '@/lib/safeRedirect';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-12" />}> 
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [callbackUrl, setCallbackUrl] = React.useState<string>('/');

  React.useEffect(() => {
    const rawCb = sp.get('callbackUrl');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    try {
      const safePath = sanitizeCallbackUrl(rawCb, origin || '');
      setCallbackUrl(safePath || '/');
    } catch {
      setCallbackUrl('/');
    }
  }, [sp]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }
    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const absoluteCb = origin ? new URL(callbackUrl || '/', origin).toString() : callbackUrl || '/';
      const res = await signIn('credentials', { redirect: false, email, password, callbackUrl: absoluteCb });
      if (res?.error) {
        setError('Identifiants invalides');
      } else {
        router.push(callbackUrl || '/');
      }
    } catch (err) {
      console.error('Login error', err);
      setError('Connexion impossible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-sm px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Connexion</h1>
          <p className="text-gray-300 text-sm mt-2">Accède à ton compte Tier of Legends</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 shadow">
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-400">{error}</div>
            )}
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
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium"
            >{loading ? 'Connexion…' : 'Se connecter'}</button>
          </form>

          <p className="text-sm text-gray-400 mt-4 text-center">
            Pas de compte ?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
