import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Eye,
  Trash2,
  UserPlus,
  BarChart3,
  Activity,
  ChevronLeft,
  MoreVertical,
  Search,
  Filter,
  Menu,
  X,
  Home,
  Mail,
  Phone,
  Shield,
  Loader2,
  FileText,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import ConfirmDialog from "@/components/ConfirmDialog";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type TabType = "overview" | "reviews" | "admins" | "notifications" | "settings";

// DropdownMenu imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut, isAdmin } = useAuth();
  const {
    loading: dataLoading,
    stats,
    bookings,
    reviews,
    notifications,
    admins,
    weeklyVisits,
    approveReview,
    deleteReview,
    markNotificationAsRead,
    deleteNotification,
    addAdmin,
    removeAdmin,
    unreadNotificationsCount,
  } = useDashboardData();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", role: "مساعد" });

  // Confirmation dialogs state
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteReviewDialogOpen, setDeleteReviewDialogOpen] = useState(false);
  const [approveReviewDialogOpen, setApproveReviewDialogOpen] = useState(false);
  
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [deleteAdminDialogOpen, setDeleteAdminDialogOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const navItems = [
    { id: "overview" as TabType, label: "نظرة عامة", icon: BarChart3 },
    { id: "reviews" as TabType, label: "التقييمات", icon: Star },
    { id: "admins" as TabType, label: "المشرفين", icon: Users },
    { id: "notifications" as TabType, label: "الإشعارات", icon: Bell },
    { id: "settings" as TabType, label: "الإعدادات", icon: Settings },
  ];

  // Filter out admins - only show moderators
  const moderators = admins.filter((admin) => admin.role !== "admin");

  const handleDeleteAdminClick = (userId: string) => {
    setSelectedAdminId(userId);
    setDeleteAdminDialogOpen(true);
  };

  const confirmDeleteAdmin = async () => {
    if (selectedAdminId) {
      await removeAdmin(selectedAdminId);
      setSelectedAdminId(null);
    }
  };

  // Redirect if not logged in (small delay to avoid flicker during session restore)
  useEffect(() => {
    if (authLoading) return;
    if (user) return;

    const t = window.setTimeout(() => {
      navigate("/auth", { replace: true });
    }, 250);

    return () => window.clearTimeout(t);
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast({ title: "تم تسجيل الخروج بنجاح" });
    navigate("/");
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.password || newAdmin.password.length < 6) {
      toast({ title: "كلمة المرور يجب أن تكون 6 أحرف على الأقل", variant: "destructive" });
      return;
    }
    const success = await addAdmin(newAdmin.email, newAdmin.name, newAdmin.password);
    if (success) {
      setShowAddAdmin(false);
      setNewAdmin({ name: "", email: "", password: "", role: "مساعد" });
    }
  };

  const handleDeleteReviewClick = (id: string) => {
    setSelectedReviewId(id);
    setDeleteReviewDialogOpen(true);
  };

  const handleApproveReviewClick = (id: string) => {
    setSelectedReviewId(id);
    setApproveReviewDialogOpen(true);
  };

  const confirmDeleteReview = () => {
    if (selectedReviewId) {
      deleteReview(selectedReviewId);
      setSelectedReviewId(null);
    }
  };

  const confirmApproveReview = () => {
    if (selectedReviewId) {
      approveReview(selectedReviewId);
      setSelectedReviewId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const period = hour >= 12 ? "م" : "ص";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    } catch {
      return timeString;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "الآن";
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays < 7) return `منذ ${diffDays} يوم`;
      return formatDate(dateString);
    } catch {
      return dateString;
    }
  };

  const statsCards = [
    { 
      label: "زيارات اليوم", 
      value: stats.todayVisits.toString(), 
      icon: Eye, 
      bgColor: "bg-emerald-50", 
      iconColor: "text-emerald-600", 
      trend: stats.visitsTrend 
    },
    { 
      label: "إجمالي الزيارات", 
      value: weeklyVisits.reduce((acc, v) => acc + v.visits, 0).toString(), 
      icon: TrendingUp, 
      bgColor: "bg-blue-50", 
      iconColor: "text-blue-600", 
      trend: "آخر 7 أيام" 
    },
    { 
      label: "التقييمات", 
      value: stats.totalReviews.toString(), 
      icon: Star, 
      bgColor: "bg-amber-50", 
      iconColor: "text-amber-600", 
      trend: stats.reviewsTrend 
    },
    { 
      label: "قيد المراجعة", 
      value: stats.pendingReviews.toString(), 
      icon: Users, 
      bgColor: "bg-pink-50", 
      iconColor: "text-pink-600", 
      trend: `${stats.approvedReviews} منشور` 
    },
  ];

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="تسجيل الخروج"
        description="هل أنت متأكد من تسجيل الخروج من لوحة التحكم؟"
        confirmText="تسجيل الخروج"
        onConfirm={handleLogout}
      />

      <ConfirmDialog
        open={deleteReviewDialogOpen}
        onOpenChange={setDeleteReviewDialogOpen}
        title="حذف التقييم"
        description="هل أنت متأكد من حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        variant="destructive"
        onConfirm={confirmDeleteReview}
      />

      <ConfirmDialog
        open={approveReviewDialogOpen}
        onOpenChange={setApproveReviewDialogOpen}
        title="نشر التقييم"
        description="هل أنت متأكد من نشر هذا التقييم؟ سيظهر للجميع في الموقع."
        confirmText="نشر"
        onConfirm={confirmApproveReview}
      />


      <ConfirmDialog
        open={deleteAdminDialogOpen}
        onOpenChange={setDeleteAdminDialogOpen}
        title="حذف المساعد"
        description="هل أنت متأكد من حذف هذا المساعد؟ سيتم إزالة صلاحياته من النظام."
        confirmText="حذف"
        variant="destructive"
        onConfirm={confirmDeleteAdmin}
      />

      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed right-0 top-0 h-full bg-white border-l border-slate-100 shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0 w-72" : "translate-x-full lg:translate-x-0"
      } ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"}`}>
        <div className="p-4 lg:p-6 h-full flex flex-col">
          {/* Mobile Close Button */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute left-4 top-4 p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Collapse Toggle - Desktop only */}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex absolute -left-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 text-slate-500 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </button>

          {/* Logo */}
          <div className={`flex items-center gap-4 mb-10 mt-2 lg:mt-0 ${sidebarCollapsed ? "lg:justify-center" : ""}`}>
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
              <Stethoscope className="w-6 h-6 lg:w-7 lg:h-7 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <div className="lg:block">
                <p className="font-bold text-lg text-foreground">د. نهى جمال</p>
                <p className="text-xs text-muted-foreground">لوحة التحكم</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  sidebarCollapsed ? "lg:justify-center lg:px-2" : ""
                } ${
                  activeTab === item.id 
                    ? "bg-gradient-to-l from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25" 
                    : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {item.id === "notifications" && unreadNotificationsCount > 0 && !sidebarCollapsed && (
                  <span className={`mr-auto w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                    activeTab === item.id ? "bg-white/20 text-primary-foreground" : "bg-pink-500 text-white"
                  }`}>
                    {unreadNotificationsCount}
                  </span>
                )}
                {item.id === "notifications" && unreadNotificationsCount > 0 && sidebarCollapsed && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
                )}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <Link 
                to="/gift-card"
                title={sidebarCollapsed ? "كارت هدية" : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-slate-50 hover:text-foreground transition-all duration-200 ${sidebarCollapsed ? "lg:justify-center lg:px-2" : ""}`}
              >
                <Gift className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>كارت هدية</span>}
              </Link>
              <Link 
                to="/"
                title={sidebarCollapsed ? "الصفحة الرئيسية" : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-slate-50 hover:text-foreground transition-all duration-200 ${sidebarCollapsed ? "lg:justify-center lg:px-2" : ""}`}
              >
                <Home className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>الصفحة الرئيسية</span>}
              </Link>
            </div>
          </nav>

          {/* Logout */}
          <Button 
            onClick={() => setLogoutDialogOpen(true)}
            variant="outline" 
            title={sidebarCollapsed ? "تسجيل الخروج" : undefined}
            className={`w-full rounded-xl gap-2 h-12 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors ${sidebarCollapsed ? "lg:px-2" : ""}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && "تسجيل الخروج"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-72"}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:block">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {activeTab === "overview" && "مرحباً، د. نهى 👋"}
                {activeTab === "reviews" && "إدارة التقييمات"}
                {activeTab === "admins" && "إدارة المشرفين"}
                {activeTab === "notifications" && "الإشعارات"}
                {activeTab === "settings" && "الإعدادات"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {activeTab === "overview" && "هذا ملخص نشاط موقعك اليوم"}
                {activeTab === "reviews" && "تحكم في تقييمات المرضى"}
                {activeTab === "admins" && "إضافة وإدارة صلاحيات المشرفين"}
                {activeTab === "notifications" && "جميع الإشعارات والتنبيهات"}
                {activeTab === "settings" && "إعدادات الموقع والحساب"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab("notifications")}
                className="relative w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-lg">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "م"}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Title */}
          <div className="md:hidden mt-4">
            <h1 className="text-lg font-bold text-foreground">
              {activeTab === "overview" && "مرحباً، د. نهى 👋"}
              {activeTab === "reviews" && "إدارة التقييمات"}
              {activeTab === "admins" && "إدارة المشرفين"}
              {activeTab === "notifications" && "الإشعارات"}
              {activeTab === "settings" && "الإعدادات"}
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6 md:space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statsCards.map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-6 h-6 md:w-7 md:h-7 ${stat.iconColor}`} />
                      </div>
                      <span className="text-emerald-600 text-xs md:text-sm font-medium bg-emerald-50 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-muted-foreground text-xs md:text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visitors Chart - Using Recharts */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground">زيارات الموقع</h3>
                    <span className="text-sm text-muted-foreground">آخر 7 أيام</span>
                  </div>
                  <div className="h-48 md:h-56" dir="ltr">
                    {weeklyVisits.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyVisits} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(270, 60%, 50%)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(270, 60%, 50%)" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="day" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            width={30}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              direction: 'rtl'
                            }}
                            formatter={(value: number) => [`${value} زيارة`, 'الزيارات']}
                            labelFormatter={(label) => label}
                          />
                          <Area
                            type="monotone"
                            dataKey="visits"
                            stroke="hsl(270, 60%, 50%)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVisits)"
                            dot={{ r: 5, fill: 'white', stroke: 'hsl(270, 60%, 50%)', strokeWidth: 2 }}
                            activeDot={{ r: 7, fill: 'hsl(270, 60%, 50%)', stroke: 'white', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground h-full">
                        لا توجد بيانات
                      </div>
                    )}
                  </div>
                  {/* Total visits summary */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">إجمالي الزيارات هذا الأسبوع</span>
                    <span className="text-lg font-bold text-primary">
                      {weeklyVisits.reduce((acc, v) => acc + v.visits, 0)} زيارة
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-foreground mb-6">إحصائيات سريعة</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-l from-emerald-50 to-teal-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm text-foreground">متوسط التقييم</span>
                      </div>
                      <span className="font-bold text-emerald-600">{stats.averageRating} ⭐</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-l from-blue-50 to-cyan-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-foreground">تقييمات منشورة</span>
                      </div>
                      <span className="font-bold text-blue-600">{stats.approvedReviews}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-l from-amber-50 to-orange-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-foreground">قيد المراجعة</span>
                      </div>
                      <span className="font-bold text-amber-600">{stats.pendingReviews}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-l from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-foreground">زيارات اليوم</span>
                      </div>
                      <span className="font-bold text-purple-600">{stats.todayVisits}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Search & Filter */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="ابحث في التقييمات..."
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 text-muted-foreground hover:bg-slate-100 transition-colors">
                  <Filter className="w-5 h-5" />
                  <span>تصفية</span>
                </button>
              </div>

              {/* Reviews Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-foreground">{stats.totalReviews}</p>
                  <p className="text-sm text-muted-foreground">إجمالي التقييمات</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{stats.approvedReviews}</p>
                  <p className="text-sm text-muted-foreground">تقييمات منشورة</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-amber-600">{stats.pendingReviews}</p>
                  <p className="text-sm text-muted-foreground">قيد المراجعة</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold text-foreground">{stats.averageRating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-muted-foreground">
                    لا توجد تقييمات بعد
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold">{review.patient_name.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                              <p className="font-semibold text-foreground">{review.patient_name}</p>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                ))}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                review.status === "approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                              }`}>
                                {review.status === "approved" ? "منشور" : "قيد المراجعة"}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{review.comment || "لا يوجد تعليق"}</p>
                            <p className="text-sm text-slate-400 mt-2">{formatRelativeTime(review.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-start">
                          {review.status !== "approved" && (
                            <button 
                              onClick={() => handleApproveReviewClick(review.id)}
                              className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                              title="نشر التقييم"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteReviewClick(review.id)}
                            className="p-2.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            title="حذف التقييم"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === "admins" && (
            <div className="space-y-6">
              {/* Add Admin Button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowAddAdmin(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-primary to-accent text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  إضافة مشرف جديد
                </button>
              </div>

              {/* Add Admin Form */}
              {showAddAdmin && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground">إضافة مشرف جديد</h3>
                    <button onClick={() => setShowAddAdmin(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleAddAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">الاسم</label>
                        <input
                          type="text"
                          value={newAdmin.name}
                          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/50"
                          placeholder="أدخل اسم المشرف"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني</label>
                        <input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/50"
                          placeholder="example@mail.com"
                          dir="ltr"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">كلمة المرور</label>
                        <input
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/50"
                          placeholder="كلمة المرور (6 أحرف على الأقل)"
                          dir="ltr"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" className="flex-1 rounded-xl bg-gradient-to-l from-primary to-accent">
                        إضافة المشرف
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddAdmin(false)} className="rounded-xl">
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Admins List - Mobile Cards */}
              <div className="md:hidden space-y-4">
                {moderators.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-muted-foreground">
                    لا يوجد مساعدين بعد
                  </div>
                ) : (
                  moderators.map((admin) => (
                    <div key={admin.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">{admin.full_name?.charAt(0) || "?"}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{admin.full_name || "غير معروف"}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem
                              onClick={() => handleDeleteAdminClick(admin.user_id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف المساعد
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          <Shield className="w-3 h-3 inline ml-1" />
                          مساعد
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Admins List - Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {moderators.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    لا يوجد مساعدين بعد
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-100 text-sm font-medium text-muted-foreground">
                      <div className="col-span-4">المساعد</div>
                      <div className="col-span-4">البريد الإلكتروني</div>
                      <div className="col-span-3">الدور</div>
                      <div className="col-span-1">إجراءات</div>
                    </div>
                    {moderators.map((admin) => (
                      <div key={admin.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <span className="text-primary font-bold">{admin.full_name?.charAt(0) || "?"}</span>
                          </div>
                          <span className="font-medium text-foreground">{admin.full_name || "غير معروف"}</span>
                        </div>
                        <div className="col-span-4 text-muted-foreground text-sm">{admin.email}</div>
                        <div className="col-span-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                            مساعد
                          </span>
                        </div>
                        <div className="col-span-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem
                                onClick={() => handleDeleteAdminClick(admin.user_id)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف المساعد
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-muted-foreground">
                  لا توجد إشعارات
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`bg-white rounded-2xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md ${
                      notification.is_read ? "border-slate-100" : "border-primary/30 bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.type === "booking" ? "bg-blue-50 text-blue-600" :
                        notification.type === "review" ? "bg-amber-50 text-amber-600" :
                        notification.type === "reminder" ? "bg-purple-50 text-purple-600" :
                        "bg-emerald-50 text-emerald-600"
                      }`}>
                        {notification.type === "booking" && <Calendar className="w-6 h-6" />}
                        {notification.type === "review" && <Star className="w-6 h-6" />}
                        {notification.type === "reminder" && <Bell className="w-6 h-6" />}
                        {(!notification.type || notification.type === "message" || notification.type === "info") && <MessageSquare className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => markNotificationAsRead(notification.id)}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-semibold text-foreground">{notification.title}</p>
                          <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">{notification.message}</p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 mt-2 animate-pulse" />
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                        title="حذف الإشعار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-foreground mb-6">إعدادات الحساب</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">البريد الإلكتروني</p>
                        <p className="text-sm text-muted-foreground">{user?.email || "غير معروف"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">كلمة المرور</p>
                        <p className="text-sm text-muted-foreground">تغيير كلمة المرور الخاصة بك</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg"
                      onClick={() => setChangePasswordDialogOpen(true)}
                    >
                      تغيير
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-foreground mb-6">معلومات الحساب</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-foreground">نوع الحساب</p>
                      <p className="text-sm text-muted-foreground">{isAdmin ? "مدير" : "مستخدم"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
