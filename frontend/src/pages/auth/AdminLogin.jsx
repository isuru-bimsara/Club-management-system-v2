import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.adminLogin(data);
      login(response.admin, response.token);
      toast.success('Admin logged in successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="card w-full max-w-md bg-dark-800 border-dark-700 p-8 shadow-2xl">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="h-16 w-16 mb-4 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
            <Shield className="h-8 w-8 text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            System Administration
          </h2>
          <p className="mt-2 text-sm text-dark-400">
            Secure access for authorized personnel only
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium leading-6 text-dark-300 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              className={`block w-full rounded-md border-0 bg-dark-900/50 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-500 focus:ring-red-500' : 'ring-dark-600 focus:ring-primary-500'} sm:text-sm sm:leading-6 transition-all`}
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="mb-4 w-full">
            <label className="block text-sm font-medium leading-6 text-dark-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className={`block w-full rounded-md border-0 bg-dark-900/50 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ${errors.password ? 'ring-red-500 focus:ring-red-500' : 'ring-dark-600 focus:ring-primary-500'} sm:text-sm sm:leading-6 transition-all`}
              {...register('password')}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Authenticate
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/login')} 
            className="text-sm font-medium text-dark-400 hover:text-white transition-colors"
          >
            ← Return to User Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
