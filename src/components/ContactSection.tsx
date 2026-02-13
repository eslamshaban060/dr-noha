import { useState } from "react";
import { Send, Phone, Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message) {
      toast({
        title: "خطأ",
        description: "برجاء ملء الاسم والرسالة على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const message = `📩 رسالة جديدة من الموقع

👤 الاسم: ${formData.name}
📧 البريد: ${formData.email || "غير محدد"}
📱 الهاتف: ${formData.phone || "غير محدد"}

💬 الرسالة:
${formData.message}`;

    const whatsappUrl = `https://wa.me/201029665927?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "تم إرسال الرسالة",
      description: "شكراً لتواصلك معنا، سنرد عليك في أقرب وقت",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 animate-fade-up">
            <MessageCircle className="w-4 h-4" />
            <span>تواصل معنا</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            نحن هنا <span className="gradient-text">لمساعدتك</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            لا تتردد في التواصل معنا لأي استفسار أو مساعدة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card rounded-3xl shadow-card p-8 border border-border/50 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              أرسل لنا رسالة
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-foreground">الاسم *</Label>
                <Input
                  id="contact-name"
                  placeholder="أدخل اسمك"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-border/50 h-12 text-right"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-foreground">البريد الإلكتروني</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl border-border/50 h-12"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone" className="text-foreground">رقم الهاتف</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl border-border/50 h-12"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-foreground">الرسالة *</Label>
                <Textarea
                  id="contact-message"
                  placeholder="اكتب رسالتك هنا..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="rounded-xl border-border/50 min-h-32 text-right resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300"
              >
                <Send className="w-4 h-4 ml-2" />
                {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {/* Quick Contact Cards */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/30 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">اتصل بنا</p>
                  <a href="tel:01029665927" className="text-xl font-bold text-foreground hover:text-primary transition-colors" dir="ltr">
                    01029665927
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/30 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">واتساب</p>
                  <a 
                    href="https://wa.me/201029665927" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-foreground hover:text-primary transition-colors"
                  >
                    راسلنا الآن
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/30 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">العناوين</p>
                  <div className="space-y-2">
                    <p className="text-foreground">
                      <strong>أسيوط:</strong> عمارات الأوقاف - عمارة 4 - الدور الثالث
                    </p>
                    <p className="text-foreground">
                      <strong>ملوي:</strong> 14 شارع العرفاني - أمام الثانوية بنات
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="gradient-hero rounded-2xl p-6 text-primary-foreground">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <h4 className="font-bold text-lg">هل لديك سؤال عاجل؟</h4>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                تواصل معنا مباشرة عبر الواتساب للرد السريع على استفساراتك
              </p>
              <a
                href="https://wa.me/201029665927"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل عبر الواتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
