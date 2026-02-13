import { MapPin, Navigation } from "lucide-react";

const locations = [
  {
    city: "عيادة أسيوط",
    address: "عمارات الأوقاف - عمارة رقم 4 - الدور الثالث",
    icon: "🏥",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=عمارات+الأوقاف+أسيوط+مصر",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.5!2d31.18!3d27.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzQ4LjAiTiAzMcKwMTAnNDguMCJF!5e0!3m2!1sen!2seg!4v1234567890",
  },
  {
    city: "عيادة ملوي",
    address: "14 شارع العرفاني - أمام الثانوية بنات",
    icon: "🏥",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=شارع+العرفاني+ملوي+مصر",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.5!2d30.84!3d27.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzQ4LjAiTiAzMMKwNTAnMjQuMCJF!5e0!3m2!1sen!2seg!4v1234567890",
  },
];

const LocationsSection = () => {
  return (
    <section id="locations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium mb-4">
            تواصل معنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            عناوين العيادات
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نستقبلكم في عياداتنا المتخصصة في أسيوط وملوي
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {locations.map((location, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl shadow-card overflow-hidden border border-border/50"
            >
              {/* Map Embed */}
              <div className="h-48 bg-secondary/30 relative">
                <iframe
                  src={location.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={location.city}
                  className="absolute inset-0"
                />
              </div>
              
              {/* Location Info */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 gradient-hero rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {location.city}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {location.address}
                    </p>
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>افتح في الخرائط</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;