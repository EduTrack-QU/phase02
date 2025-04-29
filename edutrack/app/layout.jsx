'use client';

import "./globals.css";
import Image from "next/image";
import Link from "next/link";

// export const metadata = {
//   title: "Student tracking app",
//   description: "project",
// };

const Header = () => {
  const handleLogout = () => {
    console.log("Logout clicked");
    // Add actual logout logic here
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <Image 
          src="/media/cap.svg" 
          alt="cap icon" 
          width={24} 
          height={24} 
          className="inline-icon" 
        />
        <h3>
          <Link href="/dashboard">
            EduTrack-QU
          </Link>
        </h3>
      </div>
      
      <div className="header-center">
        <Image 
          src="/media/qulogo.png" 
          alt="QU logo" 
          width={100} 
          height={40} 
          className="qu-logo" 
        />
      </div>
      
      <div className="header-right">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header/>
        <main>{children}</main>
      </body>
    </html>
  );
}
