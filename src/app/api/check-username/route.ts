import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { usernameValidation } from "@/schema/authSchema";

// Zod schema for username validation
const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const queryParam = {
            username: searchParams.get("username"),
        };

        console.log("Received query params:", queryParam);

        // Validate query parameters with zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        // Check if the username exists in the database
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is taken",
                },
                { status: 400 }
            );
        }
        console.log("Username is unique:", username);
        return NextResponse.json(
            {
                success: true,
                message: "Username is unique",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking username", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error checking username",
            },
            { status: 500 }
        );
    }
}
