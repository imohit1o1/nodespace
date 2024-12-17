import { auth } from "@/config/auth";

export const currentUser = async () => {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("You do not have permission to access");
    }
    return session.user;
};
