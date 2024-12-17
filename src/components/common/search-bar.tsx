"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="max-w-lg">
      <Input placeholder="Search notes..." />
    </div>
  );
}
