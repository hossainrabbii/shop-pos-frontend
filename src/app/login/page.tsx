'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingButton';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
      try {
          console.log(data);
      const response = await api.post('/auth/login', data);
      const { accessToken, refreshToken, user } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Shop POS System</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Password
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

          <LoadingButton isLoading={isLoading} loadingText="Signing in..." type="submit">
            Sign In <ArrowRight className="w-4 h-4" />
          </LoadingButton>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">
              Create account
            </Link>
          </p>
              </form>
              
          <div className="text-center mt-4">
            <Link href="/forgot-password" className="text-xs text-indigo-600 font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Forgot Password
            </Link>
          </div>
      </div>
    </div>
  );
}