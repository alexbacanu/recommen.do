"use client";

import { useAtomValue } from "jotai";
import { CreditCard, LifeBuoy, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import LoadingSpinner from "~/components/ui/loading";
import { accountAtom, isLoadingAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

export function Profile() {
  const account = useAtomValue(accountAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const { signOut } = useAppwrite();

  return (
    <>
      {account ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">{account.name ? account.name : "Account"}</Button>
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
              <DropdownMenuItem asChild disabled>
                <Link className="space-x-2" href="#">
                  <CreditCard className="h-4 w-4" />
                  <span>Subscription</span>
                </Link>
                {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild disabled>
              <Link className="space-x-2" href="#">
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
        <Button variant="secondary" asChild>
          <Link className="space-x-2" href="https://pickassistant.authui.site/">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>"Login"</span>
              </>
            )}
          </Link>
        </Button>
      )}
    </>
  );
}
