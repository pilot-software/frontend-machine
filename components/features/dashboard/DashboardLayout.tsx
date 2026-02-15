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
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
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

            <div className="flex items-center gap-0.5 cursor-pointer" onClick={() => router.push(ROUTES.DASHBOARD)}>
              <Stethoscope className="h-5 w-5 text-foreground" />
              <div>
                <span className="text-base font-bold text-foreground">{branding.systemName}</span>
                <p className="text-xs text-muted-foreground hidden sm:block">{branding.tagline}</p>
              </div>
            </div>
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
                <Button variant="ghost" className="relative flex items-center gap-2 px-2">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {text.roles[user.role]}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)}>
                  <User className="h-4 w-4 mr-2" />
                  {t("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
                  <Settings className="h-4 w-4 mr-2" />
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        <aside 
          className="hidden md:block fixed left-0 top-14 bottom-0 bg-card border-r border-border"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary transition-colors group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-border group-hover:bg-primary rounded-full transition-colors" />
          </div>
          
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = pathname.includes(item.path) || (item.path === "/patients" && pathname.includes("/patient/"));
              const showText = sidebarWidth >= 150;
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => router.push(item.path)}
                  className={`w-full h-10 ${
                    showText ? 'justify-start' : 'justify-center px-0'
                  } ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-accent"
                  }`}
                >
                  <ItemIcon className={`h-4 w-4 ${showText ? 'mr-3' : ''}`} />
                  {showText && <span className="truncate">{t(item.label)}</span>}
                </Button>
              );
            })}
          </nav>
        </aside>

        <main 
          className="flex-1 p-6"
          style={{ marginLeft: isMobile ? '0' : `${sidebarWidth}px` }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
