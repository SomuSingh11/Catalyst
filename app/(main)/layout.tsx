import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbHeader } from "@/components/breadcrumb-header";
import { initialProfile } from "@/lib/intital-profile";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  await initialProfile();
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col p-2 ">
          {/* Header/Breadcrumb - Fixed height */}
          <div className="flex items-center gap-2 border-sidebar-border border shadow rounded-md px-1 h-12 flex-shrink-0">
            <BreadcrumbHeader />
          </div>

          {/* Spacer */}
          <div className="h-4 flex-shrink-0"></div>

          {/* Main content area - Takes remaining space */}
          <div className="border shadow rounded-md flex-1 overflow-auto ">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
