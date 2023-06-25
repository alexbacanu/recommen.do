"use client";

import { LifeBuoy, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { navConfig } from "@/lib/config/navigation";
import { authuiSite } from "@/lib/envClient";
import { useAccount } from "@/lib/hooks/use-account";

export function Header() {
  const { account, avatar, signOut } = useAccount();

  return (
    <header className="z-10 flex h-20 items-center border-b border-border bg-card text-sm">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between gap-y-4 p-4 lg:py-0">
          <Logo />

          <div className="flex items-center">
            <nav className="hidden gap-x-6 font-medium sm:flex">
              {navConfig.header.map((item, index) => (
                <Link
                  href={item.disabled ? "#" : item.href}
                  key={index}
                  className="transition-colors hover:text-indigo-500"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <Separator orientation="vertical" className="mx-4 hidden h-5 sm:block" />

            {account ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatar?.href} alt={account?.name} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
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
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/contact">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                        {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" asChild>
                <Link href={authuiSite}>
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-transparent">
                      <LogIn className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
