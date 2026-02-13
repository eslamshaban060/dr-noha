import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <h1 className="text-[150px] md:text-[200px] font-bold text-primary-foreground/20 leading-none select-none">
          404
        </h1>
        
        {/* Content Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 -mt-16 relative">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
            <Home className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            الصفحة غير موجودة
          </h2>
          
          <p className="text-primary-foreground/80 mb-8 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة للصفحة الرئيسية.
          </p>
          
          <Link to="/">
            <Button className="rounded-xl bg-primary-foreground text-primary font-semibold px-8 py-6 hover:opacity-90 transition-all duration-300 hover:scale-105">
              <ArrowRight className="w-5 h-5 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;