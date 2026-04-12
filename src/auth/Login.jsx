import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Croissant, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAuthStore from '@/store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      toast.success('Welcome back! 🍰');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#fdfbf9] via-[#f5ebe2] to-[#fdfbf9]">
      {/* Decorative background circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#c79261]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c79261]/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#c79261] rounded-2xl flex items-center justify-center shadow-lg shadow-[#c79261]/25">
            <Croissant className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2c2a29] leading-tight">Akoos Bakery</h1>
            <p className="text-xs text-[#6b615a]">Artisan Bakery</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl shadow-black/5 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-[#2c2a29]">Welcome Back</CardTitle>
            <CardDescription className="text-[#6b615a]">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#2c2a29]">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] focus:ring-[#c79261]/20 bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-[#2c2a29]">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#c79261] hover:text-[#b58150] font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-11 border-[#f0e9e1] focus:border-[#c79261] focus:ring-[#c79261]/20 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b615a] hover:text-[#2c2a29] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#c79261] hover:bg-[#b58150] text-white font-medium shadow-lg shadow-[#c79261]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[#c79261]/30 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#f0e9e1]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#6b615a]">New to Akoos Bakery?</span>
              </div>
            </div>

            {/* Register link */}
            <Link to="/register">
              <Button
                variant="outline"
                className="w-full h-11 border-[#f0e9e1] text-[#2c2a29] hover:bg-[#f5ebe2] hover:border-[#c79261]/30 font-medium transition-all cursor-pointer"
              >
                Create an Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#6b615a] mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-[#c79261] hover:underline">Terms</a>
          {' & '}
          <a href="#" className="text-[#c79261] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
