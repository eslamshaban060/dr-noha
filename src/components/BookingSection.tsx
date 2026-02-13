import { useState } from "react";
import { Calendar, Clock, MapPin, User, Phone, MessageCircle, Sparkles, Home, RefreshCw, Stethoscope, Heart, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const clinics = [
  { id: "assiut", name: "عيادة أسيوط", address: "عمارات الأوقاف - عمارة 4 - الدور الثالث" },
  { id: "mallawi", name: "عيادة ملوي", address: "14 شارع العرفاني - أمام الثانوية بنات" },
];

const timeSlots = [
  "10:00 صباحاً",
  "11:00 صباحاً",
  "12:00 ظهراً",
  "01:00 مساءً",
  "02:00 مساءً",
  "03:00 مساءً",
  "04:00 مساءً",
  "05:00 مساءً",
  "06:00 مساءً",
  "07:00 مساءً",
  "08:00 مساءً",
];

const BookingSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    clinic: "",
    date: "",
    time: "",
    visitType: "new",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.clinic || !formData.date || !formData.time) {
      toast({
        title: "خطأ",
        description: "برجاء ملء جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const clinicName = clinics.find(c => c.id === formData.clinic)?.name || formData.clinic;
    const visitTypeText = formData.visitType === "new" ? "كشف جديد" : "إعادة كشف";
    
    const newVisitMessage = `✨ طلب حجز كشف جديد ✨

👤 الاسم: ${formData.name}
📱 الهاتف: ${formData.phone}
🏠 العنوان: ${formData.address || "غير محدد"}
🏥 العيادة: ${clinicName}
📅 التاريخ: ${formData.date}
🕐 الوقت: ${formData.time}
🩺 نوع الزيارة: ${visitTypeText}

مرحباً بكم في عيادة د. نهى جمال 💜
نتطلع لتقديم أفضل رعاية صحية لكم`;

    const followUpMessage = `🔄 طلب حجز إعادة كشف 🔄

👤 الاسم: ${formData.name}
📱 الهاتف: ${formData.phone}
🏠 العنوان: ${formData.address || "غير محدد"}
🏥 العيادة: ${clinicName}
📅 التاريخ: ${formData.date}
🕐 الوقت: ${formData.time}
🩺 نوع الزيارة: ${visitTypeText}

سعداء بمتابعتكم معنا 💜
نتمنى لكم دوام الصحة والعافية`;

    const message = formData.visitType === "new" ? newVisitMessage : followUpMessage;
    const whatsappUrl = `https://wa.me/201029665927?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "تم إرسال الطلب",
      description: "سيتم التواصل معك قريباً لتأكيد الموعد",
    });

    setFormData({ name: "", phone: "", address: "", clinic: "", date: "", time: "", visitType: "new" });
    setIsSubmitting(false);
  };

  const features = [
    { icon: Heart, title: "رعاية شخصية", desc: "اهتمام خاص بكل مريض" },
    { icon: Shield, title: "خصوصية تامة", desc: "بياناتك في أمان" },
    { icon: CheckCircle, title: "تأكيد سريع", desc: "رد خلال ساعات" },
  ];

  return (
    <section id="booking" className="py-20 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 animate-fade-up">
            <Calendar className="w-4 h-4" />
            <span>احجز موعدك الآن</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            احجز <span className="gradient-text">استشارتك</span> بسهولة
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            املأ البيانات التالية وسيتم إرسالها مباشرة عبر الواتساب لتأكيد موعدك
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Info Side - Desktop Only */}
          <div className="hidden lg:flex lg:col-span-2 flex-col justify-center space-y-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg">
                  <Stethoscope className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">احجز موعدك مع د. نهى جمال</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  استشاري أمراض الكلى والغسيل الكلوي. نقدم رعاية طبية متميزة ومتابعة شخصية لكل مريض.
                </p>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-background/80 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">للتواصل المباشر</span>
                </div>
                <a 
                  href="tel:01029665927" 
                  className="text-2xl font-bold text-primary hover:text-accent transition-colors"
                  dir="ltr"
                >
                  01029665927
                </a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-3xl shadow-card p-6 md:p-10 border border-border/50 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Visit Type */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-foreground text-base font-semibold">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    نوع الزيارة
                  </Label>
                  <RadioGroup
                    value={formData.visitType}
                    onValueChange={(value) => setFormData({ ...formData, visitType: value })}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.visitType === "new" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}`}>
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        <span className="font-medium">كشف جديد</span>
                      </Label>
                    </div>
                    <div className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.visitType === "followup" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}`}>
                      <RadioGroupItem value="followup" id="followup" />
                      <Label htmlFor="followup" className="flex items-center gap-2 cursor-pointer flex-1">
                        <RefreshCw className="w-5 h-5 text-primary" />
                        <span className="font-medium">إعادة كشف</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                      <User className="w-4 h-4 text-primary" />
                      الاسم بالكامل
                    </Label>
                    <Input
                      id="name"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl border-border/50 focus:border-primary h-12 text-right"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                      <Phone className="w-4 h-4 text-primary" />
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="أدخل رقم هاتفك"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl border-border/50 focus:border-primary h-12 text-right"
                      dir="ltr"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="flex items-center gap-2 text-foreground">
                      <Home className="w-4 h-4 text-primary" />
                      العنوان
                    </Label>
                    <Input
                      id="address"
                      placeholder="أدخل عنوانك (اختياري)"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="rounded-xl border-border/50 focus:border-primary h-12 text-right"
                    />
                  </div>

                  {/* Clinic */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      اختر العيادة
                    </Label>
                    <Select
                      value={formData.clinic}
                      onValueChange={(value) => setFormData({ ...formData, clinic: value })}
                    >
                      <SelectTrigger className="rounded-xl border-border/50 h-12 text-right">
                        <SelectValue placeholder="اختر العيادة" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map((clinic) => (
                          <SelectItem key={clinic.id} value={clinic.id}>
                            <div className="text-right">
                              <p className="font-medium">{clinic.name}</p>
                              <p className="text-xs text-muted-foreground">{clinic.address}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      التاريخ
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="rounded-xl border-border/50 focus:border-primary h-12"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2 text-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      الوقت المفضل
                    </Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => setFormData({ ...formData, time: value })}
                    >
                      <SelectTrigger className="rounded-xl border-border/50 h-12 text-right">
                        <SelectValue placeholder="اختر الوقت المناسب" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  {isSubmitting ? "جاري الإرسال..." : "إرسال عبر الواتساب"}
                </Button>
              </form>

              {/* Info note */}
              <div className="mt-6 p-4 bg-primary/5 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  سيتم إرسال بياناتك عبر الواتساب مباشرة وسنتواصل معك في أقرب وقت لتأكيد موعدك
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
