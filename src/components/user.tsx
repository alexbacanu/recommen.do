"use client";

import { LifeBuoy, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authuiSite } from "@/lib/envClient";
import { useAppwrite } from "@/lib/helpers/use-appwrite";
import { useAccount } from "@/lib/hooks/use-account";

export function Profile() {
  const account = useAccount();

  const { signOut } = useAppwrite();

  return (
    <>
      {account ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{account.name ? account.name : "Account"}</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel className="text-xs">{account?.email}</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link className="space-x-2" href="/profile">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild disabled>
                <Link className="space-x-2" href="#">
                  <CreditCard className="h-4 w-4" />
                  <span>Subscription</span>
                </Link>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link className="space-x-2" href="/contact">
                <LifeBuoy className="h-4 w-4" />
                <span>Support</span>
              </Link>
              {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => signOut()} asChild>
              <Link className="space-x-2" href="#">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Link>
              {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link className={buttonVariants({ variant: "outline", className: "space-x-2" })} href={authuiSite}>
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </Link>
      )}
    </>
  );
}
