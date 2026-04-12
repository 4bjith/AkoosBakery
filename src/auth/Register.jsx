import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Croissant, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAuthStore from '@/store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const result = await register(form);
    if (result.success) {
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#fdfbf9] via-[#f5ebe2] to-[#fdfbf9]">
      {/* Decorative blobs */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-[#c79261]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-20 w-72 h-72 bg-[#c79261]/5 rounded-full blur-3xl" />

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
            <CardTitle className="text-2xl font-bold text-[#2c2a29]">Create Account</CardTitle>
            <CardDescription className="text-[#6b615a]">
              Join our bakery community today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-[#2c2a29]">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] focus:ring-[#c79261]/20 bg-white"
                  />
                </div>
              </div>

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

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-[#2c2a29]">
                  Phone Number <span className="text-[#6b615a] text-xs font-normal">(optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] focus:ring-[#c79261]/20 bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#2c2a29]">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#2c2a29]">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-11 border-[#f0e9e1] focus:border-[#c79261] focus:ring-[#c79261]/20 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b615a] hover:text-[#2c2a29] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#c79261] hover:bg-[#b58150] text-white font-medium shadow-lg shadow-[#c79261]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[#c79261]/30 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Account
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
                <span className="bg-white px-3 text-[#6b615a]">Already have an account?</span>
              </div>
            </div>

            {/* Login link */}
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full h-11 border-[#f0e9e1] text-[#2c2a29] hover:bg-[#f5ebe2] hover:border-[#c79261]/30 font-medium transition-all cursor-pointer"
              >
                Sign In Instead
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#6b615a] mt-6">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-[#c79261] hover:underline">Terms</a>
          {' & '}
          <a href="#" className="text-[#c79261] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
