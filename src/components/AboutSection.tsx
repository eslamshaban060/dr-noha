import { useState, useEffect } from "react";
import {
  Award,
  GraduationCap,
  Heart,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import doctorPortrait from "@/assets/2.jpeg";
import doctorPortrait2 from "@/assets/4.jpeg";
import doctorCover from "@/assets/3.jpeg";

const images = [doctorPortrait, doctorPortrait2, doctorCover];

const achievements = [
  {
    icon: GraduationCap,
    title: "مدرس أمراض وزراعة الكلى",
    subtitle: "كلية الطب - جامعة أسيوط",
  },
  {
    icon: Award,
    title: "استشاري أمراض الكلى",
    subtitle: "مستشفيات جامعة أسيوط",
  },
  {
    icon: Sparkles,
    title: "عضو الجمعية العالمية",
    subtitle: "لأمراض وزراعة الكلى",
  },
  {
    icon: Heart,
    title: "عضو الجمعية المصرية",
    subtitle: "لأمراض وزراعة الكلى",
  },
];

const AboutSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-play slider every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="about" className="py-20 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Gallery Side */}
          <div className="relative flex-1 w-full max-w-md lg:max-w-lg">
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse-slow" />
            <div
              className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            />

            {/* Main image container with gallery */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl rotate-6 opacity-20" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-primary-foreground/10">
                <img
                  src={images[currentImage]}
                  alt="د. نهى جمال عبدالمالك"
                  className="w-full h-[400px] lg:h-[500px] object-cover transition-all duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />

                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 shadow-lg flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 shadow-lg flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                  </>
                )}

                {/* Image indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          currentImage === index
                            ? "bg-primary-foreground w-8"
                            : "bg-primary-foreground/50 hover:bg-primary-foreground/70"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex-1 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4" />
              <span>تعرف على الدكتورة</span>
            </div>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              د. نهى جمال <span className="gradient-text">عبدالمالك</span>
            </h2>

            <p
              className="text-lg text-muted-foreground mb-10 leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              طبيبة متخصصة في أمراض الكلى والباطنة، حاصلة على درجة الماجستير
              والدكتوراه من جامعة أسيوط. تتميز بخبرة واسعة في تشخيص وعلاج جميع
              أمراض الكلى، مع اهتمام خاص بحالات زراعة الكلى والغسيل الكلوي.
            </p>

            {/* Achievements */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <achievement.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
