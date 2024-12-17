"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import NotesCard from "@/components/notes/note-card";
import { toast } from "@/hooks/use-toast";
import Note from "@/types/interfaces";

interface NotesListProps {
  currentTab: string;
}
export default function NotesList({ currentTab }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`/api/notes?tab=${currentTab}`);
        setNotes(response.data.notes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast({ title: "Error fetching notes" });
      }
    };
    fetchNotes();
  }, [currentTab]);

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 overflow-hidden">
      {notes.length > 0 ? (
        notes.map((note) => <NotesCard key={note.id} {...note} />)
      ) : (
        <p>No notes available.</p>
      )}
    </section>
  );
}
