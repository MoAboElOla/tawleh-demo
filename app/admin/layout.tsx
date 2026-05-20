"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Plus, Settings, LayoutGrid, ArrowLeft, Store } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Dishes", href: "/admin/dishes", icon: UtensilsCrossed },
  { label: "Add Dish", href: "/admin/add", icon: Plus },
  { label: "Restaurants", href: "/admin/restaurants", icon: Store },
  { label: "Settings", href: "/admin/settings", icon: Settings, disabled: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-light font-jakarta flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-border-soft shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-border-soft">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <LayoutGrid size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-text-main text-sm leading-none">Tawleh</p>
              <p className="text-text-muted text-xs mt-0.5">Restaurant Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon, exact, disabled }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={disabled ? "#" : href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  disabled
                    ? "text-text-muted opacity-40 cursor-not-allowed pointer-events-none"
                    : active
                    ? "bg-accent-blush text-primary"
                    : "text-text-muted hover:text-text-main hover:bg-bg-light"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border-soft">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-accent-blush"
          >
            <ArrowLeft size={13} />
            Back to Discovery
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-soft px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm text-text-main">Restaurant Portal</span>
        </div>
        <div className="flex gap-1">
          {navItems.filter(n => !n.disabled).map(({ label, href, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`p-2 rounded-lg transition-colors ${active ? "bg-accent-blush text-primary" : "text-text-muted"}`}
              >
                <Icon size={16} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:pt-0 pt-14 overflow-auto">
        {children}
      </main>
    </div>
  );
}
