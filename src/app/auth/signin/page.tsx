'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-newgreensecond hover:bg-newgreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-newgreen"
          >
            <img src="/google-logo.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}