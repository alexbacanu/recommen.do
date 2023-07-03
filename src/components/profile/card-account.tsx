"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingPage } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { cn } from "@/lib/helpers/utils";
import { useAccount } from "@/lib/hooks/use-account";

async function deleteAccount() {
  const jwt = await AppwriteService.createJWT();

  const response = await fetch(`${appwriteUrl}/api/appwrite/delete`, {
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
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const extensionDetected = !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const { mutate: mutateDeleteAccount, isLoading: isDeleteAccountLoading } = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: deleteAccount,
    onSuccess: () => {
      window?.open(`${appwriteUrl}/`, target, "noopener,noreferrer");
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
    if (data?.total === 1) {
      setIsOpen(false);
    }
  }, [data]);

  if (account && profile)
    return (
      <>
        <CardHeader>
          <CardTitle className="flex justify-between text-2xl">
            <span>Account</span>
            <Button variant="ghost" size="sm" aria-label="Edit profile" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? (
                <Icons.undo className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Icons.edit className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="flex flex-col justify-between gap-4">
            <div className="flex items-center gap-x-4">
              <Avatar>
                <AvatarImage src={AppwriteService.getAccountInitials(account.name).href} alt={account.name} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium leading-none">{account.name || "Unnamed user"}</p>
                <p className="text-sm text-muted-foreground">{account.email}</p>
              </div>
            </div>

            {isEditing && (
              <Tabs defaultValue="name">
                <TabsList className="mb-2 grid w-full grid-cols-4 bg-transparent p-0">
                  <TabsTrigger
                    value="name"
                    className="rounded-none border-b-2 border-transparent hover:border-b-2 hover:border-border data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                  >
                    Name
                  </TabsTrigger>

                  <TabsTrigger
                    value="password"
                    className="rounded-none border-b-2 border-transparent hover:border-b-2 hover:border-border data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                  >
                    Password
                  </TabsTrigger>

                  <TabsTrigger
                    value="email"
                    className="rounded-none border-b-2 border-transparent hover:border-b-2 hover:border-border data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                  >
                    Email
                  </TabsTrigger>

                  <TabsTrigger
                    value="delete"
                    className="rounded-none border-b-2 border-transparent text-destructive hover:border-b-2 hover:border-border data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                  >
                    Delete
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="name" className="space-y-4">
                  <CardHeader className="lg:p-0">
                    <CardTitle>Display name</CardTitle>
                    <CardDescription>
                      Make changes to your account here and click save when you are done.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2 lg:p-0">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue={account.name} />
                    </div>
                  </CardContent>

                  <CardFooter className="grid lg:p-0">
                    <Button>Save changes</Button>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="password" className="space-y-4">
                  <CardHeader className="lg:p-0">
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>Change your password here. After saving, you will be logged out.</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2 lg:p-0">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>

                  <CardFooter className="grid lg:p-0">
                    <Button>Save password</Button>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                  <CardHeader className="lg:p-0">
                    <CardTitle>Change email</CardTitle>
                    <CardDescription>Change your email here. After saving, you will be logged out.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 lg:p-0">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current email</Label>
                      <Input id="current" type="email" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New email</Label>
                      <Input id="new" type="email" />
                    </div>
                  </CardContent>
                  <CardFooter className="grid lg:p-0">
                    <Button>Save email</Button>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="delete" className="space-y-4">
                  <CardHeader className="lg:p-0">
                    <CardTitle>Delete account</CardTitle>
                    <CardDescription>
                      Delete your account here. After deleting, your subsciptions will be canceled imediatelly.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="grid lg:p-0">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" aria-label="Delete account">
                          <Icons.trash className="mr-2 h-4 w-4 text-destructive" aria-hidden="true" />
                          <span>Delete account</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            By clicking <span className="font-semibold text-destructive">Yes, delete my account</span>{" "}
                            you hereby forfeit all your remaining recommendations and cancel your subscription if one is
                            active. These changes will take immediate effect and are irreversible. If you wish to keep
                            your account active use the <span className="font-semibold">Keep my account active</span>{" "}
                            button below.
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
                  </CardFooter>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>

        <Separator orientation="horizontal" className="w-full" />

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader>
            <CardTitle className="flex justify-between text-2xl">
              <span>Sessions</span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Toggle sessions">
                  {isOpen ? (
                    <Icons.collapseUp className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Icons.collapseDown className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="grid gap-y-2">
              {data &&
                data.sessions
                  .sort((a) => (a.current ? -1 : 1))
                  .slice(0, 1)
                  .map((session) => (
                    <div
                      key={session.$id}
                      className="flex items-center justify-between rounded-lg border bg-popover p-2 font-mono text-sm"
                    >
                      <div className={cn("line-clamp-1", isOpen && "line-clamp-2 leading-7")}>
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
                      className="flex items-center justify-between rounded-lg border bg-popover p-2 font-mono text-sm"
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
            </div>
          </CardContent>

          <CardFooter className="grid">
            <Button onClick={() => signOut()} aria-label="Log out">
              <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Log out</span>
            </Button>
          </CardFooter>
        </Collapsible>

        <Separator orientation="horizontal" className="w-full" />
      </>
    );

  return <LoadingPage />;
}
