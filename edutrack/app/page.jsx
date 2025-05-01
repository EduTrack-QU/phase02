'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">EduTrack</h1>
        
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="block w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition text-center"
          >
            Login
          </Link>
          
          <div className="text-center text-sm text-gray-600">
            Manage your educational journey with EduTrack - the comprehensive education management system.
          </div>
        </div>
      </div>
    </div>
  );
}
