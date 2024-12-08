import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    console.log("Middleware triggered!");
    console.log("Request in middleware:", request.method, request.url);


    const url = request.nextUrl.clone();
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });
    console.log("Token in Middleware:", token);

    // If user is authenticated
    if (token && token.role) {
        const role = token.role;

        // Redirect authenticated users from sign-in or sign-up to their dashboards
        if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
            url.pathname = role === "admin" ? "/dashboard/admin" : "/dashboard/user";
            return NextResponse.redirect(url);
        }

        // Restrict access to dashboards based on roles
        if (url.pathname.startsWith("/dashboard/admin") && role !== "admin") {
            url.pathname = "/dashboard/user";
            return NextResponse.redirect(url);
        }
        if (url.pathname.startsWith("/dashboard/user") && role === "admin") {
            url.pathname = "/dashboard/admin";
            return NextResponse.redirect(url);
        }
    } else {
        // Redirect unauthenticated users trying to access dashboard
        if (url.pathname.startsWith("/dashboard")) {
            url.pathname = "/sign-in";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next(); // Allow request to proceed if no conditions match
}

export const config = {
    matcher: ["/sign-in", "/sign-up", "/dashboard/:path*"],
};
