import { Link, useLocation } from "wouter";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export default function Header({ toggleMobileMenu }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-10 h-10 text-[#E81C23]"
          >
            <rect width="24" height="24" rx="12" fill="#E81C23" />
            <path d="M12 6L14 10.5L19 11.5L15.5 15L16.5 20L12 17.5L7.5 20L8.5 15L5 11.5L10 10.5L12 6Z" fill="white" />
          </svg>
          <h1 className="font-poppins font-bold text-[#E81C23] text-xl ml-2 md:text-2xl">Günün Kelimesi</h1>
        </div>
        
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
            className="text-dark p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/">
            <a className={`${location === '/' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] transition-colors duration-200 font-medium`}>
              Home
            </a>
          </Link>
          <Link href="/history">
            <a className={`${location === '/history' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] transition-colors duration-200 font-medium`}>
              History
            </a>
          </Link>
          <Link href="/search">
            <a className={`${location === '/search' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] transition-colors duration-200 font-medium`}>
              Search
            </a>
          </Link>
          <Link href="/practice">
            <a className={`${location === '/practice' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] transition-colors duration-200 font-medium`}>
              Practice
            </a>
          </Link>
          <Link href="/about">
            <a className={`${location === '/about' ? 'text-[#00A9E0]' : 'text-dark'} hover:text-[#E81C23] transition-colors duration-200 font-medium`}>
              About
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
