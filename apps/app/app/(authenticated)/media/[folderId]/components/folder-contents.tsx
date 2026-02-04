"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { Badge } from "@repo/design-system/components/ui/badge";
import { ImageIcon, ShareIcon, UploadIcon, UsersIcon } from "lucide-react";
import type { MediaFolder, MediaItem, TrustedContact } from "@repo/database";
import { MediaItemCard } from "../../components/media-item-card";
import { UploadToFolderDialog } from "./upload-to-folder-dialog";
import { ShareFolderDialog } from "../../components/share-folder-dialog";

type FolderWithDetails = MediaFolder & {
  items: MediaItem[];
  accessList: { contact: TrustedContact }[];
};

type FolderContentsProps = {
  folder: FolderWithDetails;
  contacts: TrustedContact[];
};

export function FolderContents({ folder, contacts }: FolderContentsProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{folder.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{folder.items.length} items</span>
            {folder.accessList.length > 0 && (
              <Badge variant="secondary">
                <UsersIcon className="mr-1 h-3 w-3" />
                Shared with {folder.accessList.length}
              </Badge>
            )}
          </div>
          {folder.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {folder.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsShareOpen(true)}>
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => setIsUploadOpen(true)}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {folder.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">This folder is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload photos and videos to this folder
            </p>
            <Button className="mt-4" onClick={() => setIsUploadOpen(true)}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {folder.items.map((item) => (
            <MediaItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <UploadToFolderDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        folderId={folder.id}
      />

      <ShareFolderDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        folder={folder}
        contacts={contacts}
      />
    </>
  );
}
