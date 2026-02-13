import { useState, useEffect } from "react";
import { Menu, Phone, MessageCircle, Home, User, Stethoscope, MapPin, Star, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import nohaLogo from "@/assets/noha-logo.png";

const navLinks = [
  { href: "#home", label: "الرئيسية", icon: Home },
  { href: "#about", label: "عن الدكتورة", icon: User },
  { href: "#services", label: "الخدمات", icon: Stethoscope },
  { href: "#reviews", label: "آراء المرضى", icon: Star },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-lg shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollToSection("#home"); }}
            className="flex items-center gap-3 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
              isScrolled 
                ? "bg-white" 
                : "bg-primary-foreground/90"
            }`}>
              <img src={nohaLogo} alt="Dr. Noha Gamal" className="w-10 h-10 object-contain" />
            </div>
            <div className={`transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`}>
              <p className="font-bold text-sm">د. نهى جمال</p>
              <p className="text-xs opacity-80">استشاري الكلى</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? "text-foreground hover:bg-primary/10 hover:text-primary"
                    : "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/auth"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isScrolled
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </Link>
            <Button
              onClick={() => scrollToSection("#booking")}
              className={`rounded-xl transition-all duration-300 hover:scale-105 ${
                isScrolled
                  ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                  : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              }`}
            >
              <Phone className="w-4 h-4 ml-2" />
              اتصل الآن
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-xl transition-colors ${
                  isScrolled ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 [&>button]:left-4 [&>button]:right-auto">
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="p-6 gradient-hero">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/90 flex items-center justify-center overflow-hidden">
                      <img src={nohaLogo} alt="Dr. Noha Gamal" className="w-12 h-12 object-contain" />
                    </div>
                    <div className="text-primary-foreground">
                      <p className="font-bold text-lg">د. نهى جمال</p>
                      <p className="text-sm opacity-80">استشاري أمراض الكلى</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4">
                  <div className="space-y-1">
                    {[...navLinks, 
                      { href: "#locations", label: "العناوين", icon: MapPin },
                    ].map((link, index) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-border space-y-3">
                  <Link
                    to="/auth"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </Link>
                  <a
                    href="tel:01029665927"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>01029665927</span>
                  </a>
                  <a
                    href="https://wa.me/201029665927"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
