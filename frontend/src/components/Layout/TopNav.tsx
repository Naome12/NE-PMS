import { Bell, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useParkingContext } from '@/context/ParkingContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/authContext';

interface TopNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const TopNav = ({ sidebarOpen, setSidebarOpen }: TopNavProps) => {
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary-900">Parking Management</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <div className="flex items-center">
            {currentUser && (
              <div className="mr-3 text-right hidden md:block">
                <p className="text-sm font-medium">{currentUser.firstName} {' '} {currentUser.lastName}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
              </div>
            )}
            <Avatar>
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {currentUser ? currentUser?.firstName?.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={logout} className="ml-2">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};