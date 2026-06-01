'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Component, TerminalSquare, Gamepad2 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Contributors', href: '/contributors', icon: Users },
    { name: 'Showcase', href: '/showcase', icon: Component },
    { name: 'Games', href: '/games', icon: Gamepad2 },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col min-h-full">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <TerminalSquare className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
        <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">DevForge</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white'
                }`}
            >
              <Icon
                className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500'
                  }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <a
          href="https://github.com/Dhia-Bechattaoui/dev-forge"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-xl hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        >
          GitHub Repository
        </a>
      </div>
    </aside>
  );
}
