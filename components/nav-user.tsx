"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavUser() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="flex items-center gap-3 w-full hover:bg-sidebar-accent text-left"
        >
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 rounded-lg",
              },
            }}
          />
          <div className="flex flex-col overflow-hidden text-left">
            <span className="text-sm font-semibold truncate">
              {user.username || user.firstName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
