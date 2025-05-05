import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNavbar from "@/components/layout/mobile-navbar";
import OfflineIndicator from "@/components/offline-indicator";
import Home from "@/pages/home";
import History from "@/pages/history";
import Search from "@/pages/search";
import About from "@/pages/about";
import Practice from "@/pages/practice";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={History} />
      <Route path="/search" component={Search} />
      <Route path="/practice" component={Practice} />
      <Route path="/about" component={About} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="turkish-pattern font-nunito text-dark min-h-screen flex flex-col">
          <Header toggleMobileMenu={toggleMobileMenu} />
          <MobileMenu isOpen={isMobileMenuOpen} />
          
          <main className="flex-grow">
            <Router />
          </main>
          
          <Footer />
          <MobileNavbar />
          <OfflineIndicator />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
