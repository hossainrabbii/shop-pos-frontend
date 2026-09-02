'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingButton';

const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  password: z.string().min(6, 'New password must be at least 6 characters long'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetPasswordEmail');
    if (!savedEmail) {
      toast.error('Unauthorized access. Please request a password reset first.');
      router.push('/forgot-password');
    } else {
      setEmail(savedEmail);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      // Step 1: Verify the reset OTP and retrieve the temporary resetToken from backend response
      const verifyRes = await api.post('/auth/verify-reset-otp', {
        email,
        otp: data.otp,
      });

      const resetToken = verifyRes.data?.data?.resetToken || verifyRes.data?.resetToken;

      if (!resetToken) {
        throw new Error('Reset token was not provided by the server');
      }

      // Step 2: Use the resetToken to update the password
      const resetRes = await api.post('/auth/reset-password', {
        resetToken,
        password: data.password,
      });

      // Clear temp storage
      localStorage.removeItem('resetPasswordEmail');

      toast.success(resetRes.data?.message || 'Password reset successful! Please log in with your new password.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter the 6-digit code sent to <span className="font-semibold text-slate-800">{email || 'your email'}</span> and your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Reset Code (OTP)
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 shadow-xs"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
          </div>

          <LoadingButton isLoading={isLoading} loadingText="Resetting password..." type="submit">
            Update Password <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}