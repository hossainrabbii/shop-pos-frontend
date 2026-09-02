'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingButton';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', data);
      
      // Store email temporarily for the reset password step
      localStorage.setItem('resetPasswordEmail', data.email);

      toast.success(response.data?.message || 'Password reset instructions sent to your email.');
      router.push('/reset-password');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your account email to receive a reset code</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                {...register('email')}
                placeholder="admin@shop.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 shadow-xs"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
          </div>

          <LoadingButton isLoading={isLoading} loadingText="Sending code..." type="submit">
            Send Reset Code <ArrowRight className="w-4 h-4" />
          </LoadingButton>

          <div className="text-center mt-4">
            <Link href="/login" className="text-xs text-indigo-600 font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}