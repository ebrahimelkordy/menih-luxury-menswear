import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Sparkles, Send, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getSiteSettings, type SiteSettings, defaultSiteSettings } from '@/services/adminService';
import { useRouter } from '@/router';

export function ContactPage() {
  const { lang } = useApp();
  const { navigate } = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('????? ??? ???? ????');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const whatsappClean = (settings.contactWhatsapp || '+20 100 000 0000').replace(/\D/g, '');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*??? ????? ???????? ?? ???? ????:*%0A%0A*?????:* ${encodeURIComponent(name)}%0A*??????:* ${encodeURIComponent(phone)}%0A*???????:* ${encodeURIComponent(subject)}%0A*???????:* ${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${whatsappClean}?text=${text}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-ivory text-espresso">
      {/* Header Banner */}
      <section className="relative bg-espresso text-ivory py-16 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(178,122,104,0.3), transparent 50%), radial-gradient(circle at 80% 30%, rgba(106,107,82,0.2), transparent 50%)',
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory/10 text-rose-dust text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '???? ????????? ???????? ??????' : 'Imperial Concierge & Bespoke Service'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory text-balance leading-tight">
            {lang === 'ar' ? '????? ?? ??????? ????' : 'Connect with Ezar Concierge'}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-ivory/70 max-w-xl mx-auto leading-relaxed font-light">
            {lang === 'ar'
              ? '?????? ??????? ??????????? ???? ???????? ??????? ????? ?????? ???????? ??????? ???????? ?????? ??????? ???????.'
              : 'Our master tailors and concierge team are at your service for bespoke thobe tailoring, ceremonial bishts, and luxury gifting.'}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left / Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-sand/50 rounded-3xl p-6 sm:p-8 border border-cream space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-espresso mb-2">
                  {lang === 'ar' ? '????? ??????? ????????' : 'Direct Channels'}
                </h2>
                <p className="text-xs text-espresso/60 leading-relaxed">
                  {lang === 'ar'
                    ? '???? ???? ??????? ?????? ????????? ??????? ??????? ??? ?????? ?????????.'
                    : 'Our concierge team is available to assist your inquiries with royal dedication.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* WhatsApp Direct */}
                <a
                  href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('?????? ????? ??? ????????? ?? ????? ??? ?? ???.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-cream/80 hover:border-emerald-500/50 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-espresso/50 font-medium">{lang === 'ar' ? '?????? ?????? ?????' : 'Instant WhatsApp Concierge'}</div>
                    <div className="text-sm font-bold text-espresso font-mono mt-0.5" dir="ltr">{settings.contactWhatsapp}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                    {lang === 'ar' ? '???? ????' : 'Live'}
                  </span>
                </a>

                {/* Direct Phone */}
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-cream/80 hover:border-terracotta/50 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-espresso/50 font-medium">{lang === 'ar' ? '??????? ??????? ???????' : 'Direct Telephone Call'}</div>
                    <div className="text-sm font-bold text-espresso font-mono mt-0.5" dir="ltr">{settings.contactPhone}</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-cream/80 hover:border-terracotta/50 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-espresso/10 text-espresso flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-espresso/50 font-medium">{lang === 'ar' ? '?????? ?????????? ?????' : 'Official Correspondence'}</div>
                    <div className="text-sm font-bold text-espresso font-mono mt-0.5 truncate" dir="ltr">{settings.contactEmail}</div>
                  </div>
                </a>
              </div>

              {/* Working Hours & Address */}
              <div className="pt-4 border-t border-cream/80 space-y-3 text-xs text-espresso/70">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-espresso block">{lang === 'ar' ? '????? ????? ???????:' : 'Working Hours:'}</span>
                    <span>{lang === 'ar' ? '?????? ?? ??:?? ?????? ??? ??:?? ?????' : 'Daily from 10:00 AM to 11:00 PM'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-espresso block">{lang === 'ar' ? '????? ???????:' : 'Showroom & Headquarters:'}</span>
                    <span>{lang === 'ar' ? (settings.addressAr || settings.address) : settings.address}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right / Interactive Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream shadow-sm space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-espresso">
                  {lang === 'ar' ? '???? ???????? ??????' : 'Send an Inquiry'}
                </h3>
                <p className="text-xs text-espresso/60 mt-1">
                  {lang === 'ar'
                    ? '???? ???????? ????? ????? ???? ?????? ??? ????? ??????? ????? ???????.'
                    : 'Fill in the form to connect directly with our bespoke customer liaison.'}
                </p>
              </div>

              <form onSubmit={handleSendWhatsApp} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-espresso font-bold mb-1.5">
                      {lang === 'ar' ? '????? ??????' : 'Your Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'ar' ? '????: ??? ?????? ????' : 'e.g. Abdulaziz Mohamed'}
                      className="w-full px-4 py-3 bg-sand/30 border border-cream rounded-xl text-espresso text-sm placeholder:text-espresso/30 outline-none focus:border-terracotta transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-espresso font-bold mb-1.5">
                      {lang === 'ar' ? '??? ?????? / ????????' : 'Phone / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+20 1..."
                      className="w-full px-4 py-3 bg-sand/30 border border-cream rounded-xl text-espresso text-sm placeholder:text-espresso/30 outline-none focus:border-terracotta transition-colors"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-espresso font-bold mb-1.5">
                    {lang === 'ar' ? '????? ?????????' : 'Inquiry Subject'}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-sand/30 border border-cream rounded-xl text-espresso text-sm outline-none focus:border-terracotta transition-colors cursor-pointer"
                  >
                    <option value="????? ??? ???? ????">{lang === 'ar' ? '????? ??? ?? ??? ????' : 'Bespoke Thobe / Bisht Tailoring'}</option>
                    <option value="??????? ?? ???????? ????????">{lang === 'ar' ? '??????? ?? ???????? ????????' : 'Fabric & Sizing Advice'}</option>
                    <option value="?????? ??? ?? ????">{lang === 'ar' ? '?????? ??? ??? ????' : 'Track Existing Order'}</option>
                    <option value="??? ????? ???????? ????">{lang === 'ar' ? '????? ????? ???????? ??????' : 'Imperial Gifting & Ceremonies'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-espresso font-bold mb-1.5">
                    {lang === 'ar' ? '?????? ??????? ?? ?????' : 'Message Details'} *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === 'ar' ? '???? ?????? ???? ?? ???????? ???...' : 'Write the details of your inquiry here...'}
                    className="w-full px-4 py-3 bg-sand/30 border border-cream rounded-xl text-espresso text-sm placeholder:text-espresso/30 outline-none focus:border-terracotta transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-espresso text-ivory font-bold text-sm rounded-2xl hover:bg-espresso-light transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-98"
                  >
                    {submitted ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'ar' ? '???? ??? ????????...' : 'Opening WhatsApp...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-terracotta" />
                        <span>{lang === 'ar' ? '????? ??????? ??? ???????? ?????' : 'Send via Instant WhatsApp'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso/40 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
                  <span>{lang === 'ar' ? '?????? ????? ???? ????? ?????? ?????????? ???????' : 'Complete privacy and confidentiality for all inquiries'}</span>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

