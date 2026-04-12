import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Croissant, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Placeholder — backend forgot-password endpoint not yet implemented
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsLoading(false);
    toast.success('If an account exists, a reset link has been sent.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#fdfbf9] via-[#f5ebe2] to-[#fdfbf9]">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#c79261]/10 rounded-full blur-3xl" />

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
            <CardTitle className="text-2xl font-bold text-[#2c2a29]">
              {isSubmitted ? 'Check Your Email' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-[#6b615a]">
              {isSubmitted
                ? `We've sent a reset link to ${email}`
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-[#2c2a29]">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] focus:ring-[#c79261]/20 bg-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#c79261] hover:bg-[#b58150] text-white font-medium shadow-lg shadow-[#c79261]/25 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-[#c79261]/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-[#c79261]" />
                </div>
                <p className="text-sm text-[#6b615a]">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#c79261] hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
            )}

            {/* Back to login */}
            <div className="mt-6">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full h-11 border-[#f0e9e1] text-[#2c2a29] hover:bg-[#f5ebe2] hover:border-[#c79261]/30 font-medium transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
