"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icons } from "@/components/ui/icons";
import { LoadingPage } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { cn } from "@/lib/helpers/utils";
import { useAccount } from "@/lib/hooks/use-account";

async function fetchSessions() {
  const response = await AppwriteService.listSessions();
  return response;
}

async function deleteSession(id: string) {
  const response = await AppwriteService.signOut(id);
  return response;
}

export function CardSessions() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const { signOut } = useAccount();

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

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
