/*
  Warnings:

  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('FAMILY', 'FRIEND', 'COWORKER', 'LEGAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactRole" AS ENUM ('EXECUTOR', 'RECIPIENT');

-- CreateEnum
CREATE TYPE "AccountCategory" AS ENUM ('SOCIAL_MEDIA', 'EMAIL_COMMUNICATION', 'FINANCIAL', 'CRYPTO', 'SUBSCRIPTIONS', 'OTHER');

-- CreateEnum
CREATE TYPE "ActionOnDeath" AS ENUM ('DELETE', 'TRANSFER', 'MEMORIALIZE');

-- DropTable
DROP TABLE "Page";

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "countryOfResidence" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustedContact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "relationship" "RelationshipType" NOT NULL,
    "role" "ContactRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustedContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "AccountCategory" NOT NULL,
    "platformName" TEXT NOT NULL,
    "platformIcon" TEXT,
    "username" TEXT,
    "email" TEXT,
    "actionOnDeath" "ActionOnDeath" NOT NULL,
    "transferToId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "isWill" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaFolder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "folderId" TEXT,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAccess" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "DocumentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaFolderAccess" (
    "id" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "MediaFolderAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountAccess" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "AccountAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_clerkUserId_key" ON "UserProfile"("clerkUserId");

-- CreateIndex
CREATE INDEX "UserProfile_clerkUserId_idx" ON "UserProfile"("clerkUserId");

-- CreateIndex
CREATE INDEX "TrustedContact_userId_idx" ON "TrustedContact"("userId");

-- CreateIndex
CREATE INDEX "DigitalAccount_userId_idx" ON "DigitalAccount"("userId");

-- CreateIndex
CREATE INDEX "DigitalAccount_category_idx" ON "DigitalAccount"("category");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Document_isWill_idx" ON "Document"("isWill");

-- CreateIndex
CREATE INDEX "MediaFolder_userId_idx" ON "MediaFolder"("userId");

-- CreateIndex
CREATE INDEX "MediaItem_userId_idx" ON "MediaItem"("userId");

-- CreateIndex
CREATE INDEX "MediaItem_folderId_idx" ON "MediaItem"("folderId");

-- CreateIndex
CREATE INDEX "DocumentAccess_documentId_idx" ON "DocumentAccess"("documentId");

-- CreateIndex
CREATE INDEX "DocumentAccess_contactId_idx" ON "DocumentAccess"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentAccess_documentId_contactId_key" ON "DocumentAccess"("documentId", "contactId");

-- CreateIndex
CREATE INDEX "MediaFolderAccess_folderId_idx" ON "MediaFolderAccess"("folderId");

-- CreateIndex
CREATE INDEX "MediaFolderAccess_contactId_idx" ON "MediaFolderAccess"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaFolderAccess_folderId_contactId_key" ON "MediaFolderAccess"("folderId", "contactId");

-- CreateIndex
CREATE INDEX "AccountAccess_accountId_idx" ON "AccountAccess"("accountId");

-- CreateIndex
CREATE INDEX "AccountAccess_contactId_idx" ON "AccountAccess"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountAccess_accountId_contactId_key" ON "AccountAccess"("accountId", "contactId");
