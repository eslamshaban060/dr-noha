import { Stethoscope, Phone, MapPin, Facebook, MessageCircle, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">د. نهى جمال عبدالمالك</h3>
                <p className="text-primary-foreground/70 text-sm">استشاري أمراض وزراعة الكلى</p>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              نقدم أفضل رعاية صحية لمرضى الكلى بأحدث الطرق العلاجية وبخبرة متميزة
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">العناوين</h4>
            <div className="space-y-3 text-primary-foreground/70 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <p>أسيوط: عمارات الأوقاف - عمارة 4 - الدور الثالث</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <p>ملوي: 14 شارع العرفاني - أمام الثانوية بنات</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <a href="tel:01029665927" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                <Phone className="w-4 h-4" /> 01029665927
              </a>
              <div className="flex gap-3 mt-4">
                <a href="https://www.facebook.com/profile.php?id=61568506352079" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://wa.me/201029665927" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/40 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center hover:bg-pink-500/40 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-primary-foreground/70 text-sm">
            <span>الموقع صُمم بواسطة شركة </span>
            <span className="font-semibold text-primary-foreground">Good Graphic</span>
          </div>
          <p className="text-primary-foreground/50 text-sm">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;