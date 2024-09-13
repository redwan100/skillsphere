import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import httpStatus from "http-status";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: httpStatus.UNAUTHORIZED,
      });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", {
        status: httpStatus.UNAUTHORIZED,
      });
    }

    const attachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[ATTACHMENTS]", error);
    return new NextResponse("Internal Error", {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
