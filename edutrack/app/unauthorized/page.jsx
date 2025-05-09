import Link from 'next/link';

export default function Unauthorized() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md text-center">
                <svg
                    className="mx-auto h-16 w-16 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>

                <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>

                <p className="text-gray-600">
                    You don't have permission to access this page.
                    Only administrators can access the dashboard.
                </p>

                <div className="mt-6">
                    <Link
                        href="/"
                        className="inline-block rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
} 