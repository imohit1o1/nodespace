// "use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ReactNode } from "react";
import { ThemeModeToggle } from "@/components/theme-toggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 bg-background px-4 z-20 justify-between">
          <div className="flex items-center gap-2 ">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <ThemeModeToggle />
        </header>

        {/* Dashboard Dynamic Content */}
        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="flex flex-1 flex-col gap-4">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
