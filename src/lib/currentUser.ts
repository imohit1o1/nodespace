import { getSession } from "next-auth/react";

export const currentUser = async () => {
    const session = await getSession();
    if (!session || !session.user) {
        throw new Error("You do not have permission to access");
    }
    return session.user;
};
