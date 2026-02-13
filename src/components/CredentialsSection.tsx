import { GraduationCap, Award, Globe, Building } from "lucide-react";

const credentials = [
  {
    icon: GraduationCap,
    title: "مدرس أمراض وزراعة الكلى والباطنة",
    subtitle: "كلية الطب - جامعة أسيوط",
  },
  {
    icon: Building,
    title: "استشاري أمراض الكلى والغسيل الكلوي",
    subtitle: "مستشفيات جامعة أسيوط",
  },
  {
    icon: Globe,
    title: "عضو الجمعية العالمية",
    subtitle: "لأمراض وزراعة الكلى",
  },
  {
    icon: Award,
    title: "عضو الجمعية المصرية",
    subtitle: "لأمراض وزراعة الكلى",
  },
];

const CredentialsSection = () => {
  return (
    <section id="credentials" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            المؤهلات والعضويات
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            خبرة علمية وعملية متميزة
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentials.map((credential, index) => (
            <div
              key={index}
              className="group relative p-6 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-500 text-center border border-border/30"
            >
              <div className="absolute top-0 right-0 left-0 h-1 gradient-hero rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <credential.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {credential.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {credential.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;
