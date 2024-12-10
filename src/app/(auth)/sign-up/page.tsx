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
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { signupSchema } from "@/schema/authSchema";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { ApiResponse } from "@/types/ApiResponse";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const res = await axios.get(
            `/api/check-username?username=${username}`
          );
          setUsernameMessage(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data?.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      console.log("Signup successful", response.status);

      if (response.status === 201) {
        // Auto-login using NextAuth's signIn
        const signInResponse = await signIn("credentials", {
          redirect: false,
          username: data.username,
          password: data.password,
        });

        if (signInResponse?.ok) {
          // Redirect to dashboard
          router.replace("/dashboard/user");
        } else {
          console.error("Auto-login failed");
        }
      }
      toast({
        title: "Signed Up Successfully",
        description: response.data.message,
      });

      router.replace("/dashboard/user");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:
          axiosError.response?.data?.message || "Email Adress already exists!!",
        description: "Please try with another email address",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 md:border border-primary/70 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Sign Up
          </h1>
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
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername ? (
                    <Loader2 className="animate-spin" />
                  ) : null}
                  <p
                    className={`text-xs ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="abc@example.com" {...field} />
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
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-6 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm mt-4">
          <p>
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary/90"
            >
              Sign in
            </Link>
          </p>
        </div>
        <Separator className="mt-10 mb-8 relative">
          <span className="absolute inset-x-2 -top-[11px] px-4 text-sm mx-auto w-max bg-background">
            or
          </span>
        </Separator>
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={() => signIn("google")}
          >
            <Loader2 className="mr-2 w-4 h-4" />
            Sign up with Google
          </Button>
        </div>
        <div className="text-center text-xs mt-6">
          <p>
            By signing up to create an account I accept
            <br />
            Company&apos;s{" "}
            <span className="text-primary hover:text-primary/90">
              Terms of Use and Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
