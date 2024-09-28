import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Mux } from "@mux/mux-node";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

// Initialize Mux client
const muxClient =
  process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET
    ? new Mux({
        tokenId: process.env.MUX_TOKEN_ID,
        tokenSecret: process.env.MUX_TOKEN_SECRET,
      })
    : null;

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: httpStatus.UNAUTHORIZED,
      });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", {
        status: httpStatus.UNAUTHORIZED,
      });
    }

    if (!muxClient) {
      console.error(
        "Mux client is not initialized. Check your environment variables.",
      );
      return new NextResponse("Server configuration error", {
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    if (values.videoUrl) {
      // Handle existing Mux data first
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxData) {
        await muxClient.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: { id: existingMuxData.id },
        });
      }

      // Create new Mux asset
      const asset = await muxClient.video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });

      // Create new Mux data
      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    // Update chapter
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
        isPublished: isPublished ?? undefined,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSE_CHAPTER_ID]", error);
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, {
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return new NextResponse("Internal server error", {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
