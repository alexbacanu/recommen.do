"use client";

import { useMutation } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";

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
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { useAccount } from "@/lib/hooks/use-account";

export function FormAccountDelete() {
  const { toast } = useToast();
  const { signOut } = useAccount();

  // 0. Define your mutation.
  const { mutate, isLoading } = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: async () => {
      const jwt = await AppwriteService.createJWT();

      await fetch(`${appwriteUrl}/api/appwrite/delete`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    },
    onSuccess: () => {
      toast({
        description: "Account successfully deleted.",
      });
      // toast.success("Account successfully deleted.");
      signOut();
    },
    onError: async (error) => {
      if (error instanceof AppwriteException) {
        toast({
          description: error.message,
        });
        // toast.error(error.message);
      }

      if (error instanceof Error) {
        toast({
          description: error.message,
        });
        // toast.error(error.message);
      }

      console.error(error);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="grid">
          <Button variant="outline" aria-label="Delete account">
            <Icons.trash className="mr-2 h-4 w-4 text-destructive" aria-hidden="true" />
            <span>Delete account</span>
          </Button>
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            By clicking <span className="font-semibold text-destructive">Yes, delete my account</span> you hereby
            forfeit all your remaining recommendations and cancel your subscription if one is active. These changes will
            take immediate effect and are irreversible. If you wish to keep your account active use the{" "}
            <span className="font-semibold">Keep my account active</span> button below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="justify-between">
          <AlertDialogCancel>Keep my account active</AlertDialogCancel>
          <Button
            variant="destructive"
            className="whitespace-nowrap"
            aria-label="Yes, delete my account"
            onClick={() => mutate()}
            disabled={isLoading}
          >
            Yes, delete my account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
