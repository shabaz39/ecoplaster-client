'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Authentication Error
        </h2>
        <p className="mt-2 text-gray-600">
          {error === 'OAuthSignin'
            ? 'An error occurred during sign in. Please try again.'
            : 'There was a problem signing you in.'}
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="text-newgreensecond hover:text-newgreen underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}