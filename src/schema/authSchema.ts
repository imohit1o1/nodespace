import { z } from "zod";

// username validation
export const usernameValidation = z
    .string()
    .toLowerCase()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(10, "Username must not be greater than 10 characters")
    .regex(/^[a-zA-z0-9_]+$/, "Username must not contain any special characters")

// Schema for login validation
export const signinSchema = z.object({
    username: z.string(),
    password: z.string(),
});


// Schema for signup validation
export const signupSchema = z.object({
    usernname: usernameValidation,
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must not be greater than 20 characters")
});
