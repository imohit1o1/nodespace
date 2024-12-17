"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface NoteCounts {
  totalNotes: number;
  totalPinnedNotes: number;
  totalFavoriteNotes: number;
}
export default function UserHomePage() {
  const [noteCounts, setNoteCounts] = useState<NoteCounts>({
    totalNotes: 0,
    totalPinnedNotes: 0,
    totalFavoriteNotes: 0,
  });

  useEffect(() => {
    async function fetchNotes() {
      const response = await axios.get("/api/notes");
      if (response.data) {
        setNoteCounts({
          totalNotes: response.data.totalNotes || 0,
          totalPinnedNotes: response.data.totalPinnedNotes || 0,
          totalFavoriteNotes: response.data.totalFavoriteNotes || 0,
        });
      }
    }
    fetchNotes();
  }, []);
  return (
    <>
      USER DASHBOARD
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <div className="col-span-2 aspect-video rounded-xl bg-muted/50 p-4">
          WELCOME
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col justify-between">
          <h1 className="font-semibold">No.of Notes</h1>
          <div className="px-4 grid grid-cols-4 justify-between">
            <div className="col-span-2">
              <p>Total Notes</p>
              <p>Pinned Notes</p>
              <p>Favorite Notes</p>
              <p>Total Folders</p>
            </div>
            <div className="text-end font-semibold">
              <p>:</p>
              <p>:</p>
              <p>:</p>
              <p>:</p>
            </div>
            <div className="col-span-1 text-end">
              <p>{noteCounts.totalNotes}</p>
              <p>{noteCounts.totalPinnedNotes}</p>
              <p>{noteCounts.totalFavoriteNotes}</p>
              <p>{noteCounts.totalFavoriteNotes}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
    </>
  );
}
