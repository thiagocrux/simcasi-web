'use client';

import { CircleUser, LogOut } from 'lucide-react';

import { signOutAction } from '@/app/actions/authActions';
import { usePathname } from 'next/navigation';
import ThemeSwitch from '../molecules/ThemeSwitch';

export default function Navbar() {
  const pathname = usePathname();
  const showButtons = pathname !== '/sign-in';

  async function logOut() {
    await signOutAction();
  }

  return (
    <nav className="border-border mb-12 flex min-h-16 items-center justify-between border-b-1 px-8">
      <div>
        <p>LOGO</p>
      </div>
      <div className="flex items-center gap-x-2">
        {showButtons && (
          <>
            <button className="hover:bg-surface cursor-pointer rounded-md p-2">
              <CircleUser size={20} />
            </button>
            <button
              className="hover:bg-surface cursor-pointer rounded-md p-2"
              onClick={logOut}
            >
              <LogOut size={20} />
            </button>
          </>
        )}
        <ThemeSwitch />
      </div>
    </nav>
  );
}
