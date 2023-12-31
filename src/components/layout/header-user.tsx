"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { useAccount } from "@/lib/hooks/use-account";

export function HeaderUser() {
  const { signOut } = useAccount();
  const account = useAtomValue(accountAtom);

  return account ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User dropdown menu">
          <Avatar className="h-8 w-8">
            {!!account?.name ? (
              <AvatarImage src={AppwriteService.getAccountInitials(account?.name).href} alt={account.name} />
            ) : (
              <AvatarImage src={AppwriteService.getAccountInitials(account?.email).href} alt={account.email} />
            )}

            <AvatarFallback>
              <Icons.account className="h-5 w-5" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {!account.emailVerification && (
          <>
            <DropdownMenuLabel className="font-normal">
              <Badge variant="outline" className="w-full border-orange-500 text-orange-500">
                <Icons.alert className="mr-2 h-3 w-3" aria-hidden="true" />
                Your email is not verified
              </Badge>
            </DropdownMenuLabel>
          </>
        )}
        <DropdownMenuLabel className="font-normal">
          <div className="space-y-0.5">
            <p className="line-clamp-1 text-sm font-medium">{account.name}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">{account.email ?? account.phone}</p>
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

        <DropdownMenuItem onSelect={() => void signOut()} aria-label="Sign out">
          <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button variant="outline" asChild>
      <Link href="/sign-in" aria-label="Sign in">
        <Icons.login className="mr-2 h-4 w-4" aria-hidden="true" />
        Sign in
      </Link>
    </Button>
  );
}
