'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingButton';
import Link from 'next/link';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function RegisterVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    if (!pendingEmail) {
      toast.error('No pending registration found. Please register first.');
      router.push('/register');
    } else {
      setEmail(pendingEmail);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-email', {
        email,
        otp: data.otp,
      });

      const { accessToken, refreshToken, user } = response.data.data;

      // Clean up temp storage and set session credentials
      localStorage.removeItem('pendingVerificationEmail');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(response.data?.message || 'Email verified successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Verify Your Email</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter the 6-digit verification code sent to <span className="font-semibold text-slate-800">{email || 'your email'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Verification Code (OTP)
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                maxLength={6}
                autoComplete="one-time-code"
                {...register('otp')}
                placeholder="123456"
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border rounded-lg text-sm tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 shadow-xs"
              />
            </div>
            {errors.otp && <p className="text-xs text-rose-600 mt-1">{errors.otp.message}</p>}
          </div>

          <LoadingButton isLoading={isLoading} loadingText="Verifying OTP..." type="submit">
            Verify Email <ArrowRight className="w-4 h-4" />
          </LoadingButton>

          <p className="text-center text-xs text-slate-500 mt-4">
            Wrong email address?{' '}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">
              Register again
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}