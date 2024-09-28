"use client";

import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import MuxPlayer from "@mux/mux-player-react";
import { Chapter, MuxData } from "@prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

type ChapterVideoProps = {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "video is required",
  }),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values,
      );
      toast.success("Chapter updated");
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
        Chapter Video
        <Button variant={"ghost"} onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add a video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              {" "}
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>

      <div className="">
        {!isEditing &&
          (!initialData.videoUrl ? (
            <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
              <VideoIcon className="size-10 text-slate-500" />
            </div>
          ) : (
            <div className="relative mt-2 aspect-video">
              <MuxPlayer playbackId={initialData.muxData?.playbackId || ""} />
            </div>
          ))}
      </div>

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />

          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
