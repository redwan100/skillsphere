"use client";

import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

type AttachmentProps = {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
};

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      router.refresh();
      toggleEditing();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course attachments
        <Button variant={"ghost"} onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add a file
            </>
          )}
        </Button>
      </div>

      <div className="">
        {!isEditing && initialData.attachments.length === 0 && (
          <p className="mt-2 text-sm italic text-slate-500">
            No attachments yet{" "}
          </p>
        )}
      </div>

      {initialData.attachments.map((attachment) => (
        <div
          className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
          key={attachment.id}
        >
          <File className="flex size-4 flex-shrink-0" />
          <p className="line-clamp-1 text-xs">{attachment.name}</p>

          {deletingId === attachment.id && (
            <div className="ml-auto">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}
          {deletingId !== attachment.id && (
            <div className="ml-auto">
              <X className="size-4 text-red-500" />
            </div>
          )}
        </div>
      ))}

      {isEditing && (
        <FileUpload
          endpoint="courseImage"
          onChange={(url) => {
            if (url) {
              onSubmit({ url: url });
            }
          }}
        />
      )}

      {initialData.attachments.length === 0 && (
        <div className="mt-4 text-xs text-muted-foreground">
          Add anything your students might need to complete the course.
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
