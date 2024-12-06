import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id?: string;
        name?: string;
        username?: string;
        email?: string;
        role?: string;
    }

    interface Session {
        // user: User & DefaultSession["user"];
        user: AdapterUser & {
            id?: string;
            name?: string;
            username?: string;
            email?: string;
            role?: string;
        } & DefaultSession["user"];
    }
    interface JWT {
        id?: string;
        name?: string;
        username?: string;
        email?: string;
        role?: string;
    }
}