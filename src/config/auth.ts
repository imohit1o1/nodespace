import NextAuth from "next-auth"
import authConfig from "@/config/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/sign-in",
        signOut: "/sign-out"
    },
    theme: {
        logo: "/logo.png"
    },
    ...authConfig,

})