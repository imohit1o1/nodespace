import { currentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { noteSchema } from "@/schema/noteSchema";
import { NextRequest, NextResponse } from "next/server";

interface NotesFilter {
    userId: string;
    isPinned?: boolean;
    isFavorite?: boolean;
}

export async function GET(req: NextRequest) {
    const user = await currentUser();
    const userId = user.id;

    const { searchParams } = new URL(req.url);
    const queryTab = searchParams.get("tab") || "all";

    // Filter based on tab
    const filter: NotesFilter = { userId };
    if (queryTab === "pinned") {
        filter.isPinned = true;
    } else if (queryTab === "favorites") {
        filter.isFavorite = true;
    }

    try {
        const notes = await prisma.notes.findMany({
            where: filter,
            orderBy: [
                { isPinned: "desc" },
                { createdAt: "desc" },
            ]
        });

        // Count of all notes
        const totalNotes = await prisma.notes.count({
            where: { userId },
        });

        // Count of pinned notes
        const totalPinnedNotes = await prisma.notes.count({
            where: { userId, isPinned: true },
        });

        // Count of favorite notes
        const totalFavoriteNotes = await prisma.notes.count({
            where: { userId, isFavorite: true },
        });

        return NextResponse.json({
            notes,
            totalNotes,
            totalPinnedNotes,
            totalFavoriteNotes
        });
    } catch (error) {
        console.log("Error fetching notes:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching notes." },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const user = await currentUser();
    const userId = user.id;

    try {
        const body = await req.json();
        const parsedData = noteSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsedData.error.errors },
                { status: 400 }
            );
        }

        const { title, content, isPinned, isFavorite, backgroundColor, textColor } = parsedData.data;

        // Explicitly fallback undefined fields to null or empty string
        const newNote = await prisma.notes.create({
            data: {
                userId,
                title,
                content,
                isPinned,
                isFavorite,
                backgroundColor,
                textColor,
            },
        });

        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json(
            { error: "An error occurred while creating the note." },
            { status: 500 }
        );
    }
}

