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
  TooltipProvider,
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
  HelpCircle,
  Building2,
  Clock,
  Lock,
  Bell,
  Download,
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
  const [scrollY, setScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <header
        className="fixed top-0 z-50 border-b border-border/50 w-full transition-all duration-300 bg-card shadow-md"
      >
        <div className="flex items-center justify-between px-6 h-16 bg-card shadow-sm">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 [&>button]:hidden">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">{branding.systemName}</h2>
                        <p className="text-xs text-muted-foreground">{branding.tagline}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(false)}
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                  <NavigationContent />
                </SheetContent>
              </Sheet>
            )}

            <div className="hidden md:flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push(ROUTES.DASHBOARD)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 hidden lg:block">
                <p className="truncate text-sm font-bold text-foreground">{branding.systemName}</p>
                <p className="truncate text-xs text-muted-foreground">{branding.tagline}</p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <BranchSelector />
            </div>
            <div className="w-px h-6 bg-border/30" />
            <LanguageSwitcher />
            <div className="w-px h-6 bg-border/30" />
            {features.notifications && <NotificationDropdown />}
            <div className="w-px h-6 bg-border/30" />
            <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative p-0 h-10 w-10 rounded-full hover:bg-sidebar-accent transition-colors duration-200"
                  onMouseEnter={() => setIsProfileHovered(true)}
                  onMouseLeave={() => setIsProfileHovered(false)}
                >
                  <div className={`relative ${isProfileHovered ? 'ring-4 ring-offset-2 ring-primary rounded-full' : ''}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-0">
                {/* Header with Avatar, Name, and Settings */}
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="hover:scale-110 transition-transform duration-200 cursor-pointer">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-base truncate">{user.name}</p>
                      <Badge className={`text-xs mt-1 ${getRoleColor(user.role)}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {text.roles[user.role]}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      router.push(ROUTES.SETTINGS);
                      setIsProfileOpen(false);
                    }}
                    className="flex-shrink-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  >
                    <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </Button>
                </div>

                {/* Department and Last Login */}
                <div className="px-4 py-2 space-y-1 border-b">
                  {user.department && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  {user.lastLogin && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <DropdownMenuItem onClick={() => {
                    router.push(ROUTES.PROFILE);
                    setIsProfileOpen(false);
                  }} className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 cursor-pointer group mx-2 rounded">
                    <User className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    {t("profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    router.push(ROUTES.HELP);
                    setIsProfileOpen(false);
                  }} className="hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 cursor-pointer group mx-2 rounded">
                    <HelpCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all duration-200 cursor-pointer group mx-2 rounded">
                    <Bell className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 cursor-pointer group mx-2 rounded">
                    <Lock className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                    Privacy & Security
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all duration-200 cursor-pointer group mx-2 rounded">
                    <Download className="h-4 w-4 mr-2 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                    Download Data
                  </DropdownMenuItem>
                </div>

                {/* Footer with Dark Mode and Logout */}
                <div className="flex items-center justify-between gap-2 p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4" />
                        <span className="text-xs">Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        <span className="text-xs">Dark</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-xs">{t("logout")}</span>
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside 
          className="hidden md:block fixed left-0 top-14 bottom-0 bg-card border-r border-border"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-slate-300 active:bg-slate-400 dark:hover:bg-slate-700 dark:active:bg-slate-600 transition-colors group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-slate-200 group-hover:bg-slate-400 dark:bg-slate-800 dark:group-hover:bg-slate-600 rounded-full transition-colors" />
          </div>
          <div className="flex h-full flex-col">
            <nav className="flex-1 overflow-y-auto p-3 space-y-1 mt-4">
              <TooltipProvider delayDuration={0}>
                {menuItems.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = pathname.includes(item.path) || (item.path === "/patients" && pathname.includes("/patient/"));
                  const showText = sidebarWidth >= 150;
                  
                  const button = (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => router.push(item.path)}
                      className={`w-full h-11 rounded-lg border-l-4 transition-all duration-200 ${
                        showText ? 'justify-start gap-3' : 'justify-center px-0'
                      } ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold border-primary"
                          : "border-transparent text-foreground hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <ItemIcon className={`h-4 w-4 ${showText ? '' : ''}`} />
                      {showText && <span className="truncate text-sm">{t(item.label)}</span>}
                    </Button>
                  );

                  if (!showText) {
                    return (
                      <Tooltip key={item.path}>
                        <TooltipTrigger asChild>
                          {button}
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                          {t(item.label)}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return button;
                })}
              </TooltipProvider>
            </nav>
          </div>
        </aside>

        <main 
          className="flex-1 p-6 pt-20"
          style={{ marginLeft: isMobile ? '0' : `${sidebarWidth}px` }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
