"use client";

import { ChevronRight, CirclePower, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { redirect, usePathname } from "next/navigation";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { projects, projectId, setProjectId } = useProject();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Micro Saas</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={isParentActive ? "bg-secondary text-green/" : ""}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={isSubActive ? "text-primary" : ""}
                          >
                            <a href={subItem.url}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                              {isSubActive && (
                                <CirclePower
                                  color={"green"}
                                  className="ml-auto"
                                />
                              )}
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}

                    {/* Projects section for GitWhiz */}
                    {item.title === "GitWhiz" && (
                      <div className="flex flex-col">
                        <div className="max-h-64 overflow-y-auto">
                          {projects?.map((project) => {
                            const isProjectActive = project.id === projectId;
                            return (
                              <SidebarMenuSubItem
                                key={project.id}
                                className="mt-1"
                              >
                                <SidebarMenuSubButton
                                  className={
                                    isProjectActive
                                      ? "text-primary"
                                      : "cursor-pointer"
                                  }
                                  onClick={() => {
                                    setProjectId(project.id);
                                    redirect(`/gitwhiz/project`);
                                  }}
                                >
                                  <div
                                    className={cn(
                                      "rounded-sm border size-6 -ml-1 flex items-center justify-center text-sm bg-white text-primary",
                                      {
                                        "bg-secondary text-green-800":
                                          isProjectActive,
                                      }
                                    )}
                                  >
                                    <span className="p-3">
                                      {project.name[0]}
                                    </span>
                                  </div>
                                  <span className="truncate">
                                    {project.name}
                                  </span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
