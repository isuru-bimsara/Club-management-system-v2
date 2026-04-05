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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine((val) => {
      const email = val.toLowerCase();
      return email.endsWith('sliit.lk') || email.endsWith('my.sliit.lk');
    }, {
      message: 'Email must be a valid SLIIT address (ends with sliit.lk or my.sliit.lk)',
    }),
  studentId: z.string()
    .min(1, 'Student ID is required')
    .regex(/^[A-Za-z]{2}\d{8}$/, 'Student ID must be 2 letters followed by 8 numbers (e.g., IT23674912)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      const response = await authService.register(registerData);
      
      login(response.user || response, response.token);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4] p-4 sm:p-8 overflow-hidden">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.05)] flex flex-col md:flex-row overflow-hidden p-3 gap-8 relative z-10">
        
        {/* Left Registration Form (order-2 on mobile, order-1 on desktop) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-8 lg:pl-16 order-2 md:order-1 animate-slide-left-slow">
          
          <div className="flex justify-center mb-8">
             <Link to="/" className="flex items-center">
                <img src={logo} alt="SLIIT Events Logo" className="h-14 sm:h-16 w-auto object-contain" />
             </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-[13px] text-dark-400 font-medium">Join the ultimate campus experience</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Name Input */}
              <div className="space-y-1">
                <input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  className={`w-full bg-[#f8faf9] text-dark-900 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-medium placeholder:text-dark-400 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-transparent'}`}
                  {...register('name')}
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-2 font-medium">{errors.name.message}</p>}
              </div>

              {/* Student ID Input */}
              <div className="space-y-1">
                <input
                  id="studentId"
                  type="text"
                  placeholder="Student ID"
                  className={`w-full bg-[#f8faf9] text-dark-900 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-medium placeholder:text-dark-400 border ${errors.studentId ? 'border-red-300 bg-red-50' : 'border-transparent'}`}
                  {...register('studentId')}
                />
                {errors.studentId && <p className="text-red-500 text-[10px] mt-1 ml-2 font-medium">{errors.studentId.message}</p>}
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <input
                id="email"
                type="email"
                placeholder="Email address"
                className={`w-full bg-[#f8faf9] text-dark-900 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-medium placeholder:text-dark-400 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-transparent'}`}
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-2 font-medium">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Password Input */}
              <div className="space-y-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full bg-[#f8faf9] text-dark-900 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-medium placeholder:text-dark-400 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-transparent'}`}
                  {...register('password')}
                />
                {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-2 font-medium">{errors.password.message}</p>}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1 relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={`w-full bg-[#f8faf9] text-dark-900 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-medium placeholder:text-dark-400 border ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-transparent'}`}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-2 font-medium">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            
            <div className="flex justify-end pt-1">
               <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[11px] text-dark-400 hover:text-primary-600 font-medium transition-colors tracking-wide">
                 {showPassword ? "Hide Passwords" : "Show Passwords"}
               </button>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#fa862e] text-white hover:bg-[#e0701b] font-bold text-sm py-4 rounded-2xl transition-all shadow-[0_8px_20px_0_rgba(250,134,46,0.3)] hover:shadow-[0_12px_25px_rgba(250,134,46,0.4)] hover:-translate-y-0.5 flex justify-center items-center group">
              {isLoading ? <Spinner size="sm" /> : <span className="tracking-wide">Register Account</span>}
            </button>
            <Link to="/login" className="w-full flex justify-center items-center bg-transparent border-2 border-[#f0f2f5] text-dark-600 hover:bg-[#f8faf9] hover:border-dark-100 font-bold text-sm py-3.5 rounded-2xl transition-all tracking-wide">
               Sign In Instead
            </Link>
          </form>

        </div>

        {/* Right Bounding Box (Hero Graphics matching Dashboard UI - Sider mirrored) order-1 on mobile, order-2 on desktop */}
        <div className="hidden md:flex flex-col w-1/2 bg-white rounded-[2rem] p-12 relative overflow-hidden border border-primary-100 shadow-[inset_0_2px_20px_rgb(0,0,0,0.02)] order-1 md:order-2 animate-slide-right-slow group">

          {/* Background identical to Home UI */}
          <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#ffffff] via-primary-50/20 to-[#f4f7f4]">
             {/* Abstract blobs */}
             <div className="absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#16a383]/5 blur-3xl group-hover:bg-[#16a383]/10 transition-colors duration-700"></div>
             <div className="absolute -top-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#cbf18a]/10 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
             
             {/* Panning Dotted Mesh */}
             <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%230f3d30\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Ccircle cx=\\'13\\' cy=\\'13\\' r=\\'3\\'/%3E%3C/g%3E%3C/svg%3E')"}}></div>
          </div>
          
          <div className="relative z-10 w-full max-w-2xl mt-4 text-right ml-auto">
            <div className="flex justify-end">
               <span className="inline-block py-1 px-3 rounded-full bg-white/80 backdrop-blur-md text-[#16a383] text-[10px] uppercase font-bold tracking-widest mb-6 border border-[#16a383]/20 shadow-sm">
                 STUDENT DESKTOP
               </span>
            </div>
            <h1 className="text-4xl lg:text-[52px] font-black tracking-tighter text-dark-900 leading-[1.05] mb-6">
              Own the <span className="text-[#16a383] relative inline-block">Campus<div className="absolute bottom-1.5 left-0 w-full h-3.5 bg-[#cbf18a]/80 -z-10 transform -skew-x-12"></div></span> <br />
              Experience.
            </h1>
            <div className="flex justify-end">
               <p className="text-dark-600 text-[15px] leading-relaxed tracking-wide mb-12 max-w-[20rem] font-medium mt-6">
                 Discover cutting-edge student clubs, attend high-profile events, and maximize your SLIIT journey all from one flawlessly clean hub.
               </p>
            </div>
          </div>

          <div className="mt-auto relative z-10 flex justify-center items-end h-[14rem] w-full">
             {/* Elegant UI representation graphic */}
             <div className="relative w-[110%] h-full border border-primary-100/40 rounded-t-3xl bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group-hover:-translate-y-2 transition-transform duration-[800ms] ease-out flex gap-4 p-4 pb-0 items-end justify-end">
                <div className="absolute top-4 left-4 right-4 h-12 bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-primary-50 flex flex-col justify-center px-4 gap-2.5 items-end">
                   <div className="w-1/3 h-1.5 bg-dark-200/50 rounded-full"></div>
                   <div className="w-1/4 h-1.5 bg-[#16a383]/20 rounded-full"></div>
                </div>
                <div className="w-[55%] h-24 bg-[#cbf18a]/20 rounded-t-lg border-t border-x border-[#cbf18a]/30"></div>
                <div className="w-[45%] h-32 bg-[#16a383]/5 rounded-t-lg border-t border-x border-[#16a383]/10"></div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
