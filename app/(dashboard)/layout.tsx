import { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full w-full">
      <div className="fixed inset-y-0 h-[80px] w-full md:pl-56">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>

      <main className="h-full pt-[80px] md:pl-56">{children}</main>
    </div>
  );
};

export default DashboardLayout;
