import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import ConfirmDialog from "@/components/ConfirmDialog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      const t = window.setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 300);
      return () => window.clearTimeout(t);
    }
    fetchNotes();
  }, [user, authLoading, navigate]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({ title: "حدث خطأ في جلب الملاحظات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({ title: "يرجى إدخال عنوان الملاحظة", variant: "destructive" });
      return;
    }

    try {
      if (editingNote) {
        const { error } = await supabase
          .from("notes")
          .update({
            title: formData.title,
            content: formData.content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingNote.id);

        if (error) throw error;
        toast({ title: "تم تحديث الملاحظة بنجاح" });
      } else {
        const { error } = await supabase.from("notes").insert({
          title: formData.title,
          content: formData.content,
          user_id: user?.id,
        });

        if (error) throw error;
        toast({ title: "تم إضافة الملاحظة بنجاح" });
      }

      setShowForm(false);
      setEditingNote(null);
      setFormData({ title: "", content: "" });
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      toast({ title: "حدث خطأ في حفظ الملاحظة", variant: "destructive" });
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteToDelete);
      if (error) throw error;
      toast({ title: "تم حذف الملاحظة" });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({ title: "حدث خطأ في حذف الملاحظة", variant: "destructive" });
    } finally {
      setNoteToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy - h:mm a", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
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
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="حذف الملاحظة"
        description="هل أنت متأكد من حذف هذه الملاحظة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowRight className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">الملاحظات</h1>
                <p className="text-sm text-muted-foreground">إدارة ملاحظاتك الخاصة</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingNote(null);
              setFormData({ title: "", content: "" });
              setShowForm(true);
            }}
            className="rounded-xl bg-gradient-to-l from-primary to-accent"
          >
            <Plus className="w-5 h-5 ml-2" />
            ملاحظة جديدة
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث في الملاحظات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">
                {editingNote ? "تعديل الملاحظة" : "ملاحظة جديدة"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingNote(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">العنوان</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/50"
                  placeholder="عنوان الملاحظة"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">المحتوى</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/50 min-h-[200px] resize-none"
                  placeholder="محتوى الملاحظة..."
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 rounded-xl bg-gradient-to-l from-primary to-accent">
                  <Save className="w-4 h-4 ml-2" />
                  {editingNote ? "حفظ التغييرات" : "إضافة الملاحظة"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNote(null);
                  }}
                  className="rounded-xl"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "لا توجد نتائج للبحث" : "لا توجد ملاحظات بعد"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground line-clamp-1">{note.title}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note.id)}
                      className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {note.content || "لا يوجد محتوى"}
                </p>
                <p className="text-xs text-slate-400">{formatDate(note.updated_at)}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
