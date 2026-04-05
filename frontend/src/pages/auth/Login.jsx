import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import logo from '../../assets/logo.png';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine((val) => {
      const email = val.toLowerCase();
      return email.endsWith('sliit.lk') || email.endsWith('my.sliit.lk');
    }, {
      message: 'Email must be a valid SLIIT address (ends with sliit.lk or my.sliit.lk)',
    }),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await authService.login(data);
      login(response.user, response.token);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4] p-4 sm:p-8 overflow-hidden">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.05)] flex flex-col md:flex-row overflow-hidden p-3 gap-8 relative z-10">

        {/* Left Bounding Box (Hero Graphics matching Dashboard UI) */}
        <div className="hidden md:flex flex-col w-1/2 bg-white rounded-[2rem] p-12 relative overflow-hidden border border-primary-100 shadow-[inset_0_2px_20px_rgb(0,0,0,0.02)] animate-slide-left-slow group">
          
          {/* Background identical to Home UI */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#ffffff] via-primary-50/20 to-[#f4f7f4]">
             {/* Abstract blobs */}
             <div className="absolute -top-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#16a383]/5 blur-3xl group-hover:bg-[#16a383]/10 transition-colors duration-700"></div>
             <div className="absolute -bottom-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#cbf18a]/10 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
             
             {/* Panning Dotted Mesh */}
             <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%230f3d30\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Ccircle cx=\\'13\\' cy=\\'13\\' r=\\'3\\'/%3E%3C/g%3E%3C/svg%3E')"}}></div>
          </div>
          
          <div className="relative z-10 w-full max-w-2xl mt-4">
            <span className="inline-block py-1 px-3 rounded-full bg-white/80 backdrop-blur-md text-[#16a383] text-[10px] uppercase font-bold tracking-widest mb-6 border border-[#16a383]/20 shadow-sm">
              STUDENT DESKTOP
            </span>
            <h1 className="text-4xl lg:text-[52px] font-black tracking-tighter text-dark-900 leading-[1.05] mb-6">
              Own the <span className="text-[#16a383] relative inline-block">Campus<div className="absolute bottom-1.5 left-0 w-full h-3.5 bg-[#cbf18a]/80 -z-10 transform -skew-x-12"></div></span> <br />
              Experience.
            </h1>
            <p className="text-dark-600 text-[15px] leading-relaxed tracking-wide mb-12 max-w-[20rem] font-medium mt-6">
              Discover cutting-edge student clubs, attend high-profile events, and maximize your SLIIT journey all from one flawlessly clean hub.
            </p>
          </div>

          <div className="mt-auto relative z-10 flex justify-center items-end h-[14rem] w-full">
             {/* Elegant UI representation graphic */}
             <div className="relative w-[110%] h-full border border-primary-100/40 rounded-t-3xl bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group-hover:-translate-y-2 transition-transform duration-[800ms] ease-out">
                <div className="absolute top-4 left-4 right-4 h-12 bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-primary-50 flex flex-col justify-center px-4 gap-2.5">
                   <div className="w-1/3 h-1.5 bg-dark-200/50 rounded-full"></div>
                   <div className="w-1/4 h-1.5 bg-[#16a383]/20 rounded-full"></div>
                </div>
                <div className="absolute top-20 left-4 right-4 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent rounded-t-xl border-t border-x border-primary-50/50 flex gap-4 p-4 items-end">
                   <div className="w-[45%] h-24 bg-[#16a383]/5 rounded-t-lg border-t border-x border-[#16a383]/10"></div>
                   <div className="w-[55%] h-32 bg-[#cbf18a]/20 rounded-t-lg border-t border-x border-[#cbf18a]/30"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-12 md:py-8 lg:pr-16 animate-slide-right-slow">

          {/* Logo element */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="SLIIT Events Logo" className="h-14 sm:h-16 w-auto object-contain" />
            </Link>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-dark-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-[13px] text-dark-400 font-medium">Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email Input */}
            <div className="space-y-1">
              <input
                id="email"
                type="email"
                placeholder="Email address"
                className={`w-full bg-[#f8faf9] text-dark-900 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-medium placeholder:text-dark-400 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-transparent'}`}
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1 relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full bg-[#f8faf9] text-dark-900 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-medium placeholder:text-dark-400 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-transparent'}`}
                {...register('password')}
              />
              {/* Eye Icon Reveal */}
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-dark-400 hover:text-dark-600 transition-colors">
                {showPassword ? (
                  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-[11px] text-dark-400 hover:text-primary-600 font-medium transition-colors tracking-wide">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#fa862e] text-white hover:bg-[#e0701b] font-bold text-sm py-4 rounded-2xl transition-all shadow-[0_8px_20px_0_rgba(250,134,46,0.3)] hover:shadow-[0_12px_25px_rgba(250,134,46,0.4)] hover:-translate-y-0.5 flex justify-center items-center mt-4 group">
              {isLoading ? <Spinner size="sm" /> : <span className="tracking-wide">Login</span>}
            </button>
            <Link to="/register" className="w-full flex justify-center items-center bg-transparent border-2 border-[#f0f2f5] text-dark-600 hover:bg-[#f8faf9] hover:border-dark-100 font-bold text-sm py-3.5 rounded-2xl transition-all tracking-wide">
              Create an Account
            </Link>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
