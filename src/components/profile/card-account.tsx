"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { useAccount } from "@/lib/hooks/use-account";

async function deleteAccount() {
  const jwt = await AppwriteService.createJWT();

  const response = await fetch("/api/appwrite/delete", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const account = response.json();
  return account;
}

async function fetchSessions() {
  const response = await AppwriteService.listSessions();
  return response;
}

async function deleteSession(id: string) {
  const response = await AppwriteService.signOut(id);
  return response;
}

export function CardAccount() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const { signOut } = useAccount();

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const extensionDetected = !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const { mutate: mutateDeleteAccount, isLoading: isDeleteAccountLoading } = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: deleteAccount,
    onSuccess: () => {
      window?.open(``, target, "noopener,noreferrer");
    },
  });

  const { mutate: mutateDeleteSession, isLoading: isDeleteSessionLoading } = useMutation({
    mutationKey: ["deleteSession"],
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchSessions"] });
    },
  });

  const { data } = useQuery({
    queryKey: ["fetchSessions"],
    queryFn: () => fetchSessions(),
    enabled: !!profile,
  });

  useEffect(() => {
    if (account === false || profile === false) {
      redirect("/sign-in"); // replace with window.something
    }
  }, [account, profile]);

  if (account && profile)
    return (
      <div>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pb-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              {/* <Avatar>
                <AvatarFallback>{account.name || "U"}</AvatarFallback>
              </Avatar> */}
              <div>
                <p className="text-sm font-medium leading-none">{account.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{account.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" aria-label="Change email">
                <Icons.edit className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Change email</span>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" aria-label="Delete account">
                    <Icons.trash className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      By clicking <span className="font-semibold text-destructive">Yes, delete my account</span> you
                      hereby forfeit all your remaining recommendations and cancel your subscription if one is active.
                      These changes will take immediate effect and are irreversible. If you wish to keep your account
                      active use the <span className="font-semibold">Keep my account active</span> button below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="justify-between">
                    <AlertDialogCancel>Keep my account active</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      className="whitespace-nowrap"
                      aria-label="Yes, delete my account"
                      onClick={() => mutateDeleteAccount()}
                      disabled={isDeleteAccountLoading}
                    >
                      Yes, delete my account
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
              {data && data.total > 1 && (
                <div className="flex items-center justify-between">
                  <Label className="flex flex-col space-y-1">
                    <span>Sessions</span>
                  </Label>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="Toggle sessions">
                      {isOpen ? (
                        <Icons.collapseUp className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Icons.collapseDown className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              )}
              {data &&
                data.sessions
                  .sort((a) => (a.current ? -1 : 1))
                  .slice(0, 1)
                  .map((session) => (
                    <div
                      key={session.$id}
                      className="flex items-center justify-between rounded-md border px-4 py-2 font-mono text-sm shadow-sm"
                    >
                      <div>
                        {session.current && (
                          <Badge variant="outline" className="mr-2 border-lime-400">
                            Current
                          </Badge>
                        )}
                        {session.clientName} {session.clientVersion} on {session.osName} {session.osVersion}
                      </div>
                      {!session.current && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete session"
                          className="h-5 w-5 bg-transparent text-destructive hover:text-destructive"
                          onClick={() => mutateDeleteSession(session.$id)}
                          disabled={isDeleteSessionLoading}
                        >
                          <Icons.remove className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  ))}
              <CollapsibleContent className="space-y-2">
                {data?.sessions
                  .sort((a) => (a.current ? -1 : 1))
                  .slice(1)
                  .map((session) => (
                    <div
                      key={session.$id}
                      className="flex items-center justify-between rounded-md border px-4 py-2 font-mono text-sm shadow-sm"
                    >
                      <div>
                        {session.current && (
                          <Badge variant="outline" className="mr-2 border-lime-400">
                            Current
                          </Badge>
                        )}
                        {session.clientName} {session.clientVersion} on {session.osName} {session.osVersion}
                      </div>
                      {!session.current && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete session"
                          className="h-5 w-5 bg-transparent text-destructive hover:text-destructive"
                          onClick={() => mutateDeleteSession(session.$id)}
                          disabled={isDeleteSessionLoading}
                        >
                          <Icons.remove className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
        <CardFooter className="grid">
          <Button onClick={() => signOut()} aria-label="Log out">
            <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Log out</span>
          </Button>
        </CardFooter>
      </div>
    );

  return null;
}
