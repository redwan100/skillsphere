import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import httpStatus from "http-status";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) {
      return new Response("Unauthorized", { status: httpStatus.UNAUTHORIZED });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new Response("Unauthorized", { status: httpStatus.UNAUTHORIZED });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return new Response(JSON.stringify(chapter));
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new Response("Internal Error", {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
