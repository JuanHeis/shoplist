"use client";

import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
function Navbar() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <nav className="flex justify-center items-center py-5 border-b">
      <div className="w-full max-w-[800px] flex items-center justify-between">
        <Link href="/">
          <Button variant="link">Home</Button>
        </Link>

        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="flex gap-4 items-center  cursor-pointer relative pr-[40px] overflow-hidden">
                <p>{session.user.name}</p>
                <img
                  src={session.user.image ? session.user.image : ""}
                  alt=""
                  className="w-[40px] h-[40px] rounded-full absolute right-[-8px]"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <Link href="/dashboard" className="mouse-pointer">
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Button
                  className="w-full"
                  variant={"outline"}
                  onClick={async () => {
                    await signOut({
                      callbackUrl: "/",
                    });
                  }}
                >
                  Logout
                </Button>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => signIn()} variant={"outline"}>
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
