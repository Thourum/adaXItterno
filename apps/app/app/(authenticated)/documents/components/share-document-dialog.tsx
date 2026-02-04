"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { Button } from "@repo/design-system/components/ui/button";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import { Badge } from "@repo/design-system/components/ui/badge";
import { updateDocumentSharing } from "@/app/actions/sharing/revoke-access";
import { Loader2Icon, ShieldIcon, UserIcon } from "lucide-react";
import type { Document, TrustedContact } from "@repo/database";

type DocumentWithAccess = Document & {
  accessList: { contact: TrustedContact }[];
};

type ShareDocumentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentWithAccess;
  contacts: TrustedContact[];
};

export function ShareDocumentDialog({
  open,
  onOpenChange,
  document,
  contacts,
}: ShareDocumentDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  useEffect(() => {
    setSelectedContacts(document.accessList.map((a) => a.contact.id));
  }, [document.accessList]);

  const handleToggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateDocumentSharing(document.id, selectedContacts);

      if ("error" in result) {
        console.error(result.error);
        return;
      }

      onOpenChange(false);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Select which trusted contacts can access &quot;{document.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No trusted contacts yet. Add contacts first to share documents.
            </p>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleToggleContact(contact.id)}
                >
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleToggleContact(contact.id)}
                  />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.email || contact.phone || "No contact info"}
                    </p>
                  </div>
                  <Badge
                    variant={contact.role === "EXECUTOR" ? "default" : "secondary"}
                  >
                    <ShieldIcon className="mr-1 h-3 w-3" />
                    {contact.role === "EXECUTOR" ? "Executor" : "Recipient"}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Note: Executors have full access unless you restrict specific items.
            Recipients only see items you explicitly share with them.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
