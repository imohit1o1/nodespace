"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { signinSchema } from "@/schema/authSchema";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    console.log("Data for submission" + data.username);

    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false, // prevents redirection to default URL
    });

    if (response?.error) {
      // handle error (invalid credentials)
      console.error("Sign-in error", response.error);
      toast({
        title: "Invalid credentials",
        // description: "Friday, February 10, 2023 at 5:57 PM",
      });
    } else {
      // successful sign-in
      console.log("User signed in successfully");
      toast({
        title: "Signed in Successfully",
        // description: "Friday, February 10, 2023 at 5:57 PM",
      });
      router.replace("/dashboard/user");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 md:border border-primary/70 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold lg:text-4xl">Hi There!</h1>
          <p className="text-xs mt-2">Welcome to NodeSpace</p>
        </div>

        {/* Sign Up Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-6 mt-2">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm mt-4">
          <p>
            Don't have an accouunt?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>
        </div>
        <Separator className="mt-10 mb-8 relative">
          <span className="absolute inset-x-2 -top-[11px] px-4 text-sm mx-auto w-max bg-background">
            or
          </span>
        </Separator>
        <div className="mt-4">
          <Button variant="outline" type="submit" className="w-full py-6">
            <Loader2 className="mr-2 w-4 h-4" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
