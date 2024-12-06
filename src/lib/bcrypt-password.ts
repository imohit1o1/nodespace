import bcrypt from "bcryptjs";

// Function to hash a password
export async function hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
}

// Function to verify a password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}
