import { useUser } from "@clerk/nextjs";
import React from "react";
import {
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

function UserSidebar() {
  const { user } = useUser();
  const { state } = useSidebar();
  if (!user) return null;

  const isCollapsed = state === "collapsed";

  return (
    <div className="pt-1">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="flex items-center justify-between w-full hover:bg-sidebar-accent"
          >
            {!isCollapsed && (
              <p className="text-2xl font-semibold font-display overflow-hidden text-gray-600 truncate">
                Hi, {user.username || user.firstName}
              </p>
            )}
            <button
              className={`bg-emerald-700/40 rounded-lg ${
                isCollapsed ? "p-1" : "p-2"
              }`}
            >
              <img src="/binary-code.png" />
              {/* <PlusIcon className="text-green-700" /> */}
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

export default UserSidebar;
