// import { Star, Calendar, Heart, Stethoscope, Users, Sparkles, Award, Shield } from "lucide-react";
// import doctorPortrait from "@/assets/doctor-portrait.png";

// const HeroSection = () => {
//   const scrollToBooking = () => {
//     document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <section id="home" className="relative min-h-screen overflow-hidden gradient-hero">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Floating orbs */}
//         <div className="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
//         <div className="absolute bottom-40 left-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
//         <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl animate-pulse-slow" />

//         {/* Decorative shapes */}
//         <div className="absolute top-32 left-1/4 w-3 h-3 bg-accent rounded-full animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
//         <div className="absolute top-48 right-1/3 w-2 h-2 bg-primary-foreground/50 rounded-full animate-pulse-slow" style={{ animationDelay: "1s" }} />
//         <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-accent/60 rounded-full animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
//       </div>

//       <div className="relative container mx-auto px-4 pt-32 pb-20 lg:pt-36">
//         <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

//           {/* Content Side - Now on Right for RTL */}
//           <div className="flex-1 text-center lg:text-right order-2 lg:order-1 space-y-8">
//             {/* Specialty Badge */}
//             <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/30 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium shadow-lg animate-fade-up">
//               <Sparkles className="w-4 h-4 animate-pulse-slow" />
//               عيادة متخصصة في أمراض وزراعة الكلى
//             </div>

//             {/* Main Headline */}
//             <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
//                 لأن صحة كليتيك
//               </h1>
//               <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
//                 تستحق أفضل رعاية
//               </h2>
//             </div>

//             {/* Description */}
//             <p className="text-lg md:text-xl text-primary-foreground/90 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
//               نقدم أحدث تقنيات تشخيص وعلاج أمراض الكلى والباطنة العامة بخبرة طبية متميزة ورعاية شخصية لكل مريض
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "0.3s" }}>
//               <button
//                 onClick={scrollToBooking}
//                 className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-foreground text-primary rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-primary-foreground/25 transition-all duration-300 hover:scale-105"
//               >
//                 <Calendar className="w-5 h-5 group-hover:animate-pulse" />
//                 <span>احجز موعدك الآن</span>
//               </button>
//               <a
//                 href="/add-review"
//                 className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-foreground/20 border-2 border-primary-foreground/50 text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary-foreground/30 hover:border-primary-foreground transition-all duration-300"
//               >
//                 <Star className="w-5 h-5 group-hover:animate-pulse" />
//                 <span>شاركنا رأيك</span>
//               </a>
//             </div>

//           </div>

//           {/* Doctor Image Side - Now on Left */}
//           <div className="relative flex-1 order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-up">
//             <div className="relative">
//               {/* Outer Decorative Ring with animation */}
//               <div className="absolute -inset-6 rounded-full border-[3px] border-dashed border-primary-foreground/40 animate-[spin_20s_linear_infinite]" />

//               {/* Second decorative ring */}
//               <div className="absolute -inset-10 rounded-full border-2 border-dotted border-accent/30 animate-[spin_30s_linear_infinite_reverse]" />

//               {/* Glow Effect */}
//               <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-foreground/20 to-accent/20 blur-2xl scale-110 animate-pulse-slow" />

//               {/* Main Image Container */}
//               <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px]">
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-foreground/30 to-accent/20" />
//                 <img
//                   src={doctorPortrait}
//                   alt="د. نهى جمال عبدالمالك - استشاري أمراض وزراعة الكلى"
//                   className="relative w-full h-full object-cover rounded-full border-4 border-primary-foreground/50 shadow-2xl"
//                 />

//                 {/* Floating badges around the image */}
//                 <div className="absolute -top-2 -right-2 w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
//                   <Award className="w-7 h-7 text-accent-foreground" />
//                 </div>

//                 <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-primary-foreground rounded-xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "1s" }}>
//                   <Shield className="w-6 h-6 text-primary" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Feature Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 animate-fade-up" style={{ animationDelay: "0.5s" }}>
//           {/* Card 1 */}
//           <div className="group bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center border border-white/30 hover:bg-white/30 hover:-translate-y-2 transition-all duration-300 shadow-lg">
//             <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//               <Heart className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-3">راحة المريض أولاً</h3>
//             <p className="text-white/90 text-sm leading-relaxed">نوفر بيئة هادئة ومريحة لضمان راحة المريض طوال فترة العلاج</p>
//           </div>

//           {/* Card 2 */}
//           <div className="group bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center border border-white/30 hover:bg-white/30 hover:-translate-y-2 transition-all duration-300 shadow-lg">
//             <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//               <Stethoscope className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-3">تشخيص متخصص</h3>
//             <p className="text-white/90 text-sm leading-relaxed">نقدم تقييمات دقيقة باستخدام أحدث التقنيات والأجهزة الطبية</p>
//           </div>

//           {/* Card 3 */}
//           <div className="group bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center border border-white/30 hover:bg-white/30 hover:-translate-y-2 transition-all duration-300 shadow-lg">
//             <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//               <Users className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-3">رعاية موثوقة</h3>
//             <p className="text-white/90 text-sm leading-relaxed">نهتم بمتابعة المرضى وتقديم أفضل رعاية طبية متكاملة</p>
//           </div>
//         </div>
//       </div>

//       {/* Bottom wave decoration */}
//       <div className="absolute bottom-0 left-0 right-0">
//         <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
//           <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
//         </svg>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import {
  Star,
  Calendar,
  Heart,
  Stethoscope,
  Users,
  Sparkles,
  Award,
  Shield,
} from "lucide-react";
import doctorPortrait from "@/assets/1.jpeg";

const HeroSection = () => {
  const scrollToBooking = () => {
    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative py-16 overflow-hidden min-h-[100vh]  gradient-hero"
    >
      {/* Animated Background Elements */}
      <div className="absolute  inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 right-10 w-64  bg-white/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-40 left-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl animate-pulse-slow" />

        {/* Decorative shapes */}
        <div
          className="absolute top-32 left-1/4 w-3 h-3 bg-accent rounded-full animate-pulse-slow"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-48 right-1/3 w-2 h-2 bg-primary-foreground/50 rounded-full animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-4 h-4 bg-accent/60 rounded-full animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20 lg:pt-36">
        <div className="flex flex-col  lg:flex-row-reverse items-center gap-12 lg:gap-16">
          {/* Doctor Image Side */}
          <div className="relative flex-1 justify-center order-1 lg:order-1 flex  animate-fade-up">
            <div className="relative">
              {/* Outer Decorative Ring with animation */}
              <div className="absolute -inset-6 rounded-full border-[3px] border-dashed border-primary-foreground/40 animate-[spin_20s_linear_infinite]" />

              {/* Second decorative ring */}
              <div className="absolute -inset-10 rounded-full border-2 border-dotted border-accent/30 animate-[spin_30s_linear_infinite_reverse]" />

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-foreground/20 to-accent/20 blur-2xl scale-110 animate-pulse-slow" />

              {/* Main Image Container */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-foreground/30 to-accent/20" />
                <img
                  src={doctorPortrait}
                  alt="د. نهى جمال عبدالمالك - استشاري أمراض وزراعة الكلى"
                  className="relative w-full h-full object-cover rounded-full border-4 border-primary-foreground/50 shadow-2xl"
                />

                {/* Floating badges around the image */}
                <div
                  className="absolute -top-2 -right-2 w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Award className="w-7 h-7 text-accent-foreground" />
                </div>

                <div
                  className="absolute -bottom-2 -left-2 w-12 h-12 bg-primary-foreground rounded-xl flex items-center justify-center shadow-lg animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex-1 text-center lg:text-right order-2 lg:order-2 space-y-8">
            {/* Specialty Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/30 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium shadow-lg animate-fade-up">
              <Sparkles className="w-4 h-4 animate-pulse-slow" />
              عيادة متخصصة في أمراض وزراعة الكلى
            </div>

            {/* Main Headline */}
            <div
              className="space-y-4 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                لأن صحة كليتيك
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                تستحق أفضل رعاية
              </h2>
            </div>

            {/* Description */}
            <p
              className="text-lg md:text-xl text-primary-foreground/90 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              نقدم أحدث تقنيات تشخيص وعلاج أمراض الكلى والباطنة العامة بخبرة
              طبية متميزة ورعاية شخصية لكل مريض
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                onClick={scrollToBooking}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-foreground text-primary rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-primary-foreground/25 transition-all duration-300 hover:scale-105"
              >
                <Calendar className="w-5 h-5 group-hover:animate-pulse" />
                <span>احجز موعدك الآن</span>
              </button>
              <a
                href="/add-review"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-foreground/20 border-2 border-primary-foreground/50 text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary-foreground/30 hover:border-primary-foreground transition-all duration-300"
              >
                <Star className="w-5 h-5 group-hover:animate-pulse" />
                <span>شاركنا رأيك</span>
              </a>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {/* Card 1 */}
          <div className="group bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center border border-white/30 hover:bg-white/30 hover:-translate-y-2 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              راحة المريض أولاً
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              نوفر بيئة هادئة ومريحة لضمان راحة المريض طوال فترة العلاج
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center border border-white/30 hover:bg-white/30 hover:-translate-y-2 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">تشخيص متخصص</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              نقدم تقييمات دقيقة باستخدام أحدث التقنيات والأجهزة الطبية
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center border border-white/30 hover:bg-white/30 hover:-translate-y-2 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">رعاية موثوقة</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              نهتم بمتابعة المرضى وتقديم أفضل رعاية طبية متكاملة
            </p>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
