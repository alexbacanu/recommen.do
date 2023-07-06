"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";

import { FormAccountDelete } from "@/components/profile/form-account-delete";
import { FormAccountEmail } from "@/components/profile/form-account-email";
import { FormAccountName } from "@/components/profile/form-account-name";
import { FormAccountPassword } from "@/components/profile/form-account-password";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { LoadingPage } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";

export function CardAccount() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const [isEditing, setIsEditing] = useState(false);

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
                <AvatarImage
                  src={AppwriteService.getAccountInitials(account?.name || account?.email).href}
                  alt={account.name || account.email}
                />
                <AvatarFallback>RE</AvatarFallback>
              </Avatar>

              <div className="max-w-[278px]">
                <p className="truncate text-sm font-medium leading-none">{account.name || "Unnamed user"}</p>
                <p className="truncate text-sm text-muted-foreground">{account.email}</p>
              </div>
            </div>

            {isEditing && (
              <TooltipProvider>
                <Tabs defaultValue="name">
                  <TabsList className="mb-2 grid w-full grid-cols-4 bg-transparent p-0">
                    <Tooltip>
                      <TooltipTrigger>
                        <TabsTrigger
                          value="name"
                          className="rounded-none border-b-2 border-transparent hover:border-b-2 hover:border-border data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                        >
                          Name
                        </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change your display name</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <TabsTrigger
                          value="password"
                          className="rounded-none border-b-2 border-transparent hover:border-b-2 hover:border-border data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                        >
                          Password
                        </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change your password</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <TabsTrigger
                          value="email"
                          disabled={account.passwordUpdate === ""}
                          className="rounded-none border-b-2 border-transparent hover:border-b-2 hover:border-border data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                        >
                          Email
                        </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        {account.passwordUpdate === "" ? (
                          <p>You need to create a password in order to change your email</p>
                        ) : (
                          <p>Change your email</p>
                        )}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <TabsTrigger
                          value="delete"
                          className="rounded-none border-b-2 border-transparent text-destructive hover:border-b-2 hover:border-border data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                        >
                          Delete
                        </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete your account</p>
                      </TooltipContent>
                    </Tooltip>
                  </TabsList>

                  <TabsContent value="name">
                    <FormAccountName account={account} />
                  </TabsContent>

                  <TabsContent value="password">
                    <FormAccountPassword account={account} />
                  </TabsContent>

                  <TabsContent value="email" className="space-y-4">
                    <FormAccountEmail />
                  </TabsContent>

                  <TabsContent value="delete">
                    <FormAccountDelete />
                  </TabsContent>
                </Tabs>
              </TooltipProvider>
            )}
          </div>
        </CardContent>

        <Separator orientation="horizontal" className="w-full" />
      </>
    );

  return <LoadingPage />;
}
