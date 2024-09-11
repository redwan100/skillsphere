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
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type TitleFormProps = {
  initialData: {
    title: string;
  };
  courseId: string;
};

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = form;
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
        Course Title
        <Button variant={"ghost"} onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {" "}
              <Pencil className="mr-2 h-4 w-4" />
              Edit title
            </>
          )}
        </Button>
      </div>

      <div className="">
        {!isEditing && <p className="mt-2 text-sm">{initialData.title}</p>}
      </div>

      {isEditing && (
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
                      placeholder="e.g 'Advanced web development'"
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
                    Saving
                    <Spinner className="ml-1 text-white" size={"small"} />
                  </>
                ) : (
                  <>Save</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default TitleForm;
