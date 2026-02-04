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
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MoreVerticalIcon,
  ScrollTextIcon,
  ShareIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import type { Document, TrustedContact } from "@repo/database";
import { deleteDocument } from "@/app/actions/documents/delete";
import { ShareDocumentDialog } from "./share-document-dialog";

type DocumentWithAccess = Document & {
  accessList: { contact: TrustedContact }[];
};

type DocumentCardProps = {
  document: DocumentWithAccess;
  contacts: TrustedContact[];
};

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return ImageIcon;
  if (fileType === "application/pdf") return FileTextIcon;
  return FileIcon;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function DocumentCard({ document, contacts }: DocumentCardProps) {
  const router = useRouter();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const FileIconComponent = getFileIcon(document.fileType);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDocument(document.id);
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
      <Card className={document.isWill ? "border-amber-300 dark:border-amber-800" : ""}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              {document.isWill ? (
                <ScrollTextIcon className="h-5 w-5 text-amber-600" />
              ) : (
                <FileIconComponent className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate">{document.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(document.fileSize)}
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
              <DropdownMenuItem asChild>
                <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>
                <ShareIcon className="mr-2 h-4 w-4" />
                Share
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
          {document.isWill && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              <ScrollTextIcon className="mr-1 h-3 w-3" />
              Legal Will
            </Badge>
          )}

          {document.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {document.description}
            </p>
          )}

          {document.accessList.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <UsersIcon className="h-3 w-3" />
              Shared with {document.accessList.length} contact
              {document.accessList.length > 1 ? "s" : ""}
            </div>
          )}

          <div className="pt-2 border-t text-xs text-muted-foreground">
            Updated {new Date(document.updatedAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <ShareDocumentDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        document={document}
        contacts={contacts}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{document.name}&quot;? This action
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
