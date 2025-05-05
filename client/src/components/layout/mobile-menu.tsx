import { Link, useLocation } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MobileMenu({ isOpen }: MobileMenuProps) {
  const [location] = useLocation();
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex flex-col space-y-3">
          <Link href="/">
            <a className={`${location === '/' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] py-2 border-b border-gray-light transition-colors duration-200 font-medium`}>
              Home
            </a>
          </Link>
          <Link href="/history">
            <a className={`${location === '/history' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] py-2 border-b border-gray-light transition-colors duration-200 font-medium`}>
              History
            </a>
          </Link>
          <Link href="/search">
            <a className={`${location === '/search' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] py-2 border-b border-gray-light transition-colors duration-200 font-medium`}>
              Search
            </a>
          </Link>
          <Link href="/practice">
            <a className={`${location === '/practice' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] py-2 border-b border-gray-light transition-colors duration-200 font-medium`}>
              Practice
            </a>
          </Link>
          <Link href="/about">
            <a className={`${location === '/about' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] py-2 transition-colors duration-200 font-medium`}>
              About
            </a>
          </Link>
        </nav>
      </div>
    </div>
  );
}
