import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbHeader } from "@/components/breadcrumb-header";
import { initialProfile } from "@/lib/intital-profile";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await initialProfile();

  return (
    <div className="h-full relative">
      <SidebarProvider>
        <AppSidebar profile={profile} />
        <div className="flex-1 flex flex-col">
          <div className="sticky w-full top-0 z-10 bg-sidebar rounded-xl backdrop-blur-md mt-2 shadow-md">
            <BreadcrumbHeader />
          </div>
          <main className=" ">{children}</main>{" "}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
