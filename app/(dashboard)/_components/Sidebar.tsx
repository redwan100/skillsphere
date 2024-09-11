import Logo from "./Logo";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  return (
    <div className="w-full h-full overflow-y-auto border-r shadow-sm">
      <div className="p-6">
        <Logo />
      </div>

      <div className="w-full flex flex-col">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
