import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/AuthContext";
import { useFeatures, useText } from "@/lib/useFeatures";
import { getBranding } from "@/lib/runtimeConfig";
import { ROUTES, ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LanguageSwitcher } from "@/components/shared/navigation/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Menu,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
  Stethoscope,
  Heart,
  DollarSign,
  UserCog,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { NotificationDropdown } from "@/components/shared/notifications/NotificationDropdown";
import { useTheme } from "@/components/providers/ThemeProvider";
import { BranchSelector } from "@/components/shared/navigation/BranchSelector";
import { useIsMobile } from "@/components/ui/use-mobile";
import { PermissionStrategy } from "@/lib/strategies/permission.strategy";
import { getRoleColor } from "@/lib/constants/status";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations("common");
  const { user, logout, permissions } = useAuth();
  const features = useFeatures();
  const text = useText();
  const branding = getBranding();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => setIsResizing(true);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = Math.min(Math.max(e.clientX, 64), 400);
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => setIsResizing(false);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  if (!user) {
    router.replace(ROUTES.LOGIN);
    return null;
  }

  const menuItems = PermissionStrategy.getMenuItems(permissions);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Shield;
      case "doctor":
        return Stethoscope;
      case "nurse":
        return UserCog;
      case "patient":
        return Heart;
      case "finance":
        return DollarSign;
      default:
        return Shield;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const NavigationContent = () => (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => {
        const ItemIcon = item.icon;
        const isActive =
          pathname.includes(item.path) ||
          (item.path === "/patients" && pathname.includes("/patient/"));
        return (
          <Button
            key={item.path}
            variant="ghost"
            className={`w-full justify-start transition-all duration-300 ${
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
            onClick={() => {
              router.push(item.path);
              setSidebarOpen(false);
            }}
          >
            <ItemIcon className="h-4 w-4 mr-2" />
            {t(item.label)}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 md:hidden"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex items-center space-x-3 p-4 border-b">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {branding.systemName}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {branding.tagline}
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
              onClick={() => router.push(ROUTES.DASHBOARD)}
            >
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="hidden sm:block">
                <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-foreground">
                  {branding.systemName}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {branding.tagline}
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

            {/* Language Switcher */}
            <div className="relative z-50">
              <LanguageSwitcher />
            </div>

            {/* Theme Toggle */}
            <div className="relative z-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                {theme === "dark" ? (
                  <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>

            {/* Notifications */}
            <div className="relative z-50">
              {features.notifications && <NotificationDropdown />}
            </div>

            {/* User Dropdown */}
            <div className="relative z-40 isolate">
              <DropdownMenu onOpenChange={(open) => {
                if (open) {
                  document.body.setAttribute('data-dropdown-open', 'true');
                } else {
                  document.body.removeAttribute('data-dropdown-open');
                }
              }}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center gap-2 sm:gap-3 px-2 py-2 sm:px-3 sm:py-2.5 rounded-full group transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:shadow-xl hover:shadow-blue-500/20 border border-transparent hover:border-blue-500/20"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 ring-2 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/40">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className="transition-all duration-300 group-hover:brightness-110"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white text-xs sm:text-sm font-bold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 animate-in slide-in-from-top-2 duration-300 border border-blue-500/20 shadow-2xl shadow-blue-500/20 bg-card/98 backdrop-blur-2xl rounded-2xl overflow-hidden"
                >
                  <DropdownMenuLabel className="p-0">
                    <div className="relative overflow-hidden">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient" />
                      
                      {/* Mesh gradient overlay */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

                      <div className="relative flex items-center space-x-4 p-5 animate-in fade-in-50 duration-300">
                        <div className="relative">
                          <Avatar className="h-14 w-14 ring-2 ring-white/20 shadow-xl transition-all duration-300 hover:ring-white/40 hover:scale-105">
                            <AvatarImage
                              src={user.avatar}
                              alt={user.name}
                              className="transition-all duration-300"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white font-bold text-lg">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground text-base truncate">
                            {user.name}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`${getRoleColor(
                              user.role
                            )} text-xs font-medium mt-1.5 shadow-sm`}
                          >
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {text.roles[user.role]}
                          </Badge>
                          {user.department && (
                            <p className="text-xs text-muted-foreground mt-1.5 truncate">
                              📍 {user.department}
                            </p>
                          )}
                          {user.specialization &&
                            user.role === ROLES.DOCTOR && (
                              <p className="text-xs text-muted-foreground truncate">
                                🩺 {user.specialization}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  {/* Branch Selector in mobile dropdown */}
                  {isMobile && (
                    <>
                      <div className="px-2 py-1">
                        <BranchSelector />
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => router.push(ROUTES.PROFILE)}
                    className="cursor-pointer group mx-2 my-1 rounded-lg transition-all duration-200 hover:bg-blue-500/10"
                  >
                    <User className="h-4 w-4 mr-3 transition-transform duration-200 group-hover:scale-110 text-blue-600" />
                    <span className="font-medium">{t("profile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(ROUTES.SETTINGS)}
                    className="cursor-pointer group mx-2 my-1 rounded-lg transition-all duration-200 hover:bg-purple-500/10"
                  >
                    <Settings className="h-4 w-4 mr-3 transition-transform duration-200 group-hover:rotate-90 text-purple-600" />
                    <span className="font-medium">{t("settings")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-2" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer group mx-2 my-1 mb-2 rounded-lg transition-all duration-200 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4 mr-3 transition-transform duration-200 group-hover:-translate-x-1" />
                    <span className="font-medium">{t("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-[73px]">
        {/* Desktop Sidebar */}
        <aside 
          className="hidden md:block fixed left-0 top-[73px] bottom-0 bg-linear-to-b from-card via-card to-card/95 backdrop-blur-sm transition-none"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-border to-transparent" />
          
          {/* Resize Handle */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500 transition-colors group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-border group-hover:bg-blue-500 rounded-full transition-colors" />
          </div>

          <nav className="h-full max-h-[calc(100vh-73px)] overflow-hidden px-2 py-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive =
                  pathname.includes(item.path) ||
                  (item.path === "/patients" && pathname.includes("/patient/"));
                const showText = sidebarWidth >= 150;
                
                const buttonContent = (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => router.push(item.path)}
                    className={`w-full transition-all duration-200 h-11 ${
                      showText ? 'justify-start px-3' : 'justify-center px-0'
                    } ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <ItemIcon className={`h-4 w-4 ${showText ? 'mr-3 flex-shrink-0' : ''}`} />
                    {showText && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{t(item.label)}</span>}
                  </Button>
                );

                return !showText ? (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {t(item.label)}
                    </TooltipContent>
                  </Tooltip>
                ) : buttonContent;
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main 
          className="flex-1 p-3 sm:p-4 md:p-6 bg-background overflow-x-auto transition-none md:ml-0"
          style={{ marginLeft: isMobile ? '0' : `${sidebarWidth}px` }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
