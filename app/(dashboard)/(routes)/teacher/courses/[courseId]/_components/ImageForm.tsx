"use client";

import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";

type ImageProps = {
  initialData: Course;
  courseId: string;
};

const ImageForm = ({ initialData, courseId }: ImageProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  const onSubmit = async (values: FieldValues) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
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
        Course Image
        <Button variant={"ghost"} onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imgUrl && (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add an image
            </>
          )}

          {!isEditing && initialData.imgUrl && (
            <>
              {" "}
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>

      <div className="">
        {!isEditing &&
          (!initialData.imgUrl ? (
            <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
              <ImageIcon className="size-10 text-slate-500" />
            </div>
          ) : (
            <div className="relative mt-2 aspect-video">
              <Image
                src={initialData.imgUrl}
                alt="course image"
                fill
                className="rounded-md object-cover"
              />
            </div>
          ))}
      </div>

      {isEditing && (
        <FileUpload
          endpoint="courseImage"
          onChange={(url) => {
            if (url) {
              onSubmit({ imgUrl: url });
            }
          }}
        />
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        16.9 aspect ratio recommended
      </div>
    </div>
  );
};

export default ImageForm;
