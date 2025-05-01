"use client";

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
    >
      Sign Out
    </button>
  );
}