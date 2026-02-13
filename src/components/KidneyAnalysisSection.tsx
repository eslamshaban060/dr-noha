import { Link } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const KidneyAnalysisSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {/* Icon */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/25">
                <Activity className="w-12 h-12 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center md:text-right">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  محلل تحاليل الكُلى
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  أداة تفاعلية تساعدك على فهم نتائج تحاليل وظائف الكُلى بطريقة مبسطة وآمنة. 
                  أدخل قيم تحاليلك واحصل على تفسير فوري مع نصائح عامة.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    تفسير فوري
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    تنبيهات ذكية
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    حساب eGFR
                  </span>
                </div>
                <Link to="/kidney-analysis">
                  <Button className="rounded-full h-14 px-8 text-lg font-semibold bg-gradient-to-l from-primary to-accent shadow-lg shadow-primary/25 hover:shadow-xl transition-all">
                    ابدأ تحليل نتائجك
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Disclaimer */}
            <p className="text-center text-sm text-muted-foreground mt-8 relative">
              ⚠️ هذه الأداة للتوعية فقط وليست بديلاً عن استشارة الطبيب
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KidneyAnalysisSection;
