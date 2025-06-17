import React from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            PhyGen Web
          </Link>
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} PhyGen Web. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
