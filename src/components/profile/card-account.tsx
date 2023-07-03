"use client";

import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";

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
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingPage } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";

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

export function CardAccount() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const [isEditing, setIsEditing] = useState(false);

  const extensionDetected = !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const { mutate: mutateDeleteAccount, isLoading: isDeleteAccountLoading } = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: deleteAccount,
    onSuccess: () => {
      window?.open(`${appwriteUrl}/`, target, "noopener,noreferrer");
    },
  });

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
      </>
    );

  return <LoadingPage />;
}
