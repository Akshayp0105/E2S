import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight">E2S</span>
          </div>
          <p className="text-sm text-muted">
            The modern marketplace connecting visionary event organizers with leading sponsors.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">For Organizers</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/events/new" className="hover:text-accent transition-colors">Post an Event</Link></li>
            <li><Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link></li>
            <li><Link href="/" className="hover:text-accent transition-colors">Success Stories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">For Sponsors</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/events" className="hover:text-accent transition-colors">Browse Events</Link></li>
            <li><Link href="/dashboard" className="hover:text-accent transition-colors">Sponsor Dashboard</Link></li>
            <li><Link href="/" className="hover:text-accent transition-colors">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-accent transition-colors">About</Link></li>
            <li><Link href="/" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            <li><Link href="/" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border flex flex-col items-center gap-2 text-center text-sm text-muted">
        <span>© {new Date().getFullYear()} E2S. All rights reserved.</span>
        <span className="text-xs text-muted-foreground bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
          Powered by <strong className="text-accent underline decoration-accent/30 underline-offset-2">Korvet Innovations</strong>
        </span>
      </div>
    </footer>
  );
}
