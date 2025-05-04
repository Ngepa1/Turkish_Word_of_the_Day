import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="font-poppins font-bold text-xl text-[#E81C23]">Günün Kelimesi</h2>
            <p className="text-gray-400 text-sm mt-1">Learn Turkish one word at a time</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/about">
              <a className="text-gray-400 hover:text-[#E81C23] transition-colors duration-200">About</a>
            </Link>
            <a href="#" className="text-gray-400 hover:text-[#E81C23] transition-colors duration-200">Contact</a>
            <a href="#" className="text-gray-400 hover:text-[#E81C23] transition-colors duration-200">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-[#E81C23] transition-colors duration-200">Terms</a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Turkish Word of the Day. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
