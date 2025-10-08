"use client";

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 shadow-lg">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block text-white" href="/">
              <span className="sr-only">Home</span>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TL</span>
                </div>
                <span className="text-xl font-bold text-white">Tier of Legends</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link className="text-gray-400 transition hover:text-white" href="/tier-lists">
                    Tier Lists
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 transition hover:text-white" href="/profil">
                    Profil
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                href="/login"
              >
                Se connecter
              </Link>

              <div className="hidden sm:flex">
                <Link
                  className="rounded-md bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                  href="/register"
                >
                  S&apos;inscrire   
                </Link>
              </div>
            </div>

            <div className="block md:hidden">
              <button
                className="rounded-sm bg-gray-800 p-2 text-gray-400 transition hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
