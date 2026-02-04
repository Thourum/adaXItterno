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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import {
  DownloadIcon,
  FolderIcon,
  ImageIcon,
  PlayIcon,
  XIcon,
} from "lucide-react";
import type { MediaFolder, MediaItem } from "@repo/database";

type LegacyMediaProps = {
  folders: (MediaFolder & { items: MediaItem[] })[];
  unorganizedMedia: MediaItem[];
  isExecutor: boolean;
};

export function LegacyMedia({
  folders,
  unorganizedMedia,
  isExecutor,
}: LegacyMediaProps) {
  const [selectedFolder, setSelectedFolder] = useState<
    (MediaFolder & { items: MediaItem[] }) | null
  >(null);
  const [viewingItem, setViewingItem] = useState<MediaItem | null>(null);

  const totalItems =
    folders.reduce((acc, f) => acc + f.items.length, 0) + unorganizedMedia.length;

  if (totalItems === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            No photos or videos have been shared with you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-muted-foreground" />
            Albums
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onClick={() => setSelectedFolder(folder)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unorganized Media (Executor only) */}
      {isExecutor && unorganizedMedia.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            Unorganized Media
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {unorganizedMedia.map((item) => (
              <MediaItemCard
                key={item.id}
                item={item}
                onClick={() => setViewingItem(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Folder Contents Dialog */}
      <Dialog
        open={!!selectedFolder}
        onOpenChange={(open) => !open && setSelectedFolder(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderIcon className="h-5 w-5" />
              {selectedFolder?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedFolder && (
            <div className="space-y-4">
              {selectedFolder.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedFolder.description}
                </p>
              )}
              {selectedFolder.items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  This folder is empty.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedFolder.items.map((item) => (
                    <MediaItemCard
                      key={item.id}
                      item={item}
                      onClick={() => setViewingItem(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Media Viewer Dialog */}
      <Dialog
        open={!!viewingItem}
        onOpenChange={(open) => !open && setViewingItem(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewingItem?.name}</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {viewingItem.fileType.startsWith("video/") ? (
                  <video
                    src={viewingItem.fileUrl}
                    controls
                    className="max-w-full max-h-full"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <img
                    src={viewingItem.fileUrl}
                    alt={viewingItem.name}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Added {new Date(viewingItem.createdAt).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={viewingItem.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FolderCard({
  folder,
  onClick,
}: {
  folder: MediaFolder & { items: MediaItem[] };
  onClick: () => void;
}) {
  const previewItems = folder.items.slice(0, 4);

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 grid grid-cols-2 gap-0.5">
          {previewItems.length > 0 ? (
            previewItems.map((item) => (
              <div
                key={item.id}
                className="bg-muted-foreground/10 flex items-center justify-center overflow-hidden"
              >
                {item.fileType.startsWith("video/") ? (
                  <PlayIcon className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <img
                    src={item.fileUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center">
              <FolderIcon className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
        <h3 className="font-medium truncate">{folder.name}</h3>
        <p className="text-xs text-muted-foreground">
          {folder.items.length} item{folder.items.length !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  );
}

function MediaItemCard({
  item,
  onClick,
}: {
  item: MediaItem;
  onClick: () => void;
}) {
  const isVideo = item.fileType.startsWith("video/");

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-square bg-muted flex items-center justify-center relative">
        {isVideo ? (
          <>
            <PlayIcon className="h-8 w-8 text-muted-foreground" />
            <div className="absolute inset-0 bg-black/20" />
            <PlayIcon className="absolute h-8 w-8 text-white" />
          </>
        ) : (
          <img
            src={item.fileUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </Card>
  );
}
