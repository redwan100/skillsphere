"use client";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { Button } from "./ui/button";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");
  return (
    <div className="flex items-center gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href={"/"}>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="flex items-center gap-x-1"
          >
            <LogOut className="size-4" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={"/teacher/courses"}>
          <Button variant={"ghost"} size={"sm"}>
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton afterSwitchSessionUrl="/" />
    </div>
  );
};

export default NavbarRoutes;
