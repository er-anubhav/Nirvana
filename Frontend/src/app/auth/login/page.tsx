'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { debugService } from '@/lib/debug';
import { SupabaseConnectionDebug } from '@/components/debug/SupabaseConnectionDebug';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{phone?: string; password?: string; general?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const router = useRouter();

  const handleDebug = async () => {
    try {
      const { users, error } = await debugService.listUsers();
      if (error) {
        setDebugInfo(`Error: ${error}`);
      } else if (users) {
        const userInfo = users.map(u => 
          `${u.name}: ${u.phone_number || u.phone} (${u.role})`
        ).join('\n');
        setDebugInfo(`Available users:\n${userInfo}`);
        console.log('Available users:', users);
      }
    } catch (err) {
      setDebugInfo(`Debug error: ${err}`);
    }
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Basic validation
    const newErrors: {phone?: string; password?: string; general?: string} = {};
    
    if (!phoneNumber) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phoneNumber)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user, error } = await authService.login(phoneNumber, password);
      
      if (error) {
        setErrors({ general: error });
      } else if (user) {
        // Successful login - redirect to dashboard
        router.push('/citizen/dashboard');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full rounded-full -top-1/2 -right-1/2 bg-purple-500/5 blur-3xl" />
        <div className="absolute w-full h-full rounded-full -bottom-1/2 -left-1/2 bg-purple-600/5 blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and branding */}
        <div className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2 font-serif text-4xl text-white"
          >
            Nirvana
          </motion.h1>
          <p className="text-lg text-purple-300/70">
            AI-powered E-Governance Complaint Management
          </p>
        </div>

        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
        >
          <h2 className="mb-6 font-serif text-2xl text-center text-white">
            Citizen Login
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Input */}
            <div>
              <label className="block mb-2 text-sm text-purple-300">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute w-5 h-5 text-purple-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full pl-12 pr-4 py-3 bg-purple-950/20 border rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.phone ? 'border-red-500' : 'border-purple-500/30'
                  }`}
                  maxLength={10}
                />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-400"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block mb-2 text-sm text-purple-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-purple-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 bg-purple-950/20 border rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-purple-500/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-purple-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-purple-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-center text-red-400 border rounded-lg border-red-500/30 bg-red-500/10"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Password Hint */}
            <div className="text-sm text-center text-purple-300/60">
              <p>Use password: <span className="font-mono text-purple-400">root</span></p>
            </div>

            {/* Debug Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleDebug}
                className="flex items-center justify-center px-3 py-2 mx-auto text-xs text-purple-400 transition-colors border rounded-lg border-purple-500/30 hover:text-purple-300 hover:border-purple-500/50"
              >
                <Database className="w-4 h-4 mr-2" />
                Show Available Users
              </button>
            </div>

            {/* Debug Info */}
            {debugInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-xs text-center text-purple-300 whitespace-pre-line border rounded-lg border-purple-500/30 bg-purple-500/10"
              >
                {debugInfo}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 text-white transition-all bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 mr-2 border-2 rounded-full border-white/20 border-t-white animate-spin" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Additional options */}
          <div className="mt-6 space-y-3 text-center">
            <button className="text-sm text-purple-400 transition-colors hover:text-purple-300">
              Forgot Password?
            </button>
            <div className="text-sm text-purple-300/50">
              Don't have an account?{' '}
              <button className="text-purple-400 transition-colors hover:text-purple-300">
                Register here
              </button>
            </div>
            <div className="text-sm text-purple-300/50">
              <button 
                onClick={() => router.push('/public')}
                className="text-purple-400 transition-colors hover:text-purple-300"
              >
                View Public Dashboard →
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Debug Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)]"
      >
      </motion.div>
    </div>
  );
}
