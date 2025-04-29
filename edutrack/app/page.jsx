'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
    
    router.push('/dashboard');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Login</h1>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <span role="img" aria-label="lock">🔒</span> By logging in, you agree to the{' '}
          <Link href="/terms" className="text-blue-500 hover:underline">
            terms of use
          </Link>
          {' '}&{' '}
          <Link href="/privacy" className="text-blue-500 hover:underline">
            privacy policy
          </Link>
          .
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Need help?{' '}
          <Link href="/support" className="text-blue-500 hover:underline">
            Contact IT support
          </Link>.
        </div>
      </div>
    </div>
  );
}
