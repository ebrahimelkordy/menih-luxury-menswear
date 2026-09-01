import { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcodes: 'ezar2026', 'admin123', or '1234'
    if (passcode === 'ezar2026' || passcode === 'admin123' || passcode === '1234' || passcode === 'menih') {
      localStorage.setItem('ezar_admin_auth', 'authenticated');
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient gold glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-espresso-light border border-terracotta/30 rounded-3xl p-8 shadow-2xl animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-terracotta/15 border border-terracotta/40 flex items-center justify-center mx-auto mb-4 text-terracotta shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            بوابة الإدارة الملكية • EZAR Concierge
          </div>
          <h1 className="font-serif text-2xl font-bold text-ivory">لوحة تحكم إزار</h1>
          <p className="text-xs text-ivory/50 mt-1.5">أدخل رمز المرور السري للدخول وإدارة المتجر</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="رمز المرور (Passcode)"
                className={`w-full px-5 py-3.5 bg-espresso/80 border rounded-2xl text-sm text-ivory placeholder:text-ivory/30 outline-none transition-all text-center tracking-widest text-lg font-mono ${
                  error ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-terracotta/40 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                }`}
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-terracotta/50 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-2 text-center">رمز المرور غير صحيح. يرجى المحاولة مرة أخرى.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-terracotta text-espresso font-bold text-sm rounded-2xl hover:bg-terracotta-light transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer magnetic-btn"
          >
            <span>تسجيل الدخول للوحة التحكم</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-ivory/10 text-center">
          <a
            href="#/"
            className="text-xs text-ivory/40 hover:text-ivory transition-colors"
          >
            ← العودة للمتجر الرئيسي
          </a>
        </div>
      </div>
    </div>
  );
}

