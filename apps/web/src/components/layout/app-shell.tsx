import * as React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FiHome, FiPieChart, FiActivity, FiUser, FiInfo } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Foundation', href: '/', icon: FiHome },
  { name: 'Nutrition', href: '/nutrition', icon: FiPieChart },
  { name: 'Activity', href: '/activity', icon: FiActivity },
  { name: 'Body', href: '/body', icon: FiUser },
  { name: 'About', href: '/about', icon: FiInfo },
];

export const AppShell: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card">
        <div className="flex h-14 items-center px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs tracking-wider">
              V
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">VitaSync</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-secondary text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon
                  className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="rounded-md bg-surface-subtle p-3 border border-border">
            <p className="text-xs font-semibold text-foreground">Phase 1 Foundation</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Light theme only &middot; Android first
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Top Header (hidden on desktop) */}
        <header className="sticky top-0 z-40 md:hidden flex h-14 items-center justify-between px-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
              V
            </div>
            <span className="font-semibold text-sm text-foreground">VitaSync</span>
          </div>
          <span className="text-xs text-muted-foreground">Phase 1</span>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (hidden on desktop) */}
        <nav
          aria-label="Mobile Navigation"
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around h-16 border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] shadow-sm"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors',
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5 mb-0.5" />
                <span className="text-[10px] leading-tight tracking-tight">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
