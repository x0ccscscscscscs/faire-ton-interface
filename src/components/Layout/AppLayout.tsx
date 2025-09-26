import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-hero">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center h-full px-6 gap-4">
              <SidebarTrigger className="hover:bg-accent" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">DM</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Discord Multi-Manager</h1>
                  <p className="text-xs text-muted-foreground">Gestionnaire Multi-Tokens v2.0</p>
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}