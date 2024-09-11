"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

// Define the schema using zod
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

// Infer the TypeScript type from the schema
type FormSchemaType = z.infer<typeof formSchema>;

const CreatePage = () => {
  const router = useRouter();
  // Use the inferred type with useForm
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post("/api/courses", value);
      router.push(`/teacher/courses/${res?.data?.id}`);
      toast.success("Course created successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl p-6 md:items-center md:justify-center">
      <div className="">
        <h2 className="text-2xl">Name your course</h2>
        <p className="text-sm text-neutral-600">
          What would you like to name yur course? Don&apos;t worry, you can
          change this later
        </p>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href={"/"}>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    Creating...
                    <Spinner className="ml-1 text-white" size={"small"} />{" "}
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreatePage;
