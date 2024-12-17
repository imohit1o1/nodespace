"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import NoteTabs from "@/components/notes/note-tabs";
import NotesList from "@/components/notes/note-list";
import NoteForm from "@/components/common/note-form";

export default function NotesHomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("all"); // Default tab

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    router.push(`?${newParams.toString()}`); // Update URL
  };

  return (
    <main className="flex flex-col gap-4 rounded-xl relative p-2">
      <section className="flex justify-between items-center">
        <NoteTabs currentTab={currentTab} handleTabChange={handleTabChange} />
      </section>

      <NotesList currentTab={currentTab} />

      <Button
        aria-label="Create a new note"
        variant="noteCreateButton"
        size="noteCreateButton"
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-90"
      >
        <Plus />
      </Button>

      <NoteForm isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </main>
  );
}
