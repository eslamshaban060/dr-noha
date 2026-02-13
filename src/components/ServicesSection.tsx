import { Activity, Heart, Syringe, Droplets, Scan, Users, Shield } from "lucide-react";

const services = [
  {
    icon: Activity,
    title: "تشخيص وعلاج القصور الكلوي",
    description: "تشخيص وعلاج القصور الكلوي الحاد والمزمن بأحدث الطرق العلاجية",
  },
  {
    icon: Heart,
    title: "متابعة زراعة الكلى",
    description: "متابعة دقيقة ومستمرة لحالات زراعة الكلى وما بعد العملية",
  },
  {
    icon: Droplets,
    title: "الغسيل الكلوي",
    description: "متابعة شاملة لمرضى الغسيل الكلوي الدموي والبريتوني",
  },
  {
    icon: Scan,
    title: "الالتهاب النفروزي",
    description: "تشخيص وعلاج حالات الالتهاب النفروزي والمتلازمة الكلوية",
  },
  {
    icon: Syringe,
    title: "عينات البذل الكلوي",
    description: "أخذ عينات البذل الكلوي للتشخيص الدقيق للحالات المختلفة",
  },
  {
    icon: Users,
    title: "أمراض الضغط والسكر",
    description: "متابعة مرضى الضغط والسكر وتأثيرها على الكلى والجهاز الهضمي",
  },
  {
    icon: Shield,
    title: "أمراض المناعة المتعلقة بالكلى",
    description: "تشخيص وعلاج الذئبة الحمراء والروماتويد المفصلي وتأثيرهما على الكلى",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium mb-4">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            الخدمات الطبية المتخصصة
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات الطبية المتخصصة في أمراض الكلى والباطنة بأحدث الأساليب العلاجية
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-2xl shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 gradient-hero rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
