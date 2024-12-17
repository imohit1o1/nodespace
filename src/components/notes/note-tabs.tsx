"use client"
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NoteTabsProps {
  currentTab: string;
  handleTabChange: (tab: string) => void;
}

// Define the component first
const NoteTabs = ({ currentTab, handleTabChange }: NoteTabsProps) => {
  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pinned">Pinned</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default React.memo(NoteTabs);
