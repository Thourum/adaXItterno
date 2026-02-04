"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Label } from "@repo/design-system/components/ui/label";
import { uploadMediaFile, createMediaItem } from "@/app/actions/media/upload";
import { Loader2Icon, UploadIcon, XIcon, ImageIcon, FileVideoIcon } from "lucide-react";
import type { MediaFolder } from "@repo/database";

type UploadMediaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: MediaFolder[];
};

export function UploadMediaDialog({
  open,
  onOpenChange,
  folders,
}: UploadMediaDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/")
      );
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/")
      );
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Upload file
        const formData = new FormData();
        formData.append("file", file);

        const uploadResult = await uploadMediaFile(formData);

        if ("error" in uploadResult) {
          console.error(uploadResult.error);
          continue;
        }

        // Create media item record
        const createResult = await createMediaItem({
          name: file.name,
          fileUrl: uploadResult.data.url,
          fileType: file.type,
          fileSize: file.size,
          folderId: selectedFolderId || undefined,
        });

        if ("error" in createResult) {
          console.error(createResult.error);
        }

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      onOpenChange(false);
      setSelectedFiles([]);
      setSelectedFolderId("");
      router.refresh();
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setSelectedFiles([]);
      setSelectedFolderId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Upload photos and videos to your digital legacy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop files here, or click to select
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports images and videos
            </p>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*,video/*"
              multiple
              disabled={isLoading}
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <FileVideoIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => removeFile(index)}
                    disabled={isLoading}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Folder Selection */}
          <div className="space-y-2">
            <Label>Add to Folder (Optional)</Label>
            <Select
              value={selectedFolderId}
              onValueChange={setSelectedFolderId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="No folder (unorganized)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No folder (unorganized)</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isLoading || selectedFiles.length === 0}
            >
              {isLoading && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
