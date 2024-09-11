import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./MobileSidebar";

const Navbar = () => {
  return (
    <div className="h-full p-4 border-b flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
