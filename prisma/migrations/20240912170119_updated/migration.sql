-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_courseId_fkey";

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_categoryId_fkey";

-- CreateTable
CREATE TABLE "chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muxdata" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "playbackId" TEXT,

    CONSTRAINT "muxdata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userprogress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userprogress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripecustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stripecustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chapter_courseId_idx" ON "chapter"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "muxdata_chapterId_key" ON "muxdata"("chapterId");

-- CreateIndex
CREATE INDEX "userprogress_chapterId_idx" ON "userprogress"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "userprogress_userId_chapterId_key" ON "userprogress"("userId", "chapterId");

-- CreateIndex
CREATE INDEX "purchase_courseId_idx" ON "purchase"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "stripecustomer_userId_key" ON "stripecustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "stripecustomer_stripeCustomerId_key" ON "stripecustomer"("stripeCustomerId");
