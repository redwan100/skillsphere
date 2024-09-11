import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // upload image
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  // upload file text
  courseAttachment: f([
    "text",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jp2",
    "video",
    "audio",
    "pdf",
  ])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  // upload video
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "128GB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
