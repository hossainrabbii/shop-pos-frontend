'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.replace('/login');
    } else {
      setIsVerified(true);
    }
  }, [router]);

  // Render a clean blank/loading slate while verifying storage tokens to prevent content flashing
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}