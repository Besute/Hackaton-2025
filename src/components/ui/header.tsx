'use client';

import Link from 'next/link';

const Header = function() {
  return (
    <header className="bg-gray-500 shadow-lg sticky w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-[2rem] font-bold text-white">
              Бизнес маршрут
            </h1>
          </div>
          <nav className="flex space-x-1">
            <Link 
              href="/"
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-white text-[2rem]`}
            >
              Адреса
            </Link>
            <Link 
              href="/map"
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-white text-[2rem]`}
            >
              Карта
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;