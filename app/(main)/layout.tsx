import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbHeader } from "@/components/breadcrumb-header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <div className="sticky top-0 z-10">
            <BreadcrumbHeader />
          </div>
          <main className="mt-4 pl-5">{children}</main>{" "}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
