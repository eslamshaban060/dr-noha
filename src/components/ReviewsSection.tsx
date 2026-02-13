import { useState, useEffect } from "react";
import { Star, Quote, ChevronRight, ChevronLeft, MessageSquarePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Review {
  id: string;
  patient_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("id, patient_name, rating, comment, created_at")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Auto-play slider every 4 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const nextSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const formatReviewDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <section id="reviews" className="py-20 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="py-20 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 animate-fade-up">
              <Star className="w-4 h-4 fill-primary" />
              <span>آراء المرضى</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              ماذا يقول <span className="gradient-text">مرضانا</span> عنا
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
              نفتخر بثقة مرضانا ونسعى دائماً لتقديم أفضل رعاية صحية
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">لا توجد تقييمات حالياً، كن أول من يشارك رأيه!</p>
            <Link to="/add-review">
              <Button className="rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 py-6 hover:opacity-90 transition-all duration-300 hover:scale-105">
                <MessageSquarePlus className="w-5 h-5 ml-2" />
                شارك رأيك معنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Calculate visible reviews for desktop (3 at a time)
  const getVisibleReviews = () => {
    const result = [];
    for (let i = 0; i < Math.min(3, reviews.length); i++) {
      const index = (currentIndex + i) % reviews.length;
      result.push({ ...reviews[index], displayIndex: index });
    }
    return result;
  };

  return (
    <section id="reviews" className="py-20 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 animate-fade-up">
            <Star className="w-4 h-4 fill-primary" />
            <span>آراء المرضى</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            ماذا يقول <span className="gradient-text">مرضانا</span> عنا
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            نفتخر بثقة مرضانا ونسعى دائماً لتقديم أفضل رعاية صحية
          </p>
        </div>

        {/* Reviews Slider */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons - Always visible */}
          {reviews.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card shadow-lg border-border/50 hover:bg-primary hover:text-primary-foreground w-10 h-10 md:w-12 md:h-12"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card shadow-lg border-border/50 hover:bg-primary hover:text-primary-foreground w-10 h-10 md:w-12 md:h-12"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Mobile View - Single Card */}
          <div className="md:hidden px-12">
            <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border/30">
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
                {[...Array(5 - reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={`empty-${i}`} className="w-4 h-4 text-border" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">
                "{reviews[currentIndex].comment}"
              </p>
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <p className="font-semibold text-foreground">{reviews[currentIndex].patient_name}</p>
                <p className="text-xs text-muted-foreground">{formatReviewDate(reviews[currentIndex].created_at)}</p>
              </div>
            </div>
          </div>

          {/* Tablet & Desktop View */}
          <div className="hidden md:block px-12">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {getVisibleReviews().map((review) => (
                <div
                  key={`${review.id}-${review.displayIndex}`}
                  className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2 border border-border/30"
                >
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={`empty-${i}`} className="w-4 h-4 text-border" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed line-clamp-4">
                    "{review.comment}"
                  </p>
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <p className="font-semibold text-foreground">{review.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{formatReviewDate(review.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Share Review CTA */}
        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/add-review">
            <Button className="rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 py-6 hover:opacity-90 transition-all duration-300 hover:scale-105">
              <MessageSquarePlus className="w-5 h-5 ml-2" />
              شارك رأيك معنا
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;