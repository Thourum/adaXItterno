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
import { FileTextIcon, PlusIcon, ScrollTextIcon } from "lucide-react";
import type { Document, TrustedContact } from "@repo/database";
import { DocumentCard } from "./document-card";
import { UploadDocumentDialog } from "./upload-document-dialog";

type DocumentWithAccess = Document & {
  accessList: { contact: TrustedContact }[];
};

type DocumentsListProps = {
  documents: DocumentWithAccess[];
  contacts: TrustedContact[];
};

export function DocumentsList({ documents, contacts }: DocumentsListProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const willDocuments = documents.filter((doc) => doc.isWill);
  const otherDocuments = documents.filter((doc) => !doc.isWill);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Documents</h2>
          <p className="text-sm text-muted-foreground">
            Store and manage important documents for your digital legacy
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Will Section */}
      {willDocuments.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <ScrollTextIcon className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                Legal Will
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {willDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  contacts={contacts}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="shared">
            Shared ({documents.filter((d) => d.accessList.length > 0).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {otherDocuments.length === 0 && willDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileTextIcon className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No documents yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload important documents like your will, insurance policies, or
                  other legal documents
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  contacts={contacts}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          {documents.filter((d) => d.accessList.length > 0).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileTextIcon className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No shared documents
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share documents with your trusted contacts
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents
                .filter((d) => d.accessList.length > 0)
                .map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    contacts={contacts}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        contacts={contacts}
      />
    </>
  );
}
