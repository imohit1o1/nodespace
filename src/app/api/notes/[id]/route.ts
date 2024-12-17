import { currentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { noteSchema } from "@/schema/noteSchema";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update Note
export async function PUT(req: NextRequest) {
    const user = await currentUser();
    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get('id');

    // Check if noteId is null
    if (!noteId) {
        return NextResponse.json({ error: "Note ID is required." }, { status: 400 });
    }

    try {
        console.log("Note ID: ", noteId);

        // Fetch the note from the database
        const existingNote = await prisma.notes.findUnique({
            where: { id: noteId },
        });

        if (!existingNote) {
            return NextResponse.json({ error: "Note not found." }, { status: 404 });
        }

        if (existingNote.userId !== userId) {
            return NextResponse.json({ error: "Forbidden: You cannot update this note." }, { status: 403 });
        }

        const body = await req.json();
        const parsedData = noteSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsedData.error.errors },
                { status: 400 }
            );
        }

        const { title, content, isPinned, isFavorite, backgroundColor, textColor } = parsedData.data;

        // Update the note
        const updatedNote = await prisma.notes.update({
            where: { id: noteId }, // Prisma expects a string here
            data: {
                title,
                content,
                isPinned,
                isFavorite,
                backgroundColor,
                textColor,
            },
        });

        // Return the updated note as the response
        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
        console.log("Error updating note:", error);
        return NextResponse.json({ error: "An error occurred while updating the note." }, { status: 500 });
    }
}

// DELETE - Delete Note
export async function DELETE(req: NextRequest) {
    const user = await currentUser();
    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get('id');

    // Check if noteId is null
    if (!noteId) {
        return NextResponse.json({ error: "Note ID is required." }, { status: 400 });
    }
    console.log("Note ID: ", noteId);

    try {

        const existingNote = await prisma.notes.findUnique({
            where: { id: noteId }, // Prisma expects a string here
        });

        if (!existingNote) {
            return NextResponse.json({ error: "Note not found." }, { status: 404 });
        }

        if (existingNote.userId !== userId) {
            return NextResponse.json({ error: "Forbidden: You cannot delete this note." }, { status: 403 });
        }

        // Delete the note
        await prisma.notes.delete({
            where: { id: noteId }, // Prisma expects a string here
        });

        return NextResponse.json({ message: "Note deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ error: "An error occurred while deleting the note." }, { status: 500 });
    }
}
