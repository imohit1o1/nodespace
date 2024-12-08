"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Home() {
  const user = useCurrentUser();

  // Get the first letter of the user's name or username
  const userInitial =
    user?.name?.[0].toUpperCase() || user?.username?.[0].toUpperCase() || "N";

  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
      <h1 className="text-xl">NodeSpace</h1>
      <div className="flex gap-4 items-center">
        <ThemeModeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  {user.image ? (
                    <AvatarImage
                      src={user.image}
                      alt={user.name || user.username}
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {userInitial}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    {user.image ? (
                      <AvatarImage
                        src={user.image}
                        alt={user.name || user.username}
                      />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        {userInitial}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.name || user.username}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                <Button
                  variant="ghost"
                  className="bg-transparent hover:bg-transparent"
                  onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                >
                  Log out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/sign-in">
            <Button className="">Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
