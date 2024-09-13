"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ChapterList from "./ChapterList";

type ChapterFormProps = {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
};

const formSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
});

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const router = useRouter();
  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = form;
  const onSubmit = async (values: FieldValues) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter created");
      router.refresh();
      toggleCreating();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Chapters
        <Button variant={"ghost"} onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              {" "}
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                size={"sm"}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Creating
                    <Spinner className="ml-1 text-white" size={"small"} />
                  </>
                ) : (
                  <>Create</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isCreating && (
        <>
          <div
            className={cn(
              "mt-2 text-sm",
              !initialData.chapters.length && "italic text-slate-500",
            )}
          >
            {!initialData.chapters.length && "No chapters"}
            <ChapterList
              onEdit={() => {}}
              onReorder={() => {}}
              items={initialData.chapters || []}
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Drag and drop reorder the chapter
          </p>
        </>
      )}
    </div>
  );
};

export default ChapterForm;
