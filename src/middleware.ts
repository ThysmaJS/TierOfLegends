import { NextResponse } from 'next/server';

// No-op middleware to satisfy Next.js/Vercel. Does nothing and matches no routes.
export default function middleware() {
	return NextResponse.next();
}

export const config = {
	matcher: [],
};
