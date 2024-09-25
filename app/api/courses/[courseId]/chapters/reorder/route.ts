import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: httpStatus.UNAUTHORIZED,
      });
    }

    const { list } = await req.json();
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

    for (let item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return NextResponse.json({ message: "Chapters reordered" });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
