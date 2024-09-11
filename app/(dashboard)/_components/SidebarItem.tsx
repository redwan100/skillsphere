import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type SidebarProps = {
  icon: LucideIcon;
  label: string;
  href: string;
};

const SidebarItem = ({ icon: Icon, label, href }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const active =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const handleActiveRoute = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handleActiveRoute}
      className={cn(
        "flex items-center gap-x-2 text-neutral-500 text-sm font-[500] pl-6 transition-all hover:text-neutral-600 hover:bg-neutral-300/20 ",
        active &&
          "bg-neutral-300/20 border-r-4 border-neutral-400 text-neutral-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-neutral-500", active && " text-neutral-700")}
        />
        <span>{label}</span>
      </div>
    </button>
  );
};

export default SidebarItem;
