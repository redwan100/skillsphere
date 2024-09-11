import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import Description from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import TitleForm from "./_components/TitleForm";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const course = await db.course.findUniqueOrThrow({
    where: {
      id: params.courseId,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imgUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((field) => field).length;

  const completedText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-medium">Course setup</h2>
          <span className="text-sm text-neutral-700">
            Complete all fields {completedText}
          </span>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-x-2">
            <h2 className="flex items-center gap-x-1 text-xl">
              <span className="grid size-8 place-items-center rounded-full bg-blue-100 text-blue-500">
                <LayoutDashboard size={18} />
              </span>
              Customize your course
            </h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <Description
            initialData={{ ...course, description: course.description ?? "" }}
            courseId={course.id}
          />
          <ImageForm initialData={course} courseId={course.id} />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
