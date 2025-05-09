'use client';

import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import AuthProvider from './components/AuthProvider';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isLoginPage = pathname === "/" || pathname === "/login" || pathname === "/unauthorized";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="header-container py-4 px-6 md:px-10 flex justify-between items-center">
      <div className="header-left flex items-center gap-4">
        <Image
          src="/media/cap.svg"
          alt="cap icon"
          width={48}
          height={48}
          className="inline-icon"
        />
        <h3 className="text-2xl md:text-3xl font-bold">
          {isLoginPage ? (
            // On login page, show just text without link
            <span className="font-['Libre_Baskerville']">EduTrack-QU</span>
          ) : (
            // On other pages, show clickable link
            <Link href="/dashboard" className="font-['Libre_Baskerville'] hover:text-blue-700">
              EduTrack-QU
            </Link>
          )}
        </h3>
      </div>

      <div className="header-center">
        <Image
          src="/media/qulogo.png"
          alt="QU logo"
          width={180}
          height={72}
          className="qu-logo"
        />
      </div>

      {!isLoginPage && isAuthenticated && (
        <div className="header-right flex items-center gap-4">
          {session?.user?.name && (
            <span className="text-gray-700">
              {session.user.name} {session.user.role === 'ADMIN' ? '(Admin)' : ''}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="logout-button bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-lg font-medium rounded-md transition-colors duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
