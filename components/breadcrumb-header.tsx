"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export function BreadcrumbHeader() {
  const pathname = usePathname(); // Get the current path
  const router = useRouter();

  // Split the pathname into segments (assuming the path is like /category/product)
  const pathSegments = pathname.split("/").filter(Boolean);

  // Default breadcrumb for Home
  const breadcrumbItems = [
    { href: "/", label: "Home" }, // Add Home breadcrumb by default
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`; // Generate href for each segment

      // Capitalize the first letter of each segment (no need to capitalize the entire string)
      const segmentName =
        segment.replace(/-/g, " ").charAt(0).toUpperCase() + segment.slice(1);

      return { href, label: segmentName };
    }),
  ];

  const handleBreadcrumbClick = (href: string) => {
    // Use the router to navigate to the selected breadcrumb path
    router.push(href);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    role="button"
                    onClick={() => handleBreadcrumbClick(item.href)} // Handle click for redirect
                    style={{ cursor: "pointer" }} // Add cursor pointer to indicate it's clickable
                  >
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
