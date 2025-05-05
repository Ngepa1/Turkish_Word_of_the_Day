import { Link, useLocation } from "wouter";
import { 
  Home, 
  Clock, 
  Search, 
  Brain,
  Info 
} from "lucide-react";

export default function MobileNavbar() {
  const [location] = useLocation();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-light z-50">
      <div className="flex justify-between px-1">
        <Link href="/">
          <a className={`flex flex-col items-center py-2 px-3 ${location === '/' ? 'text-[#00A9E0]' : 'text-gray-600'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/history">
          <a className={`flex flex-col items-center py-2 px-3 ${location === '/history' ? 'text-[#00A9E0]' : 'text-gray-600'}`}>
            <Clock className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex flex-col items-center py-2 px-3 ${location === '/search' ? 'text-[#00A9E0]' : 'text-gray-600'}`}>
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        <Link href="/practice">
          <a className={`flex flex-col items-center py-2 px-3 ${location === '/practice' ? 'text-[#00A9E0]' : 'text-gray-600'}`}>
            <Brain className="h-5 w-5" />
            <span className="text-xs mt-1">Practice</span>
          </a>
        </Link>
        <Link href="/about">
          <a className={`flex flex-col items-center py-2 px-3 ${location === '/about' ? 'text-[#00A9E0]' : 'text-gray-600'}`}>
            <Info className="h-5 w-5" />
            <span className="text-xs mt-1">About</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
