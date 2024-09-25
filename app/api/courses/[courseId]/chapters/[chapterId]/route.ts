import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  const { isPublished, ...values } = await req.json();
  try {
    const { userId } = auth();

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

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    //   TODO: handle video upload

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSE_CHAPTER_ID]", error);
    return new NextResponse("Internal server error", {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
