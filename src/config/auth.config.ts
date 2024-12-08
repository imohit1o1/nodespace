import { prisma } from "@/lib/prisma";
import { signinSchema } from "@/schema/authSchema";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/bcrypt-password";
import { User } from "next-auth";

export default {
    providers: [
        Credentials({
            name: "Credentials",
            async authorize(credentials): Promise<User | null> {
                try {
                    console.log(
                        "Authorize function called with credentials:",
                        credentials
                    );
                    // Validate credentials using zod
                    const parsedCredentials = signinSchema.parse(credentials);

                    // Destructure validated data
                    const { username, password } = parsedCredentials;
                    console.log("Pass 1 checked ");
                    //Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { username },
                    });

                    if (!existingUser) {
                        console.log("No user found");
                        throw { error: "No user found", status: 401 };
                    }

                    console.log("Pass 2 Checked");
                    console.log(existingUser);
                    // Verify the password
                    if (!existingUser.password) {
                        throw new Error("Invalid user data");
                    }
                    const isPasswordValid = await verifyPassword(password, existingUser.password);

                    if (!isPasswordValid) {
                        throw new Error("Incorrect Password");
                    }
                    console.log("Pass 3 Checked");
                    const user: User = {
                        id: existingUser.id,
                        name: existingUser.name,
                        username: existingUser.username,
                        email: existingUser.email,
                        image: existingUser.image,
                        role: existingUser.role,
                    };


                    // Return the user object
                    console.log(user);
                    return user;
                } catch (error) {
                    console.log("aLL Failed");
                    console.log(error);
                    throw { error: "Something went wrong", status: 401 };
                }
            },
        }),
        Google
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log("JWT callback", { token, user });
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.username = user.username;
                token.email = user.email;
                token.image = user.image;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            console.log("Session callback", { session, token });
            if (session.user && token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.role = token.role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;