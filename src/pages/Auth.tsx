import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const emailSchema = z.string().email("البريد الإلكتروني غير صالح");
const passwordSchema = z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل");

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    try {
      emailSchema.parse(formData.email);
    } catch {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "الرجاء إدخال بريد إلكتروني صالح",
        variant: "destructive",
      });
      return false;
    }

    try {
      passwordSchema.parse(formData.password);
    } catch {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    const { error } = await signIn(formData.email, formData.password);
    setIsLoading(false);
    
    if (error) {
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "الرجاء تأكيد بريدك الإلكتروني أولاً";
      }
      toast({ title: "خطأ", description: errorMessage, variant: "destructive" });
    } else {
      toast({ title: "تم تسجيل الدخول بنجاح", description: "مرحباً بك" });
      // لا نعمل redirect هنا مباشرة لتجنب race condition.
      // الـ redirect سيتم تلقائياً من useEffect عندما يصبح user موجود.
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-foreground"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-2xl p-8 animate-fade-up">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-foreground">د. نهى جمال</p>
              <p className="text-sm text-muted-foreground">استشاري أمراض الكلى</p>
            </div>
          </Link>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-muted-foreground">
              أدخل بياناتك للمتابعة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl h-12"
                dir="ltr"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="rounded-xl h-12 pl-12"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold"
            >
              {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
