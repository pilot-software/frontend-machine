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
            className={`w-full justify-start transition-all duration-300 ${isActive
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
      <header
        className="fixed top-0 z-50 bg-card border-b border-border"
        style={{ left: isMobile ? 0 : sidebarWidth, right: 0 }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">{branding.systemName}</h2>
                        <p className="text-xs text-muted-foreground">{branding.tagline}</p>
                      </div>
                    </div>
                  </div>
                  <NavigationContent />
                </SheetContent>
              </Sheet>
            )}

          {isMobile && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(ROUTES.DASHBOARD)}>
              <Stethoscope className="h-5 w-5 text-foreground" />
              <span className="text-base font-bold text-foreground">{branding.systemName}</span>
            </div>
          )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <BranchSelector />
            </div>
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {features.notifications && <NotificationDropdown />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative p-0 h-10 w-10 rounded-full hover:bg-sidebar-accent transition-colors duration-200">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-3 py-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <Badge className={`text-xs mt-1 ${getRoleColor(user.role)}`}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {text.roles[user.role]}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)} className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 cursor-pointer group">
                  <User className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  {t("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)} className="hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 cursor-pointer group">
                  <Settings className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400 group-hover:rotate-90 transition-transform" />
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 cursor-pointer group">
                  <LogOut className="h-4 w-4 mr-2 text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside 
          className="hidden md:block fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200 dark:bg-[#171717] dark:border-[#262626]"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-slate-300 active:bg-slate-400 dark:hover:bg-slate-700 dark:active:bg-slate-600 transition-colors group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-slate-200 group-hover:bg-slate-400 dark:bg-slate-800 dark:group-hover:bg-slate-600 rounded-full transition-colors" />
          </div>
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200 dark:border-[#262626] px-3 py-4">
              <button
                type="button"
                onClick={() => router.push(ROUTES.DASHBOARD)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-[#262626]"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 dark:bg-[#262626] dark:text-slate-200 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5" />
                </div>
                {sidebarWidth >= 150 && (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{branding.systemName}</p>
                    <p className="truncate text-xs text-muted-foreground">{branding.tagline}</p>
                  </div>
                )}
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {menuItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = pathname.includes(item.path) || (item.path === "/patients" && pathname.includes("/patient/"));
                const showText = sidebarWidth >= 150;
                
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => router.push(item.path)}
                    className={`w-full h-11 rounded-lg border-l-4 transition-all duration-200 ${
                      showText ? 'justify-start gap-3' : 'justify-center px-0'
                    } ${
                      isActive
                        ? "bg-blue-50 text-black font-semibold border-blue-600 dark:bg-slate-800 dark:text-blue-400 dark:border-blue-600"
                        : "border-transparent text-black hover:border-blue-600/45 hover:bg-blue-50 hover:text-black dark:text-slate-300 dark:hover:border-blue-600/70 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                    }`}
                  >
                    <ItemIcon className={`h-4 w-4 ${showText ? '' : ''}`} />
                    {showText && <span className="truncate text-sm">{t(item.label)}</span>}
                  </Button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main 
          className="flex-1 p-6 pt-16"
          style={{ marginLeft: isMobile ? '0' : `${sidebarWidth}px` }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
