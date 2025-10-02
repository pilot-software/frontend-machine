import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useFeatures, useText } from "../lib/useFeatures";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Activity,
  LogOut,
  Menu,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { NotificationDropdown } from "./NotificationDropdown";
import { useTheme } from "./ThemeProvider";
import { BranchSelector } from "./BranchSelector";
import { useIsMobile } from "./ui/use-mobile";
import { PermissionStrategy } from "../lib/strategies/permission.strategy";
import { getRoleColor } from "../lib/constants/status";

interface DashboardLayoutProps {
  children: React.ReactNode;
}



export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, permissions } = useAuth();
  const features = useFeatures();
  const text = useText();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    router.replace("/login");
    return null;
  }

  const menuItems = PermissionStrategy.getMenuItems(permissions);
  const RoleIcon = Shield; // Default icon

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  //   const getRoleDisplayName = (role: UserRole) => {
  //     return role.charAt(0).toUpperCase() + role.slice(1);
  //   };

  const NavigationContent = () => (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => {
        const ItemIcon = item.icon;
        return (
          <Button
            key={item.path}
            variant={pathname === item.path ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              router.push(item.path);
              setSidebarOpen(false);
            }}
          >
            <ItemIcon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex items-center space-x-3 p-4 border-b">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {text.systemName}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {text.systemDescription}
                      </p>
                    </div>
                  </div>
                  <NavigationContent />
                </SheetContent>
              </Sheet>
            )}
            
            {/* Logo and System Name */}
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/dashboard")}
            >
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="hidden sm:block">
                <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-foreground">
                  {text.systemName}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {text.systemDescription}
                </p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Branch Selector - Hidden on small screens */}
            <div className="hidden sm:block">
              <BranchSelector />
            </div>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
            
            {/* Notifications */}
            {features.notifications && <NotificationDropdown />}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 p-1 sm:p-2 hover:bg-accent transition-all duration-200 rounded-lg group"
                >
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 transition-all duration-300 group-hover:animate-wave overflow-hidden">
                    <AvatarImage src={user.avatar} alt={user.name} className="transition-all duration-200 group-hover:brightness-110" />
                    <AvatarFallback className="transition-all duration-200 group-hover:bg-blue-500 group-hover:text-white text-xs">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-primary">
                      {user.name}
                    </p>
                    <Badge variant="secondary" className={`${getRoleColor(user.role)} transition-all duration-200 group-hover:scale-105 text-xs`}>
                      <RoleIcon className="h-3 w-3 mr-1 transition-transform duration-200 group-hover:rotate-12" />
                      {text.roles[user.role]}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2 duration-200">
                <DropdownMenuLabel>
                  <div className="flex items-center space-x-3 animate-in fade-in-50 duration-300">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 transition-all duration-300 hover:ring-blue-500/40 hover:scale-105">
                      <AvatarImage src={user.avatar} alt={user.name} className="transition-all duration-300 hover:brightness-110" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="animate-in slide-in-from-left-2 duration-300 delay-100">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-sm font-normal text-muted-foreground animate-pulse">
                        {text.roles[user.role]}
                      </p>
                      {user.department && (
                        <p className="text-sm font-normal text-muted-foreground animate-in fade-in duration-300 delay-200">
                          {user.department}
                        </p>
                      )}
                      {user.specialization && user.role === "doctor" && (
                        <p className="text-sm font-normal text-muted-foreground animate-in fade-in duration-300 delay-300">
                          {user.specialization}
                        </p>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Branch Selector in mobile dropdown */}
                {isMobile && (
                  <>
                    <div className="px-2 py-1">
                      <BranchSelector />
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer group">
                  <User className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer group">
                  <Settings className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer group">
                  <LogOut className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                  {text.buttons.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-card border-r border-border min-h-[calc(100vh-73px)]">
          <NavigationContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-background overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
