import React, { useState } from "react";
import {useTranslations} from 'next-intl';
import { useAuth } from "@/components/providers/AuthContext";
import { useFeatures, useText } from '@/lib/useFeatures';
import { ROUTES, ROLES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSwitcher } from "@/components/shared/navigation/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { NotificationDropdown } from "@/components/shared/notifications/NotificationDropdown";
import { useTheme } from "@/components/providers/ThemeProvider";
import { BranchSelector } from "@/components/shared/navigation/BranchSelector";
import { useIsMobile } from '@/components/ui/use-mobile';
import { PermissionStrategy } from '@/lib/strategies/permission.strategy';
import { getRoleColor } from '@/lib/constants/status';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations('common');
  const { user, logout, permissions } = useAuth();
  const features = useFeatures();
  const text = useText();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

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

  //   const getRoleDisplayName = (role: UserRole) => {
  //     return role.charAt(0).toUpperCase() + role.slice(1);
  //   };

  const NavigationContent = () => (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => {
        const ItemIcon = item.icon;
        const isActive = pathname.endsWith(item.path);
        return (
          <Button
            key={item.path}
            variant="ghost"
            className={`w-full justify-start transition-all duration-300 ${
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-muted"
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
              onClick={() => router.push(ROUTES.DASHBOARD)}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl group transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:shadow-xl hover:shadow-blue-500/20"
                >

                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                      className="transition-all duration-300 group-hover:brightness-110"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white text-xs font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden lg:flex flex-col items-start">
                    <p className="text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                      {user.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`${getRoleColor(
                        user.role
                      )} text-[10px] font-semibold px-2 py-0 h-5 transition-all duration-300`}
                    >
                      <RoleIcon className="h-2.5 w-2.5 mr-1" />
                      {text.roles[user.role]}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 animate-in slide-in-from-top-2 duration-300 border-blue-500/20 shadow-2xl shadow-blue-500/10 bg-card/95 backdrop-blur-xl"
              >
                <DropdownMenuLabel className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10" />

                    {/* Floating orb effect */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    <div
                      className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />

                    <div className="relative flex items-center space-x-3 p-4 animate-in fade-in-50 duration-300">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-500/30 transition-all duration-300 hover:ring-blue-500/60 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className="transition-all duration-300 hover:brightness-110"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-base">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 animate-in slide-in-from-left-2 duration-300 delay-100">
                        <p className="font-bold text-foreground text-base">
                          {user.name}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`${getRoleColor(
                            user.role
                          )} text-xs font-medium mt-1`}
                        >
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {text.roles[user.role]}
                        </Badge>
                        {user.department && (
                          <p className="text-xs text-muted-foreground mt-1 animate-in fade-in duration-300 delay-200">
                            📍 {user.department}
                          </p>
                        )}
                        {user.specialization && user.role === ROLES.DOCTOR && (
                          <p className="text-xs text-muted-foreground animate-in fade-in duration-300 delay-300">
                            🩺 {user.specialization}
                          </p>
                        )}
                      </div>
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
                <DropdownMenuItem
                  onClick={() => router.push(ROUTES.PROFILE)}
                  className="cursor-pointer group"
                >
                  <User className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(ROUTES.SETTINGS)}
                  className="cursor-pointer group"
                >
                  <Settings className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                  {t('settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive cursor-pointer group"
                >
                  <LogOut className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-[73px]">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:block fixed left-0 top-[73px] bottom-0 bg-gradient-to-b from-card via-card to-card/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${desktopSidebarCollapsed ? 'w-20' : 'w-64'} group/sidebar`}>
          {/* Sidebar border with gradient */}
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
          
          {/* Navigation */}
          <nav className={`h-full overflow-y-auto overflow-x-hidden ${desktopSidebarCollapsed ? 'px-2 py-4' : 'px-3 pt-14 pb-4'}`}>
            {/* Toggle button inside collapsed nav */}
            {desktopSidebarCollapsed && (
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDesktopSidebarCollapsed(false)}
                  className="w-full justify-center p-2.5 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                >
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                </Button>
              </div>
            )}
            
            {/* Toggle button on border when expanded */}
            {!desktopSidebarCollapsed && (
              <div className="absolute -right-3 top-6 z-20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDesktopSidebarCollapsed(true)}
                  className="h-6 w-6 rounded-full bg-card p-0 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 border border-border"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = pathname.endsWith(item.path);
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => router.push(item.path)}
                    title={desktopSidebarCollapsed ? item.label : undefined}
                    className={`w-full transition-all duration-200 ${desktopSidebarCollapsed ? 'justify-center px-0 h-12' : 'justify-start px-3 h-11'} ${isActive ? 'bg-gradient-to-r from-blue-500/15 to-purple-500/15 text-blue-600 font-medium shadow-sm' : 'hover:bg-muted/50'}`}
                  >
                    <ItemIcon className={`${desktopSidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3'} ${isActive ? 'text-blue-600' : ''}`} />
                    {!desktopSidebarCollapsed && <span className="truncate">{t(item.label)}</span>}
                  </Button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-3 sm:p-4 md:p-6 bg-background overflow-x-auto transition-all duration-300 ${desktopSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
