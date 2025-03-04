import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbHeader } from "@/components/breadcrumb-header";
import { initialProfile } from "@/lib/intital-profile";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await initialProfile();

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] [background-size:16px_16px]"></div>
      <SidebarProvider>
        <AppSidebar profile={profile} />
        <div className="flex-1 flex flex-col">
          <div className="sticky w-full top-0 z-10 bg-sidebar rounded-xl backdrop-blur-md py-2 min-h-[3rem] shadow-md">
            <BreadcrumbHeader />
          </div>
          <main className="h-full w-full overflow-hidden ">{children}</main>{" "}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
