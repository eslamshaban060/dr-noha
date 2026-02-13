import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Gift,
  Download,
  Loader2,
  Sparkles,
  Calendar,
  Percent,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import nohaLogo from "@/assets/noha-logo.png";

const GiftCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    expiryDate: "",
  });
  const [showPreview, setShowPreview] = useState(false);

  // Validate English letters only
  const validateEnglishName = (name: string) => {
    return /^[a-zA-Z\s]+$/.test(name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow English letters and spaces
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, name: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.discount || !formData.expiryDate) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!validateEnglishName(formData.name)) {
      toast({ title: "Please enter patient name in English only", variant: "destructive" });
      return;
    }
    setShowPreview(true);
  };

  const formatExpiryDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setGenerating(true);
    try {
      // Create a clone of the card for PDF generation with fixed dimensions
      const cardElement = cardRef.current;
      const clone = cardElement.cloneNode(true) as HTMLElement;
      
      // Set explicit dimensions to prevent shifting
      clone.style.width = "720px";
      clone.style.height = "405px";
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: 720,
        height: 405,
        windowWidth: 720,
        windowHeight: 405,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [180, 101.25], // 16:9 ratio
      });

      pdf.addImage(imgData, "PNG", 0, 0, 180, 101.25);
      pdf.save(`gift-card-${formData.name}.pdf`);

      toast({ title: "Gift card downloaded successfully!" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ title: "Error generating the card", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowRight className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Gift Card</h1>
                <p className="text-sm text-muted-foreground">Create gift cards for patients</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8" dir="ltr">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form - Left Side */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 order-2 lg:order-1">
            <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              Card Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Patient Name (English only)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white focus:ring-0 transition-all text-lg"
                  placeholder="Enter patient name"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-primary" />
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white focus:ring-0 transition-all text-lg"
                  placeholder="e.g. 20"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 focus:bg-white focus:ring-0 transition-all text-lg"
                  required
                />
              </div>

              <Button type="submit" className="w-full rounded-2xl bg-gradient-to-l from-primary to-accent h-14 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Sparkles className="w-5 h-5 ml-2" />
                Generate Card
              </Button>
            </form>
          </div>

          {/* Preview - Right Side */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              Card Preview
            </h2>

            {showPreview ? (
              <>
                {/* Premium Gift Card Design - Fixed dimensions for PDF consistency */}
                <div
                  ref={cardRef}
                  className="relative overflow-hidden shadow-2xl"
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    background: "linear-gradient(135deg, #6B21A8 0%, #7C3AED 50%, #A855F7 100%)",
                    borderRadius: "16px",
                  }}
                >
                  {/* Background Pattern */}
                  <div 
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.1,
                      backgroundImage: `
                        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)
                      `
                    }}
                  />

                  {/* Card Content - Using inline styles for PDF consistency */}
                  <div 
                    style={{
                      position: "relative",
                      height: "100%",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxSizing: "border-box",
                    }}
                    dir="ltr"
                  >
                    {/* Header Row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Logo and Doctor Info */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "12px",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          padding: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <img 
                            src={nohaLogo} 
                            alt="Dr. Noha Gamal" 
                            style={{ width: "40px", height: "40px", objectFit: "contain" }}
                          />
                        </div>
                        <div>
                          <h3 style={{ color: "white", fontWeight: "bold", fontSize: "18px", margin: 0 }}>Dr. Noha Gamal</h3>
                          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>Kidney Disease Consultant</p>
                        </div>
                      </div>
                      
                      {/* Gift Card Badge */}
                      <div style={{
                        backgroundColor: "white",
                        color: "#7C3AED",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}>
                        <span style={{ fontWeight: "bold", fontSize: "14px", letterSpacing: "0.05em" }}>GIFT CARD</span>
                      </div>
                    </div>

                    {/* Center Content */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <p style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        marginBottom: "4px",
                      }}>
                        Special Discount For
                      </p>
                      <h2 style={{
                        color: "white",
                        fontSize: "26px",
                        fontWeight: "bold",
                        marginBottom: "12px",
                        textAlign: "center",
                      }}>
                        {formData.name}
                      </h2>
                      
                      {/* Discount Display */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ height: "1px", width: "24px", backgroundColor: "rgba(255,255,255,0.3)" }} />
                        <div style={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(4px)",
                          borderRadius: "8px",
                          padding: "8px 16px",
                        }}>
                          <span style={{ color: "white", fontSize: "28px", fontWeight: "bold" }}>{formData.discount}%</span>
                          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", marginLeft: "4px" }}>OFF</span>
                        </div>
                        <div style={{ height: "1px", width: "24px", backgroundColor: "rgba(255,255,255,0.3)" }} />
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Valid Until</p>
                        <p style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: 0 }}>{formatExpiryDate(formData.expiryDate)}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Phone style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.7)" }} />
                        <p style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: 0 }}>01029665927</p>
                      </div>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div 
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Download Button */}
                <Button
                  onClick={handleDownload}
                  disabled={generating}
                  className="w-full rounded-2xl h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 ml-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center text-muted-foreground p-8">
                  <div className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10 opacity-40" />
                  </div>
                  <p className="text-lg font-medium">Enter details to preview the card</p>
                  <p className="text-sm mt-1 opacity-70">The card will appear here after filling the fields</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GiftCard;
