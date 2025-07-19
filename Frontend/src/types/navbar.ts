export interface NavbarProps {
  isAuthenticated: boolean;
  user?: { name: string; avatarUrl?: string };
  onLogout?: () => void;
  title?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
}

export interface User {
  name: string;
  avatarUrl?: string;
}
