import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  Phone,
  Beaker,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

interface AnalysisResult {
  name: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "danger";
  interpretation: string;
  advice: string;
}

interface ReferenceRange {
  male: { min: number; max: number };
  female: { min: number; max: number };
  dangerLow?: number;
  dangerHigh?: number;
}

const referenceRanges: Record<string, ReferenceRange> = {
  creatinine: {
    male: { min: 0.7, max: 1.3 },
    female: { min: 0.6, max: 1.1 },
    dangerHigh: 4.0,
  },
  urea: {
    male: { min: 7, max: 20 },
    female: { min: 7, max: 20 },
    dangerHigh: 100,
  },
  potassium: {
    male: { min: 3.5, max: 5.0 },
    female: { min: 3.5, max: 5.0 },
    dangerLow: 2.5,
    dangerHigh: 6.5,
  },
  sodium: {
    male: { min: 136, max: 145 },
    female: { min: 136, max: 145 },
    dangerLow: 120,
    dangerHigh: 160,
  },
  phosphorus: {
    male: { min: 2.5, max: 4.5 },
    female: { min: 2.5, max: 4.5 },
    dangerHigh: 7.0,
  },
  calcium: {
    male: { min: 8.5, max: 10.5 },
    female: { min: 8.5, max: 10.5 },
    dangerLow: 7.0,
    dangerHigh: 12.0,
  },
};

const interpretations: Record<string, { high: string; low: string; normal: string }> = {
  creatinine: {
    high: "ارتفاع الكرياتينين قد يشير إلى ضعف في وظائف الكُلى. يُنصح بمتابعة الطبيب فوراً.",
    low: "انخفاض الكرياتينين عادة لا يمثل مشكلة صحية كبيرة.",
    normal: "مستوى الكرياتينين طبيعي، مما يشير إلى وظائف كُلى سليمة.",
  },
  urea: {
    high: "ارتفاع اليوريا قد يدل على مشاكل في الكُلى أو الجفاف أو زيادة البروتين في الغذاء.",
    low: "انخفاض اليوريا قد يكون بسبب سوء التغذية أو مشاكل في الكبد.",
    normal: "مستوى اليوريا طبيعي، مما يشير إلى توازن جيد في وظائف الكُلى.",
  },
  potassium: {
    high: "ارتفاع البوتاسيوم خطير وقد يؤثر على القلب. يجب مراجعة الطبيب فوراً!",
    low: "انخفاض البوتاسيوم قد يسبب ضعف العضلات واضطرابات في نبض القلب.",
    normal: "مستوى البوتاسيوم طبيعي، مما يدعم صحة العضلات والقلب.",
  },
  sodium: {
    high: "ارتفاع الصوديوم قد يسبب الجفاف وارتفاع ضغط الدم.",
    low: "انخفاض الصوديوم قد يسبب الإرهاق والصداع وتشنجات العضلات.",
    normal: "مستوى الصوديوم طبيعي، مما يحافظ على توازن السوائل في الجسم.",
  },
  phosphorus: {
    high: "ارتفاع الفوسفور قد يشير إلى مشاكل في الكُلى ويؤثر على صحة العظام.",
    low: "انخفاض الفوسفور قد يسبب ضعف العظام والعضلات.",
    normal: "مستوى الفوسفور طبيعي، مما يدعم صحة العظام والأسنان.",
  },
  calcium: {
    high: "ارتفاع الكالسيوم قد يسبب حصوات الكُلى وضعف العظام.",
    low: "انخفاض الكالسيوم قد يسبب تشنجات عضلية وضعف العظام.",
    normal: "مستوى الكالسيوم طبيعي، مما يدعم صحة العظام والأعصاب.",
  },
};

const advices: Record<string, { high: string; low: string }> = {
  creatinine: {
    high: "تقليل البروتين في الطعام، شرب كمية كافية من الماء، ومتابعة الطبيب.",
    low: "زيادة البروتين في الغذاء قليلاً.",
  },
  urea: {
    high: "تقليل البروتين، شرب المزيد من الماء، وتجنب الأطعمة المالحة.",
    low: "زيادة البروتين في الغذاء واستشارة الطبيب.",
  },
  potassium: {
    high: "تجنب الموز والبرتقال والبطاطس والطماطم. راجع الطبيب فوراً!",
    low: "تناول الأطعمة الغنية بالبوتاسيوم مثل الموز والبرتقال.",
  },
  sodium: {
    high: "تقليل الملح في الطعام وشرب المزيد من الماء.",
    low: "زيادة تناول الملح قليلاً واستشارة الطبيب.",
  },
  phosphorus: {
    high: "تقليل منتجات الألبان والمشروبات الغازية واللحوم الحمراء.",
    low: "زيادة منتجات الألبان والبروتين في الغذاء.",
  },
  calcium: {
    high: "تقليل منتجات الألبان ومكملات الكالسيوم.",
    low: "زيادة منتجات الألبان وتناول مكملات الكالسيوم.",
  },
};

// Calculate eGFR using CKD-EPI formula
const calculateEGFR = (creatinine: number, age: number, isFemale: boolean): number => {
  const k = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.329 : -0.411;
  const sexMultiplier = isFemale ? 1.018 : 1;

  const eGFR = 141 * Math.pow(Math.min(creatinine / k, 1), alpha) * Math.pow(Math.max(creatinine / k, 1), -1.209) * Math.pow(0.993, age) * sexMultiplier;

  return Math.round(eGFR);
};

const KidneyAnalysis = () => {
  useVisitorTracking("/kidney-analysis");

  const [formData, setFormData] = useState({
    age: "",
    gender: "male" as "male" | "female",
    creatinine: "",
    urea: "",
    potassium: "",
    sodium: "",
    phosphorus: "",
    calcium: "",
  });

  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [eGFR, setEGFR] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [hasDanger, setHasDanger] = useState(false);

  const analyzeValue = (
    testName: string,
    value: number,
    gender: "male" | "female"
  ): AnalysisResult => {
    const range = referenceRanges[testName][gender];
    const dangerLow = referenceRanges[testName].dangerLow;
    const dangerHigh = referenceRanges[testName].dangerHigh;

    let status: "normal" | "warning" | "danger" = "normal";
    let interpretation = interpretations[testName].normal;
    let advice = "حافظ على نمط حياة صحي.";

    if (dangerLow && value <= dangerLow) {
      status = "danger";
      interpretation = interpretations[testName].low;
      advice = advices[testName].low;
    } else if (dangerHigh && value >= dangerHigh) {
      status = "danger";
      interpretation = interpretations[testName].high;
      advice = advices[testName].high;
    } else if (value < range.min) {
      status = "warning";
      interpretation = interpretations[testName].low;
      advice = advices[testName].low;
    } else if (value > range.max) {
      status = "warning";
      interpretation = interpretations[testName].high;
      advice = advices[testName].high;
    }

    const unitMap: Record<string, string> = {
      creatinine: "mg/dL",
      urea: "mg/dL",
      potassium: "mEq/L",
      sodium: "mEq/L",
      phosphorus: "mg/dL",
      calcium: "mg/dL",
    };

    const nameMap: Record<string, string> = {
      creatinine: "الكرياتينين (Creatinine)",
      urea: "اليوريا (Urea/BUN)",
      potassium: "البوتاسيوم (K⁺)",
      sodium: "الصوديوم (Na⁺)",
      phosphorus: "الفوسفور (Phosphorus)",
      calcium: "الكالسيوم (Calcium)",
    };

    return {
      name: nameMap[testName],
      value,
      unit: unitMap[testName],
      status,
      interpretation,
      advice,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const age = parseInt(formData.age);
    if (!age || age < 1 || age > 120) {
      return;
    }

    const newResults: AnalysisResult[] = [];
    let dangerFound = false;

    const tests = ["creatinine", "urea", "potassium", "sodium", "phosphorus", "calcium"] as const;

    tests.forEach((test) => {
      const value = parseFloat(formData[test]);
      if (value && value > 0) {
        const result = analyzeValue(test, value, formData.gender);
        newResults.push(result);
        if (result.status === "danger") dangerFound = true;
      }
    });

    // Calculate eGFR if creatinine is provided
    const creatinineValue = parseFloat(formData.creatinine);
    if (creatinineValue > 0) {
      const calculatedEGFR = calculateEGFR(creatinineValue, age, formData.gender === "female");
      setEGFR(calculatedEGFR);
    } else {
      setEGFR(null);
    }

    setResults(newResults);
    setHasDanger(dangerFound);
    setShowResults(true);
  };

  const getStatusIcon = (status: "normal" | "warning" | "danger") => {
    switch (status) {
      case "normal":
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="w-6 h-6 text-amber-500" />;
      case "danger":
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
    }
  };

  const getStatusBg = (status: "normal" | "warning" | "danger") => {
    switch (status) {
      case "normal":
        return "bg-emerald-50 border-emerald-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "danger":
        return "bg-red-50 border-red-200";
    }
  };

  const getEGFRStatus = (egfr: number) => {
    if (egfr >= 90) return { label: "طبيعي", color: "text-emerald-600", bg: "bg-emerald-100" };
    if (egfr >= 60) return { label: "انخفاض طفيف", color: "text-amber-600", bg: "bg-amber-100" };
    if (egfr >= 30) return { label: "انخفاض متوسط", color: "text-orange-600", bg: "bg-orange-100" };
    if (egfr >= 15) return { label: "انخفاض شديد", color: "text-red-600", bg: "bg-red-100" };
    return { label: "فشل كُلوي", color: "text-red-700", bg: "bg-red-200" };
  };

  return (
    <>
      <Helmet>
        <title>محلل تحاليل الكُلى | د. نهى جمال عبدالمالك</title>
        <meta name="description" content="أداة تفاعلية لفهم نتائج تحاليل وظائف الكُلى بطريقة مبسطة وآمنة. للتوعية فقط وليست تشخيصًا طبيًا." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5" dir="rtl">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <ArrowRight className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">محلل تحاليل الكُلى</h1>
                  <p className="text-sm text-muted-foreground">افهم نتائج تحاليلك</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-semibold">تنبيه مهم</p>
              <p className="text-amber-700 text-sm">
                هذه الأداة للتوعية فقط وليست بديلاً عن استشارة الطبيب. يرجى مراجعة طبيب متخصص لتفسير النتائج واتخاذ القرارات العلاجية.
              </p>
            </div>
          </div>

          {!showResults ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Beaker className="w-6 h-6 text-primary" />
                أدخل نتائج التحاليل
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      العمر
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all"
                      placeholder="أدخل العمر"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      النوع
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all"
                    >
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                </div>

                {/* Test Values */}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">أدخل قيم التحاليل المتوفرة لديك (اترك الحقول الفارغة للتحاليل غير المتوفرة)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        الكرياتينين (Creatinine) - mg/dL
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.creatinine}
                        onChange={(e) => setFormData({ ...formData, creatinine: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all"
                        placeholder="مثال: 1.2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        اليوريا (Urea/BUN) - mg/dL
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.urea}
                        onChange={(e) => setFormData({ ...formData, urea: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all"
                        placeholder="مثال: 15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        البوتاسيوم (K⁺) - mEq/L
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.potassium}
                        onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all"
                        placeholder="مثال: 4.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        الصوديوم (Na⁺) - mEq/L
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.sodium}
                        onChange={(e) => setFormData({ ...formData, sodium: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all"
                        placeholder="مثال: 140"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        الفوسفور (Phosphorus) - mg/dL
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.phosphorus}
                        onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all"
                        placeholder="مثال: 3.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        الكالسيوم (Calcium) - mg/dL
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.calcium}
                        onChange={(e) => setFormData({ ...formData, calcium: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all"
                        placeholder="مثال: 9.5"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-2xl h-14 text-lg font-semibold bg-gradient-to-l from-primary to-accent shadow-lg shadow-primary/25">
                  <Activity className="w-5 h-5 ml-2" />
                  تحليل النتائج
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Danger Alert */}
              {hasDanger && (
                <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-red-800 font-bold text-lg">تحذير! قيم خطرة</h3>
                    <p className="text-red-700 mt-1">
                      بعض النتائج تشير إلى قيم خطرة تستدعي التوجه للطوارئ أو التواصل الفوري مع الطبيب.
                    </p>
                    <a
                      href="tel:01029665927"
                      className="inline-flex items-center gap-2 mt-3 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      اتصل بالعيادة الآن
                    </a>
                  </div>
                </div>
              )}

              {/* eGFR Result */}
              {eGFR !== null && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    معدل الترشيح الكُبيبي المقدر (eGFR)
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-xl ${getEGFRStatus(eGFR).bg}`}>
                      <span className="text-3xl font-bold">{eGFR}</span>
                      <span className="text-sm mr-1">mL/min/1.73m²</span>
                    </div>
                    <span className={`font-semibold ${getEGFRStatus(eGFR).color}`}>
                      {getEGFRStatus(eGFR).label}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-3">
                    eGFR يقيس كفاءة الكُلى في تصفية الدم. القيمة الطبيعية أعلى من 90.
                  </p>
                </div>
              )}

              {/* Results */}
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl p-6 border-2 ${getStatusBg(result.status)}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-bold text-foreground">{result.name}</h4>
                          <p className="text-lg font-semibold">
                            {result.value} <span className="text-sm text-muted-foreground">{result.unit}</span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          result.status === "normal"
                            ? "bg-emerald-100 text-emerald-700"
                            : result.status === "warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.status === "normal" ? "طبيعي" : result.status === "warning" ? "يحتاج متابعة" : "خطر"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-foreground">{result.interpretation}</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>النصيحة:</strong> {result.advice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    setShowResults(false);
                    setResults([]);
                    setEGFR(null);
                    setFormData({
                      age: "",
                      gender: "male",
                      creatinine: "",
                      urea: "",
                      potassium: "",
                      sodium: "",
                      phosphorus: "",
                      calcium: "",
                    });
                  }}
                  variant="outline"
                  className="flex-1 rounded-xl h-12"
                >
                  تحليل جديد
                </Button>
                <Link to="/#booking" className="flex-1">
                  <Button className="w-full rounded-xl h-12 bg-gradient-to-l from-primary to-accent">
                    احجز موعد مع الدكتورة
                  </Button>
                </Link>
              </div>

              {/* Final Disclaimer */}
              <div className="bg-slate-50 rounded-2xl p-4 text-center text-sm text-muted-foreground">
                <p>هذه النتائج للتوعية فقط. يرجى استشارة الطبيب للتشخيص والعلاج المناسب.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default KidneyAnalysis;
