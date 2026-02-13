import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export interface DashboardStats {
  todayVisits: number;
  totalBookings: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  averageRating: number;
  visitsTrend: string;
  bookingsTrend: string;
  reviewsTrend: string;
}

export interface Booking {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  booking_date: string;
  booking_time: string;
  status: string | null;
  notes: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  patient_name: string;
  rating: number;
  comment: string | null;
  status: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string | null;
  is_read: boolean | null;
  created_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  created_at: string;
}

export interface WeeklyVisits {
  day: string;
  visits: number;
}

export const useDashboardData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    todayVisits: 0,
    totalBookings: 0,
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    averageRating: 0,
    visitsTrend: "+0%",
    bookingsTrend: "+0%",
    reviewsTrend: "+0%",
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [weeklyVisits, setWeeklyVisits] = useState<WeeklyVisits[]>([]);

  const fetchStats = async () => {
    try {
      // Get today's date for visits count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Fetch today's visits
      const { count: todayVisitsCount } = await supabase
        .from("site_visits")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO);

      // Fetch total bookings
      const { count: bookingsCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

      // Fetch reviews stats
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("rating, status");

      const totalReviews = reviewsData?.length || 0;
      const pendingReviews = reviewsData?.filter((r) => r.status === "pending").length || 0;
      const approvedReviews = reviewsData?.filter((r) => r.status === "approved").length || 0;
      const averageRating =
        reviewsData && reviewsData.length > 0
          ? reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length
          : 0;

      setStats({
        todayVisits: todayVisitsCount || 0,
        totalBookings: bookingsCount || 0,
        totalReviews,
        pendingReviews,
        approvedReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        visitsTrend: "+12%",
        bookingsTrend: "+5%",
        reviewsTrend: "+8%",
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: true })
        .order("booking_time", { ascending: true })
        .limit(10);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .in("role", ["admin", "moderator"]);

      if (rolesError) throw rolesError;

      // Get profiles for these users
      const userIds = rolesData?.map((r) => r.user_id) || [];
      
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in("user_id", userIds);

        if (profilesError) throw profilesError;

        const adminsWithProfiles = rolesData?.map((role) => {
          const profile = profilesData?.find((p) => p.user_id === role.user_id);
          return {
            id: role.id,
            user_id: role.user_id,
            email: profile?.email || null,
            full_name: profile?.full_name || null,
            role: role.role,
            created_at: role.created_at,
          };
        }) || [];

        setAdmins(adminsWithProfiles);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchWeeklyVisits = async () => {
    try {
      const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
      const today = new Date();
      const dayOfWeek = today.getDay();
      
      const weeklyData: WeeklyVisits[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const { count } = await supabase
          .from("site_visits")
          .select("*", { count: "exact", head: true })
          .gte("created_at", date.toISOString())
          .lt("created_at", nextDate.toISOString());

        // Map JS day (0=Sunday) to Arabic day
        const jsDay = date.getDay();
        const arabicDayIndex = jsDay === 0 ? 1 : jsDay === 6 ? 0 : jsDay + 1;
        
        weeklyData.push({
          day: days[arabicDayIndex % 7],
          visits: count || 0,
        });
      }

      setWeeklyVisits(weeklyData);
    } catch (error) {
      console.error("Error fetching weekly visits:", error);
    }
  };

  const approveReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) {
        console.error("Error approving review:", error);
        throw error;
      }
      
      toast({ title: "تم نشر التقييم بنجاح" });
      // Refresh data immediately
      await Promise.all([fetchReviews(), fetchStats()]);
    } catch (error) {
      console.error("Approve review error:", error);
      toast({ title: "حدث خطأ في نشر التقييم", variant: "destructive" });
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) {
        console.error("Error deleting review:", error);
        throw error;
      }
      
      toast({ title: "تم حذف التقييم" });
      // Refresh data immediately
      await Promise.all([fetchReviews(), fetchStats()]);
    } catch (error) {
      console.error("Delete review error:", error);
      toast({ title: "حدث خطأ في حذف التقييم", variant: "destructive" });
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "تم حذف الإشعار" });
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({ title: "حدث خطأ في حذف الإشعار", variant: "destructive" });
    }
  };

  const addAdmin = async (email: string, name: string, password: string) => {
    try {
      // Call edge function to create moderator
      const { data, error } = await supabase.functions.invoke("invite-moderator", {
        body: { email, name, password },
      });

      if (error) {
        console.error("Error calling invite-moderator:", error);
        toast({
          title: "حدث خطأ",
          description: error.message || "فشل في إضافة المساعد",
          variant: "destructive",
        });
        return false;
      }

      if (data?.error) {
        toast({
          title: "خطأ",
          description: data.error,
          variant: "destructive",
        });
        return false;
      }

      toast({ 
        title: "تم إضافة المساعد بنجاح", 
        description: `تم إضافة ${name} كمساعد` 
      });
      await fetchAdmins();
      return true;
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({ title: "حدث خطأ في إضافة المساعد", variant: "destructive" });
      return false;
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .in("role", ["admin", "moderator"]);

      if (error) throw error;

      toast({ title: "تم إزالة المشرف بنجاح" });
      fetchAdmins();
      return true;
    } catch (error) {
      console.error("Error removing admin:", error);
      toast({ title: "حدث خطأ في إزالة المشرف", variant: "destructive" });
      return false;
    }
  };

  const refreshData = () => {
    fetchStats();
    fetchBookings();
    fetchReviews();
    fetchNotifications();
    fetchAdmins();
    fetchWeeklyVisits();
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchBookings(),
        fetchReviews(),
        fetchNotifications(),
        fetchAdmins(),
        fetchWeeklyVisits(),
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    loading,
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
    refreshData,
    unreadNotificationsCount: notifications.filter((n) => !n.is_read).length,
  };
};
