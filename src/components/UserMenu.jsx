import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully 👋');
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button
            variant="outline"
            size="sm"
            className="border-[#f0e9e1] text-[#2c2a29] hover:bg-[#f5ebe2] text-xs h-8 cursor-pointer"
          >
            Sign In
          </Button>
        </Link>
        <Link to="/register">
          <Button
            size="sm"
            className="bg-[#c79261] hover:bg-[#b58150] text-white text-xs h-8 cursor-pointer"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2 cursor-pointer group outline-none">
          <Avatar className="w-8 h-8 border-2 border-[#c79261]/20 group-hover:border-[#c79261]/50 transition-colors">
            <AvatarFallback className="bg-gradient-to-br from-[#c79261] to-[#b58150] text-white text-xs font-bold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-[#2c2a29] hidden md:block">{user?.name?.split(' ')[0]}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-2">
          <p className="text-sm font-medium text-[#2c2a29]">{user?.name}</p>
          <p className="text-xs text-[#6b615a] truncate">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        
        <Link to="/dashboard">
          <DropdownMenuItem className="cursor-pointer font-medium text-[#c79261]">
            <Package className="w-4 h-4 mr-2" />
            B2B Portal
          </DropdownMenuItem>
        </Link>
        
        {user?.role === 'admin' && (
          <Link to="/admin">
            <DropdownMenuItem className="cursor-pointer font-bold text-red-600 focus:text-red-600 focus:bg-red-50">
              <Settings className="w-4 h-4 mr-2" />
              S-Admin Panel
            </DropdownMenuItem>
          </Link>
        )}
        
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            My Account
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
