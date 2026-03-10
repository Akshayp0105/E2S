import Link from "next/link";
import { Search, Compass, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="font-bold text-xl tracking-tight">E2S</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/events" className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2">
            <Compass className="w-4 h-4" />
            Browse Events
          </Link>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search sponsorships..." 
              className="pl-9 pr-4 py-1.5 rounded-full bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 w-64 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium hover:text-accent transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
