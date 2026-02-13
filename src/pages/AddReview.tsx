import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  User,
  MessageSquare,
  Send,
  ArrowRight,
  Stethoscope,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const AddReview = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.review) {
      toast({
        title: "خطأ",
        description: "برجاء ملء جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        patient_name: formData.name,
        rating: formData.rating,
        comment: formData.review,
        status: "pending", // Will need admin approval
      });

      if (error) throw error;

      // Create notification for new review
      await supabase.from("notifications").insert({
        title: "تقييم جديد",
        message: `تم استلام تقييم جديد من ${formData.name} بتقييم ${formData.rating} نجوم`,
        type: "review",
        is_read: false,
      });

      setIsSubmitted(true);
      toast({
        title: "شكراً لتقييمك",
        description: "تم إرسال تقييمك بنجاح وسيظهر بعد المراجعة",
      });

      setFormData({ name: "", rating: 5, review: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل في إرسال التقييم، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-up my-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              شكراً لتقييمك!
            </h1>
            <p className="text-muted-foreground mb-8">
              تم إرسال تقييمك بنجاح وسيظهر في الموقع بعد مراجعته من قبل الإدارة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="rounded-xl h-12"
              >
                إضافة تقييم آخر
              </Button>
              <Link to="/">
                <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <ArrowRight className="w-5 h-5 ml-2" />
                  العودة للصفحة الرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-up my-8">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-foreground">د. نهى جمال</p>
              <p className="text-sm text-muted-foreground">
                استشاري أمراض الكلى
              </p>
            </div>
          </Link>

          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>نقدر رأيك</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              شارك رأيك معنا
            </h1>
            <p className="text-muted-foreground">
              تجربتك تهمنا ونسعى دائماً لتقديم أفضل خدمة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="space-y-3">
              <Label
                htmlFor="name"
                className="flex items-center gap-2 text-base"
              >
                <User className="w-5 h-5 text-primary" />
                الاسم
              </Label>
              <Input
                id="name"
                placeholder="أدخل اسمك الكريم"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-xl h-14 text-base"
                required
              />
            </div>

            {/* Rating */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base">
                <Star className="w-5 h-5 text-primary" />
                التقييم
              </Label>
              <div className="flex justify-center gap-3 p-4 bg-secondary/50 rounded-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-all duration-200 hover:scale-125"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= formData.rating
                          ? "fill-accent text-accent drop-shadow-lg"
                          : "text-border hover:text-accent/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review */}
            <div className="space-y-3">
              <Label
                htmlFor="review"
                className="flex items-center gap-2 text-base"
              >
                <MessageSquare className="w-5 h-5 text-primary" />
                رأيك
              </Label>
              <Textarea
                id="review"
                placeholder="شاركنا تجربتك مع د. نهى... ما الذي أعجبك؟ كيف كانت الخدمة؟"
                value={formData.review}
                onChange={(e) =>
                  setFormData({ ...formData, review: e.target.value })
                }
                className="rounded-xl min-h-40 resize-none text-base"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
            >
              <Send className="w-5 h-5 ml-2" />
              {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
          </form>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 justify-center text-primary hover:underline font-medium"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
