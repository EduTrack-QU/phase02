'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log(`Attempting login with email: ${formValues.email}`);

            const res = await signIn('credentials', {
                redirect: false,
                email: formValues.email,
                password: formValues.password,
                callbackUrl,
            });

            console.log('SignIn response:', res);

            if (!res?.error) {
                router.push(callbackUrl);
            } else {
                console.error('Login error:', res.error);
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Login catch error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGithubSignIn = () => {
        signIn('github', {
            callbackUrl,
            redirect: true
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Login</h1>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formValues.email}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formValues.password}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleGithubSignIn}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            GitHub
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        By logging in, you agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                            terms of use
                        </Link>{' '}
                        &{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                            privacy policy
                        </Link>
                        .
                    </p>
                    <p className="mt-4 italic">
                        Students, instructors, and admins use the same login portal.
                    </p>
                    <p className="mt-6">
                        Need help?{' '}
                        <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                            Contact IT support
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
} 