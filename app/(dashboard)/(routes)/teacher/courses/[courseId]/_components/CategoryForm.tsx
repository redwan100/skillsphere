"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type CategoryFormProps = {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
};

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
});

const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: initialData.categoryId || "" },
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

  const selectedOptions = options.find(
    (option) => option.value === initialData.categoryId,
  );
  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Category
        <Button variant={"ghost"} onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {" "}
              <Pencil className="mr-2 h-4 w-4" />
              Edit Category
            </>
          )}
        </Button>
      </div>

      <div className="">
        {!isEditing && (
          <p
            className={cn(
              "mt-2 text-sm",
              !initialData.categoryId && "italic text-neutral-500",
            )}
          >
            {selectedOptions?.label || "No Category"}
          </p>
        )}
      </div>

      {isEditing && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
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

export default CategoryForm;
