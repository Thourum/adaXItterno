"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
  MailIcon,
  MoreVerticalIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  ShieldIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { TrustedContact, RelationshipType, ContactRole } from "@repo/database";
import { ContactFormDialog } from "./contact-form-dialog";
import { deleteContact } from "@/app/actions/contacts/delete";
import { useRouter } from "next/navigation";

type ContactWithCount = TrustedContact & {
  _count: {
    documentAccess: number;
    mediaFolderAccess: number;
    accountAccess: number;
  };
};

type ContactsListProps = {
  contacts: ContactWithCount[];
};

const relationshipLabels: Record<RelationshipType, string> = {
  FAMILY: "Family",
  FRIEND: "Friend",
  COWORKER: "Coworker",
  LEGAL: "Legal",
  OTHER: "Other",
};

const roleLabels: Record<ContactRole, { label: string; variant: "default" | "secondary" }> = {
  EXECUTOR: { label: "Executor", variant: "default" },
  RECIPIENT: { label: "Recipient", variant: "secondary" },
};

export function ContactsList({ contacts }: ContactsListProps) {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactWithCount | null>(null);
  const [deletingContact, setDeletingContact] = useState<ContactWithCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingContact) return;

    setIsDeleting(true);
    try {
      const result = await deleteContact(deletingContact.id);
      if ("error" in result) {
        console.error(result.error);
        return;
      }
      router.refresh();
    } finally {
      setIsDeleting(false);
      setDeletingContact(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Trusted Contacts</h2>
          <p className="text-sm text-muted-foreground">
            People who will have access to your digital legacy
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No trusted contacts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add people you trust to manage your digital legacy
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{contact.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {relationshipLabels[contact.relationship]}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingContact(contact)}>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeletingContact(contact)}
                    >
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={roleLabels[contact.role].variant}>
                    <ShieldIcon className="mr-1 h-3 w-3" />
                    {roleLabels[contact.role].label}
                  </Badge>
                </div>

                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MailIcon className="h-4 w-4" />
                    {contact.email}
                  </div>
                )}

                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PhoneIcon className="h-4 w-4" />
                    {contact.phone}
                  </div>
                )}

                <div className="pt-2 border-t text-xs text-muted-foreground">
                  Access to: {contact._count.documentAccess} documents,{" "}
                  {contact._count.mediaFolderAccess} folders,{" "}
                  {contact._count.accountAccess} accounts
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <ContactFormDialog
        open={isAddDialogOpen || !!editingContact}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingContact(null);
          }
        }}
        contact={editingContact}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingContact} onOpenChange={() => setDeletingContact(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingContact?.name}? This will
              also remove their access to all shared items. This action cannot be
              undone.
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
