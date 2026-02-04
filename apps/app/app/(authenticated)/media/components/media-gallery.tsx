"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { FolderPlusIcon, ImageIcon, PlusIcon, UploadIcon } from "lucide-react";
import type { MediaFolder, MediaItem, TrustedContact } from "@repo/database";
import { FolderCard } from "./folder-card";
import { MediaItemCard } from "./media-item-card";
import { CreateFolderDialog } from "./create-folder-dialog";
import { UploadMediaDialog } from "./upload-media-dialog";

type FolderWithDetails = MediaFolder & {
  _count: { items: number };
  accessList: { contact: TrustedContact }[];
  items: MediaItem[];
};

type MediaGalleryProps = {
  folders: FolderWithDetails[];
  unorganizedItems: MediaItem[];
  contacts: TrustedContact[];
};

export function MediaGallery({
  folders,
  unorganizedItems,
  contacts,
}: MediaGalleryProps) {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const totalItems = folders.reduce((acc, f) => acc + f._count.items, 0) + unorganizedItems.length;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pictures & Videos</h2>
          <p className="text-sm text-muted-foreground">
            {totalItems} items in {folders.length} folders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
            <FolderPlusIcon className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button onClick={() => setIsUploadOpen(true)}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <Tabs defaultValue="folders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="folders">Folders ({folders.length})</TabsTrigger>
          <TabsTrigger value="all">All Items ({totalItems})</TabsTrigger>
          <TabsTrigger value="unorganized">
            Unorganized ({unorganizedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="folders" className="space-y-4">
          {folders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No folders yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create folders to organize your photos and videos
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setIsCreateFolderOpen(true)}
                >
                  <FolderPlusIcon className="mr-2 h-4 w-4" />
                  Create First Folder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  contacts={contacts}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {totalItems === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No media yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload photos and videos to preserve memories
                </p>
                <Button className="mt-4" onClick={() => setIsUploadOpen(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              {folders.flatMap((folder) =>
                folder.items.map((item) => (
                  <MediaItemCard key={item.id} item={item} />
                ))
              )}
              {unorganizedItems.map((item) => (
                <MediaItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unorganized" className="space-y-4">
          {unorganizedItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No unorganized items
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  All your media is organized in folders
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              {unorganizedItems.map((item) => (
                <MediaItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
      />

      <UploadMediaDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        folders={folders}
      />
    </>
  );
}
