import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

const CoursesPage = () => {
  return (
    <div className="pl-6">
      <Link href={"/teacher/create"}>
        <Button>
          New Course
          <PlusCircleIcon size={15} className="ml-1" />
        </Button>
      </Link>
    </div>
  );
};

export default CoursesPage;
