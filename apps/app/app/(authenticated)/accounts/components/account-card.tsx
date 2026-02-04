"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/design-system/components/ui/alert-dialog";
import {
  ArrowRightLeftIcon,
  GlobeIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
  TrashIcon,
  SparklesIcon,
} from "lucide-react";
import type { DigitalAccount, TrustedContact, ActionOnDeath } from "@repo/database";
import { AccountFormDialog } from "./account-form-dialog";
import { deleteAccount } from "@/app/actions/accounts/delete";

type AccountWithAccess = DigitalAccount & {
  accessList: { contact: TrustedContact }[];
};

type AccountCardProps = {
  account: AccountWithAccess;
  contacts: TrustedContact[];
};

const actionLabels: Record<ActionOnDeath, { label: string; icon: typeof TrashIcon; variant: "default" | "secondary" | "destructive" }> = {
  DELETE: { label: "Delete", icon: TrashIcon, variant: "destructive" },
  TRANSFER: { label: "Transfer", icon: ArrowRightLeftIcon, variant: "default" },
  MEMORIALIZE: { label: "Memorialize", icon: SparklesIcon, variant: "secondary" },
};

export function AccountCard({ account, contacts }: AccountCardProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const actionConfig = actionLabels[account.actionOnDeath];
  const ActionIcon = actionConfig.icon;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount(account.id);
      if ("error" in result) {
        console.error(result.error);
        return;
      }
      router.refresh();
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              {account.platformIcon ? (
                <img
                  src={account.platformIcon}
                  alt={account.platformName}
                  className="h-6 w-6"
                />
              ) : (
                <GlobeIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{account.platformName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {account.username || account.email || "No username"}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={actionConfig.variant}>
              <ActionIcon className="mr-1 h-3 w-3" />
              {actionConfig.label}
            </Badge>
          </div>

          {account.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {account.notes}
            </p>
          )}

          <div className="pt-2 border-t text-xs text-muted-foreground">
            Updated {new Date(account.updatedAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <AccountFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        contacts={contacts}
        account={account}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {account.platformName}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
