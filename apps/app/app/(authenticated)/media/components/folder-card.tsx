"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
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
  FolderIcon,
  ImageIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import type { MediaFolder, MediaItem, TrustedContact } from "@repo/database";
import { deleteMediaFolder } from "@/app/actions/media/delete";
import { ShareFolderDialog } from "./share-folder-dialog";

type FolderWithDetails = MediaFolder & {
  _count: { items: number };
  accessList: { contact: TrustedContact }[];
  items: MediaItem[];
};

type FolderCardProps = {
  folder: FolderWithDetails;
  contacts: TrustedContact[];
};

export function FolderCard({ folder, contacts }: FolderCardProps) {
  const router = useRouter();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMediaFolder(folder.id);
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
      <Card className="overflow-hidden">
        <Link href={`/media/${folder.id}`}>
          <div className="aspect-video bg-muted relative">
            {folder.items.length > 0 ? (
              <div className="grid grid-cols-2 gap-0.5 h-full">
                {folder.items.slice(0, 4).map((item, i) => (
                  <div
                    key={item.id}
                    className="relative bg-muted overflow-hidden"
                  >
                    {item.fileType.startsWith("image/") ? (
                      <img
                        src={item.fileUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <FolderIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </Link>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm truncate">{folder.name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {folder._count.items} items
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
        {folder.accessList.length > 0 && (
          <CardContent className="p-3 pt-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <UsersIcon className="h-3 w-3" />
              Shared with {folder.accessList.length}
            </div>
          </CardContent>
        )}
      </Card>

      <ShareFolderDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        folder={folder}
        contacts={contacts}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{folder.name}&quot;? This will also
              delete all {folder._count.items} items in this folder. This action
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
