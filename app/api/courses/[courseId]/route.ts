import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    const values = await req.json();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const course = await db.course.update({
      where: { id: courseId },
      data: { ...values },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[course-id]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
