"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  ScrollTextIcon,
} from "lucide-react";
import type { Document } from "@repo/database";

type LegacyDocumentsProps = {
  documents: Document[];
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

export function LegacyDocuments({ documents }: LegacyDocumentsProps) {
  const willDocuments = documents.filter((d) => d.isWill);
  const otherDocuments = documents.filter((d) => !d.isWill);

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            No documents have been shared with you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Will Documents */}
      {willDocuments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ScrollTextIcon className="h-5 w-5 text-amber-600" />
            Legal Will
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {willDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} isWill />
            ))}
          </div>
        </div>
      )}

      {/* Other Documents */}
      {otherDocuments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
            Other Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentCard({
  document,
  isWill = false,
}: {
  document: Document;
  isWill?: boolean;
}) {
  const FileIconComponent = getFileIcon(document.fileType);

  return (
    <Card
      className={isWill ? "border-amber-300 dark:border-amber-800" : ""}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            {isWill ? (
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
      </CardHeader>
      <CardContent className="space-y-3">
        {isWill && (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
          >
            <ScrollTextIcon className="mr-1 h-3 w-3" />
            Legal Will
          </Badge>
        )}

        {document.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {document.description}
          </p>
        )}

        <div className="pt-2 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Updated {new Date(document.updatedAt).toLocaleDateString()}
          </span>
          <Button variant="outline" size="sm" asChild>
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DownloadIcon className="h-4 w-4 mr-1" />
              View
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
