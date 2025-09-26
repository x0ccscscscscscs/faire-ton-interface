import { useState } from "react";
import { 
  Bot, 
  Users, 
  MessageSquare, 
  Activity, 
  Settings, 
  Home,
  Shield,
  Zap
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Tokens", url: "/tokens", icon: Bot },
  { title: "IDs Cibles", url: "/targets", icon: Users },
  { title: "Envoi DMs", url: "/messages", icon: MessageSquare },
  { title: "Monitoring", url: "/monitoring", icon: Activity },
  { title: "Outils", url: "/tools", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = navigationItems.some((item) => isActive(item.url));

  return (
    <Sidebar className="border-r border-border bg-sidebar-background">
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            {state !== "collapsed" && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Discord Manager</h2>
                <p className="text-xs text-muted-foreground">Multi-Tokens v2.0</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth group ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-primary" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className={`w-5 h-5 transition-smooth ${
                        isActive(item.url) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                      }`} />
                      {state !== "collapsed" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state !== "collapsed" && (
          <div className="mt-auto p-4">
            <div className="bg-gradient-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Statut</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokens actifs:</span>
                  <span className="text-success font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IDs cibles:</span>
                  <span className="text-foreground font-medium">0</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}