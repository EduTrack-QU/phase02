"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import LogoutButton from '../components/LogoutButton';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">EduTrack Dashboard</h1>
          <div className="flex items-center space-x-4">
            <UserProfile />
            <LogoutButton />
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-6">Welcome, {session.user.name}!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => router.push('/statistics')}
                  className="text-blue-600 hover:underline"
                >
                  View Statistics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/profile')}
                  className="text-blue-600 hover:underline"
                >
                  Edit Profile
                </button>
              </li>
            </ul>
          </div>
          
          {/* Add more dashboard widgets here */}
        </div>
      </main>
    </div>
  );
}