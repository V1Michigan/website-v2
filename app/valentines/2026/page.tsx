"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, Mail } from "lucide-react";
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

  const [sentNotes, setSentNotes] = useState<LoveNote[]>([]);
  const [receivedNotes, setReceivedNotes] = useState<LoveNote[]>([]);
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

  // Fetch sent and received notes in parallel
  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoadingNotes(true);

    const email = user.email?.toLowerCase();

    try {
      const [sentResult, receivedResult] = await Promise.all([
        supabase
          .from("love_notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("love_notes")
          .select("*")
          .eq("recipient_email", email)
          .order("created_at", { ascending: false }),
      ]);

      if (sentResult.error) {
        console.error("Error fetching sent notes:", sentResult.error.message);
      } else {
        setSentNotes(sentResult.data ?? []);
      }

      if (receivedResult.error) {
        console.error(
          "Error fetching received notes:",
          receivedResult.error.message
        );
      } else {
        setReceivedNotes(receivedResult.data ?? []);
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
        setSentNotes((prev) => prev.filter((n) => n.id !== id));
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

  const senderName =
    user.user_metadata?.full_name || user.email || "Someone special";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            <h1 className="text-5xl font-serif text-rose-800 tracking-tight">
              Valentine's Notes
            </h1>
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
          </div>
          <p className="text-rose-500 text-lg max-w-md mx-auto">
            Create beautiful Valentine&apos;s cards to share your love and
            appreciation.
          </p>
        </div>

        {/* Received Notes */}
        {receivedNotes.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-rose-700 mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-rose-300 rounded-full" />
              <Mail className="h-5 w-5" />
              Notes For You
              <span className="w-8 h-0.5 bg-rose-300 rounded-full" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {receivedNotes.map((note) => (
                <LoveNoteCard key={note.id} note={note} />
              ))}
            </div>
          </section>
        )}

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

        {/* Sent Notes */}
        <section>
          <h2 className="text-2xl font-serif text-rose-700 mb-6 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-rose-300 rounded-full" />
            My Sent Notes
            <span className="w-8 h-0.5 bg-rose-300 rounded-full" />
          </h2>

          {loadingNotes ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto" />
                <p className="mt-4 text-rose-400">
                  Loading your Valentine's notes...
                </p>
              </div>
            </div>
          ) : sentNotes.length === 0 ? (
            <div className="text-center py-16 bg-white/40 rounded-2xl border border-rose-100">
              <Heart className="h-12 w-12 text-rose-300 mx-auto mb-4" />
              <p className="text-rose-500 text-lg font-medium">
                No valentine's notes sent yet
              </p>
              <p className="text-rose-400 mt-1">
                Pick a template above or create one from scratch!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sentNotes.map((note) => (
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
        senderName={senderName}
        onSaved={fetchNotes}
      />
    </div>
  );
}
