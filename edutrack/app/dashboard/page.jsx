"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only check for admin role, middleware handles authentication
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/login?error=admin_required');
    }
  }, [session, status, router]);

  // Display loading state
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Only show dashboard if authenticated and admin
  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-4">Welcome, {session.user.name || session.user.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Students" count="..." link="#" />
          <DashboardCard title="Instructors" count="..." link="#" />
          <DashboardCard title="Courses" count="..." link="#" />
        </div>
      </div>
    );
  }

  // Return loading UI while redirects happen
  return <div className="flex justify-center items-center min-h-screen">Checking authorization...</div>;
}

function DashboardCard({ title, count, link }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold mb-4">{count}</p>
      <a href={link} className="text-blue-600 hover:underline">Manage {title}</a>
    </div>
  );
}