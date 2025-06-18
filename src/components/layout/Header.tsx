import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"; // Example usage
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile menu
import { Menu, Settings, LogOut, UserCircle2 } from 'lucide-react'; // Example icons

interface HeaderProps {
  userName?: string;
  userAvatarUrl?: string;
  onLogout?: () => void;
  // Add other props as needed, e.g., navigation items
}

const Header: React.FC<HeaderProps> = ({ userName, userAvatarUrl, onLogout }) => {
  console.log("Rendering Header");

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/appointments", label: "Appointments" },
    { href: "/records", label: "Records" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            {/* Placeholder for a logo/brand icon */}
            <UserCircle2 className="h-6 w-6 text-blue-600" />
            <span className="hidden font-bold sm:inline-block">HealthApp</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link to={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-lg font-medium text-foreground hover:text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {userName ? (
            <>
              <span className="text-sm font-medium hidden sm:inline">Welcome, {userName}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatarUrl} alt={userName} />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {onLogout && (
                <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
              <Link to="/profile/settings"> {/* Example settings link */}
                <Button variant="ghost" size="icon" aria-label="Settings">
                    <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;