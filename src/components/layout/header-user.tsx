"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { accountAtom } from "@/lib/atoms/auth";
import { useAccount } from "@/lib/hooks/use-account";

export function HeaderUser() {
  const { signOut } = useAccount();
  const account = useAtomValue(accountAtom);

  return account ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User dropdown menu">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src={avatar?.href} alt={account?.name} /> */}
            <AvatarFallback>
              <Icons.account className="h-5 w-5" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="line-clamp-1 text-sm font-medium leading-none">{account?.name}</p>
            <p className="line-clamp-1 text-xs leading-none text-muted-foreground">
              {account?.email ?? account?.phone}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" aria-label="Profile">
              <Icons.account className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/contact" aria-label="Support">
              <Icons.support className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()} aria-label="Log out">
          <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button variant="outline" asChild>
      <Link href="/sign-in" aria-label="Sign in">
        <Icons.login className="mr-2 h-4 w-4" aria-hidden="true" />
        Sign In
      </Link>
    </Button>
  );
}
