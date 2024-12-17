// "use client"
import React from "react";
import { Pin, EllipsisVertical, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NoteCardProps {
  title?: string;
  content?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
}

export default function NotesCard({
  title,
  content,
  isPinned,
  isFavorite,
  backgroundColor,
  textColor,
  createdAt,
}: NoteCardProps) {
  const handleMenuItemClick = () => {
    console.log("Menu item clicked");
  };
  return (
    <Card className={`flex flex-col gap-y-2 py-2 max-h-48 ${backgroundColor}`}>
      <CardHeader className="grid grid-cols-4">
        <CardTitle
          className={`col-span-2 truncate text-sm lg:text-md ${textColor}`}
        >
          {title}
        </CardTitle>
        <section className="col-span-2 justify-self-end flex gap-x-0.5">
          {/* Pinned icon */}
          {isPinned ? <Pin className="w-4 h-4 text-muted-foreground" /> : ""}

          {/* Favourite icon */}
          {isFavorite ? <Star className="w-4 h-4 text-muted-foreground" /> : ""}

          {/* Menu button */}
          <EllipsisVertical
            className="w-4 h-4 text-muted-foreground"
            onClick={handleMenuItemClick}
          />
        </section>
      </CardHeader>
      <CardContent className="h-36 max-h-36 overflow-hidden">
        <CardDescription className={`leading-snug ${textColor}`}>
          {content}
        </CardDescription>
      </CardContent>
      <CardFooter className="justify-end p-0">
        <p className="text-xs text-muted-foreground">
          {new Date(createdAt).toLocaleDateString("en-GB")}
        </p>
      </CardFooter>
    </Card>
  );
}
