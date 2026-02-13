"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import StarterCanvases from "@/components/valentines/starter-canvases";
import CanvasEditor from "@/components/valentines/canvas-editor";
import LoveNoteCard from "@/components/valentines/love-note-card";
import type { Template } from "@/components/valentines/starter-canvases";
import type { LoveNote } from "@/components/valentines/love-note-card";
import supabase from "@/utils/supabaseClient";

export default function LoveNotesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoadingNotes(true);

    try {
      const { data, error } = await supabase
        .from("love_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching love notes:", error.message);
      } else {
        setNotes(data ?? []);
      }
    } catch (error) {
      console.error("Unexpected error fetching love notes:", error);
    } finally {
      setLoadingNotes(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditorOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setEditorOpen(true);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from("love_notes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting love note:", error.message);
      } else {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Unexpected error deleting love note:", error);
    }
  };

  // Loading / auth gate
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto" />
          <p className="mt-4 text-rose-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 relative overflow-hidden">
      {/* Floating hearts background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="absolute top-10 left-10 w-16 h-16 text-rose-200 opacity-40 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute top-32 right-20 w-12 h-12 text-pink-200 opacity-30"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ animation: "pulse 3s ease-in-out infinite 1s" }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute bottom-40 left-1/4 w-20 h-20 text-red-200 opacity-20"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ animation: "pulse 4s ease-in-out infinite 0.5s" }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute top-1/2 right-10 w-10 h-10 text-rose-300 opacity-25 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute bottom-20 right-1/3 w-14 h-14 text-pink-300 opacity-20"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ animation: "pulse 3.5s ease-in-out infinite 2s" }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <Header />

      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            <h1 className="text-5xl font-serif text-rose-800 tracking-tight">
              Love Notes
            </h1>
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
          </div>
          <p className="text-rose-500 text-lg max-w-md mx-auto">
            Create beautiful Valentine&apos;s cards to share your love and
            appreciation.
          </p>
        </div>

        {/* Starter Templates */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif text-rose-700 mb-6 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-rose-300 rounded-full" />
            Choose a Template
            <span className="w-8 h-0.5 bg-rose-300 rounded-full" />
          </h2>
          <StarterCanvases
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
          />
        </section>

        {/* My Notes */}
        <section>
          <h2 className="text-2xl font-serif text-rose-700 mb-6 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-rose-300 rounded-full" />
            My Love Notes
            <span className="w-8 h-0.5 bg-rose-300 rounded-full" />
          </h2>

          {loadingNotes ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto" />
                <p className="mt-4 text-rose-400">
                  Loading your love notes...
                </p>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16 bg-white/40 rounded-2xl border border-rose-100">
              <Heart className="h-12 w-12 text-rose-300 mx-auto mb-4" />
              <p className="text-rose-500 text-lg font-medium">
                No love notes yet
              </p>
              <p className="text-rose-400 mt-1">
                Pick a template above or create one from scratch!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {notes.map((note) => (
                <LoveNoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Canvas Editor Dialog */}
      <CanvasEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        template={selectedTemplate}
        userId={user.id}
        onSaved={fetchNotes}
      />
    </div>
  );
}
