import { useState } from 'react';
import {
  Camera, Sparkles, Copy, Check, Sliders, Shirt, Layers, Info, ShieldCheck, Box
} from 'lucide-react';

export function AdminAiStudioTab() {
  const [selectedCategory, setSelectedCategory] = useState<'thobe' | 'bisht' | 'shemagh' | 'perfume' | 'accessory'>('thobe');
  const [productColor, setProductColor] = useState('Pure pearl white (أبيض لؤلؤي ناصع)');
  const [fabricDetail, setFabricDetail] = useState('Japanese Toyobo cotton with discrete golden collar embroidery');
  const [displayStyle, setDisplayStyle] = useState<'ghost-mannequin' | 'luxury-hanger' | 'folded-flatlay' | 'macro-texture'>('ghost-mannequin');
  const [sceneEnvironment, setSceneEnvironment] = useState<'dark-espresso' | 'travertine-pedestal' | 'atelier-minimalist' | 'slate-dramatic'>('dark-espresso');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Build 100% Non-Animate Luxury Product-Only Prompt
  const buildPrompt = () => {
    let subjectDescription = '';
    let presentationStyle = '';
    let environment = '';

    // 1. Subject Description (Garment & Material fidelity)
    if (selectedCategory === 'thobe') {
      subjectDescription = `authentic luxury Arabian tailored thobe in exact color "${productColor}", crafted from ${fabricDetail}. Crisp stand-up collar, perfectly ironed seams, authentic button placket. Garment shape, fabric weave, and stitching strictly preserved without color shift`;
    } else if (selectedCategory === 'bisht') {
      subjectDescription = `authentic ceremonial royal Arabian bisht cloak in exact color "${productColor}", featuring authentic 24K real gold zaree embroidery along neckline, chest borders, and sleeve trim. Meticulous gold thread luster, exact fabric tone preservation`;
    } else if (selectedCategory === 'shemagh') {
      subjectDescription = `ceremonial luxury woven Arabian shemagh in exact color "${productColor}", crafted with ${fabricDetail}. Pristine symmetrical square folds, crisp geometric jacquard weave texture, sharp fringed borders`;
    } else if (selectedCategory === 'perfume') {
      subjectDescription = `heavy faceted crystal luxury Oud perfume bottle filled with aged amber oil in exact color "${productColor}", ${fabricDetail}, heavy brushed brass gold cap, subtle reflections`;
    } else {
      subjectDescription = `handcrafted luxury heritage accessory in exact color "${productColor}", ${fabricDetail}, immaculate polish and natural stone luster`;
    }

    // 2. Presentation Style (100% No Human Models / No Animate Beings)
    if (displayStyle === 'ghost-mannequin') {
      presentationStyle = 'Commercial 3D ghost mannequin presentation, invisible mannequin stand, full three-dimensional volumetric silhouette of the garment standing upright with natural tailored gravity, perfectly symmetrical lookbook display, no human model, no person, no body parts, no head';
    } else if (displayStyle === 'luxury-hanger') {
      presentationStyle = 'Garment hanging elegantly on a handcrafted dark walnut and brass luxury tailor coat-hanger against a wall, natural vertical fabric drape, clean side-profile, no human model, no person';
    } else if (displayStyle === 'folded-flatlay') {
      presentationStyle = 'High-end editorial folded flat-lay display, garment precisely folded in sharp ceremonial rectangular presentation on an architectural stone surface, 45-degree top angle lookbook photography, product only, no humans';
    } else {
      presentationStyle = 'Extreme close-up macro fashion photography of the garment collar, chest embroidery, button details, and fabric weave texture, razor-sharp shallow depth of field, product only';
    }

    // 3. Background & Lighting (Maison Manie Dark Luxury Theme)
    if (sceneEnvironment === 'dark-espresso') {
      environment = 'set in a luxury dark espresso and charcoal studio background (#18130f), subtle warm golden rim lighting, soft champagne backlighting, cinematic directional shadows, minimalist textured stucco wall';
    } else if (sceneEnvironment === 'travertine-pedestal') {
      environment = 'resting on a minimalist textured warm raw travertine stone pedestal, muted dark clay studio background, soft warm directional side-lighting, elegant editorial atmosphere';
    } else if (sceneEnvironment === 'atelier-minimalist') {
      environment = 'inside a minimalist luxury bespoke tailoring atelier with dark fluted wood paneling, discreet warm overhead spotlight, clean architectural shadows';
    } else {
      environment = 'on polished dark volcanic slate stone, dramatic low-angle ambient golden fill light, subtle luxury reflections, pristine catalog presentation';
    }

    const techSpecs = 'Shot on Hasselblad H6D-100c, 85mm f/2.8 lens, ISO 64, commercial catalog e-commerce lookbook, 8k resolution, photorealistic, strict color accuracy --style raw --v 6.1 --ar 3:4 --c 0 --iw 2.0';

    return `Commercial product photography of ${presentationStyle}: ${subjectDescription}, ${environment}, ${techSpecs}`;
  };

  const negativePrompt = 'human, person, model, man, woman, face, eyes, skin, hands, arms, head, body, mannequin face, animate beings, distorted fabric, changed color, faded colors, altered embroidery, cartoon, 3d render, illustration, text, watermark, logo, low quality, oversaturated.';

  const gptInstructionPrompt = `You are a professional luxury fashion product photographer.
Task: Place the uploaded product image in a luxury commercial studio lookbook.

STRICT REQUIREMENTS:
1. NO HUMAN MODELS, NO PEOPLE, NO FACES, NO BODY PARTS (Product-only photography).
2. Presentation: Use a clean 3D Ghost Mannequin standing silhouette OR an elegant wooden hanger / folded flat-lay.
3. Color & Texture: Preserve the exact color ("${productColor}"), weave, and embroidery of the garment 100% without any modification or color shift.
4. Background: Dark luxury espresso & charcoal studio (#18130f) with subtle warm golden rim lighting.
5. Output: Photorealistic, 8K commercial product catalog quality.`;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-espresso-light/80 border border-terracotta/20 p-5 rounded-3xl shadow-lg flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-xl font-bold text-ivory">استوديو تصوير المنتجات بالذكاء الاصطناعي (Product-Only Studio)</h2>
          </div>
          <p className="text-xs text-ivory/50 mt-1">
            قوالب وبرومبتات مخصصة لتصوير الملابس والقطع بأعلى جودة استوديو فاخرة <strong>بدون أشخاص أو موديلز (خالية تماماً من ذوات الأرواح)</strong> مع تثبيت ألوان وخامات المنتجات.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/15 border border-terracotta/30 rounded-xl text-terracotta text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>No Humans • Pure Product Focus</span>
        </div>
      </div>

      {/* Control Studio Grid */}
      <div className="grid lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2 Cols: Controls & Live Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Category Selector */}
          <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-ivory/10">
              <Shirt className="w-4 h-4 text-terracotta" />
              <h3 className="font-serif text-sm font-bold text-ivory">1. نوع القطعة واللون الأصلي (Product & Exact Color)</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'thobe', label: 'ثوب / جلابية ملكية', labelEn: 'Thobe & Gandoura' },
                { id: 'bisht', label: 'بشت ملكي / مشلح', labelEn: 'Royal Bisht & Cape' },
                { id: 'shemagh', label: 'شماغ / شال كشميري', labelEn: 'Shemagh & Kashmiri' },
                { id: 'perfume', label: 'عطور ودهن عود', labelEn: 'Oud & Fragrance' },
                { id: 'accessory', label: 'سبحة / خواتم / كبك', labelEn: 'Gems & Tasbih' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-terracotta text-espresso border-terracotta font-bold shadow-md'
                      : 'bg-espresso border-ivory/10 text-ivory/80 hover:border-terracotta/40'
                  }`}
                >
                  <div className="font-bold">{cat.label}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedCategory === cat.id ? 'text-espresso/80' : 'text-ivory/40'}`}>
                    {cat.labelEn}
                  </div>
                </button>
              ))}
            </div>

            {/* Inputs: Product Color & Details */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-ivory/70 font-semibold mb-1">
                  لون القماش الأصلي بدقة (Exact Color):
                </label>
                <input
                  type="text"
                  value={productColor}
                  onChange={(e) => setProductColor(e.target.value)}
                  placeholder="مثال: Pure pearl white أو Midnight Navy"
                  className="w-full px-3.5 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                />
              </div>
              <div>
                <label className="block text-ivory/70 font-semibold mb-1">
                  خامة وتطريز القماش (Fabric & Details):
                </label>
                <input
                  type="text"
                  value={fabricDetail}
                  onChange={(e) => setFabricDetail(e.target.value)}
                  placeholder="مثال: Japanese Toyobo Cotton with Gold Zaree"
                  className="w-full px-3.5 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Product Display Style & Background */}
          <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-ivory/10">
              <Box className="w-4 h-4 text-terracotta" />
              <h3 className="font-serif text-sm font-bold text-ivory">2. طريقة عرض القطعة والخلفية (Display Style & Scene)</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Product Presentation Style */}
              <div>
                <label className="block text-ivory/70 font-semibold mb-1.5">طريقة عرض القطعة (بدون أشخاص):</label>
                <select
                  value={displayStyle}
                  onChange={(e) => setDisplayStyle(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                >
                  <option value="ghost-mannequin">مجسم شبحي ثلاثي الأبعاد واقف (3D Ghost Mannequin)</option>
                  <option value="luxury-hanger">معلق على شماعة خشب جوز فاخرة (Walnut Hanger)</option>
                  <option value="folded-flatlay">مطوي بأناقة ملكية على حجر (Folded Luxury Flat-Lay)</option>
                  <option value="macro-texture">لقطة مقربة جداً لتفاصيل القماش والتطريز (Macro Fabric)</option>
                </select>
              </div>

              {/* Background Theme */}
              <div>
                <label className="block text-ivory/70 font-semibold mb-1.5">ثيم وإضاءة الخلفية:</label>
                <select
                  value={sceneEnvironment}
                  onChange={(e) => setSceneEnvironment(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                >
                  <option value="dark-espresso">استوديو أسود وإضاءة ذهبية محيطية (Dark Espresso & Gold Rim)</option>
                  <option value="travertine-pedestal">حجر ترافيرتين دافئ (Warm Travertine Stone)</option>
                  <option value="atelier-minimalist">أتيليه خياطة فاخر بجدران خشبية داكنة (Bespoke Atelier)</option>
                  <option value="slate-dramatic">حجر بركاني أسود درامي (Dark Slate Stone)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generated Prompts Box */}
          <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-ivory/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta" />
                <h3 className="font-serif text-sm font-bold text-ivory">البرومبت الجاهز للنسخ (Midjourney v6 & Flux & SDXL)</h3>
              </div>
              <button
                onClick={() => copyToClipboard(buildPrompt(), 'mj')}
                className="px-3.5 py-1.5 bg-terracotta text-espresso font-bold rounded-xl flex items-center gap-1.5 text-xs hover:bg-terracotta-light transition-all cursor-pointer"
              >
                {copiedKey === 'mj' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'mj' ? 'تم النسخ بنجاح!' : 'نسخ البرومبت'}</span>
              </button>
            </div>

            <div className="p-4 bg-espresso rounded-2xl border border-ivory/10 font-mono text-[11px] text-ivory/90 leading-relaxed break-words" dir="ltr">
              {buildPrompt()}
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-ivory/60 font-semibold text-[11px]">
                <span>البرومبت السلبي لمنع ظهور أي أشخاص أو تشويه ألوان (Negative Prompt):</span>
                <button
                  onClick={() => copyToClipboard(negativePrompt, 'neg')}
                  className="text-terracotta hover:underline cursor-pointer flex items-center gap-1"
                >
                  {copiedKey === 'neg' ? 'تم النسخ' : 'نسخ'}
                </button>
              </div>
              <div className="p-3 bg-espresso/60 rounded-xl border border-ivory/5 font-mono text-[10px] text-ivory/60" dir="ltr">
                {negativePrompt}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Practical Workflow & Instructions */}
        <div className="space-y-6">
          {/* ChatGPT / Vision AI instruction box */}
          <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-ivory/10">
              <h3 className="font-serif text-sm font-bold text-ivory">أمر التعديل المباشر لـ ChatGPT-4o Vision</h3>
              <button
                onClick={() => copyToClipboard(gptInstructionPrompt, 'gpt')}
                className="text-terracotta hover:underline cursor-pointer text-xs flex items-center gap-1"
              >
                {copiedKey === 'gpt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ</span>
              </button>
            </div>
            <p className="text-[11px] text-ivory/50">
              ارفع صورة منتجك الحالية إلى ChatGPT واكتب هذا الأمر لوضع المنتج في بيئة استوديو فخمة بدون بشر:
            </p>
            <div className="p-3.5 bg-espresso rounded-2xl border border-ivory/10 font-mono text-[10px] text-ivory/80 leading-relaxed" dir="ltr">
              {gptInstructionPrompt}
            </div>
          </div>

          {/* Golden Rules for zero color shifting & no humans */}
          <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-ivory/10">
              <Info className="w-4 h-4 text-terracotta" />
              <h3 className="font-serif text-sm font-bold text-ivory">أفضل الطرق لعرض الملابس الفاخرة</h3>
            </div>
            <ul className="space-y-2.5 text-[11px] text-ivory/70 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-terracotta font-bold">•</span>
                <span><strong>مانيكان شبحي (Ghost Mannequin):</strong> الأسلوب المعتمد لدى أكبر بيوت الأزياء العالمية (Brioni / Tom Ford) لعرض الثوب بهيئته الكاملة بدون أي وجوه أو أشخاص.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta font-bold">•</span>
                <span><strong>تنسيق الشماعة الملكية (Tailor Hanger):</strong> إبراز انسيابية القماش وتفصيل الياقة والأكمام بشكل طبيعي وراقي.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta font-bold">•</span>
                <span><strong>تثبيت الألوان بالـ Image Weight:</strong> ضع دائمًا <code className="text-terracotta font-mono">--iw 2.0</code> ليلتزم الذكاء الاصطناعي بلون وتطريز صورتك الأصلية.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
