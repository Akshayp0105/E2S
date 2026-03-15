"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Calendar, TrendingUp, HandshakeIcon, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import EventCard from "@/components/shared/EventCard";
import SponsorCard from "@/components/shared/SponsorCard";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";

// Dummy Data
const DUMMY_EVENTS = [
  {
    id: "1",
    title: "Global Tech Hackathon 2026",
    organizedBy: "Stanford Computer Science Dept",
    date: "Oct 15 - Oct 17, 2026",
    location: "San Francisco, CA",
    participants: 5000,
    tags: ["Technology", "AI", "Students"],
    status: "looking_for_sponsors" as const,
  },
  {
    id: "2",
    title: "Eco Innovators Summit",
    organizedBy: "GreenTech NGO",
    date: "Nov 02, 2026",
    location: "New York, NY",
    participants: 1200,
    tags: ["Environment", "Startup", "Pitch"],
    status: "sponsored" as const,
  },
];

const DUMMY_SPONSORS = [
  {
    id: "s1",
    name: "Aether Dynamics",
    industry: "Cloud Infrastructure",
    tier: "Platinum" as const,
    eventsSponsored: 24,
    reputation: "high" as const,
  },
  {
    id: "s2",
    name: "FinTech Global",
    industry: "Financial Services",
    tier: "Gold" as const,
    eventsSponsored: 12,
    reputation: "high" as const,
  },
];

export default function DashboardOverview() {
  const [viewRole, setViewRole] = useState<"taker" | "giver" | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [userName, setUserName] = useState("there");
  const [stats, setStats] = useState({
    totalRaised: 0,
    profileViews: 0,
    investment: 0,
    impressions: 0,
    pendingOffers: 0,
    sponsorshipRequests: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!auth.currentUser) return;

        // Fetch user role
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setViewRole(data.role || "taker");
          if (data.email) {
            setUserName(data.email.split('@')[0]);
          }
          
          // Set stats from user data or default to 0
          setStats({
            totalRaised: data.totalRaised || 0,
            profileViews: data.profileViews || 0,
            investment: data.investment || 0,
            impressions: data.impressions || 0,
            pendingOffers: data.pendingOffers || 0,
            sponsorshipRequests: data.sponsorshipRequests || 0,
          });
        }

        // Fetch real events
        const qEvents = query(collection(db, "events"), limit(4));
        const eventSnapshot = await getDocs(qEvents);
        const fetchedEvents = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(fetchedEvents);

        // Fetch real sponsors
        // In a real app, query based on user's involvement
        const qSponsors = query(collection(db, "users"), limit(4));
        const sponsorSnapshot = await getDocs(qSponsors);
        const fetchedSponsors = sponsorSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() as any }))
          .filter(s => s.role === 'giver');
        setSponsors(fetchedSponsors);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state specifically for the dashboard mount
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchDashboardData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  // Fallback to "taker" if no role detected
  const isOrganizer = viewRole === "taker";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Overview</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back, <span className="text-accent font-medium">{userName}</span>! Here&apos;s your personalized dashboard.
          </p>
        </div>
      </motion.div>

      {/* STATS WIDGETS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isOrganizer ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active Events" value={events.length.toString()} icon={Calendar} trend={`+${events.length} this month`} delay={0.1} />
            <StatCard title="Sponsorship Requests" value={stats.sponsorshipRequests.toString()} icon={HandshakeIcon} trend="+4 this week" delay={0.2} />
            <StatCard title="Total Raised" value={`$${stats.totalRaised.toLocaleString()}`} icon={TrendingUp} trend="+12% from last year" delay={0.3} />
            <StatCard title="Profile Views" value={stats.profileViews.toString()} icon={Users} trend="+24% this week" delay={0.4} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active Sponsorships" value={sponsors.length.toString()} icon={HandshakeIcon} trend="+2 this month" delay={0.1} />
            <StatCard title="Pending Offers" value={stats.pendingOffers.toString()} icon={Calendar} trend="Awaiting response" delay={0.2} />
            <StatCard title="Investment" value={`$${stats.investment.toLocaleString()}`} icon={TrendingUp} trend="+5% from last year" delay={0.3} />
            <StatCard title="Total Impressions" value={stats.impressions.toLocaleString()} icon={Users} trend="+18% this event season" delay={0.4} />
          </div>
        )}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* MAIN COLUMN */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              {isOrganizer ? "Your Latest Events" : "Recommended Events For You"}
            </h2>
            {isOrganizer && (
              <Link href="/events/new">
                <Button size="sm" className="gap-2 shadow-lg hover:shadow-accent/20 transition-all shadow-accent/10">
                  <Plus className="w-4 h-4" />
                  Create Event
                </Button>
              </Link>
            )}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {events.length > 0 ? events.map(event => (
              <EventCard key={event.id} {...event} compact={true} />
            )) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                 <p className="text-muted-foreground">No events found yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* SIDE COLUMN */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3 space-y-6 border border-border bg-card/40 backdrop-blur-md rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {isOrganizer ? "Recommended Sponsors" : "Recent Partnerships"}
            </h2>
            <Link href="/events" className="text-xs text-accent hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {isOrganizer ? (
              // Organizer sees Sponsors interested in them
              sponsors.length > 0 ? sponsors.map((sponsor, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={sponsor.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/80 hover:bg-secondary transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                      {sponsor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{sponsor.name}</h4>
                      <p className="text-xs text-muted-foreground">{sponsor.industry}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 text-xs text-accent hover:text-accent-hover hover:bg-accent/10">View details</Button>
                </motion.div>
              )) : <p className="text-sm text-muted-foreground text-center py-4">No sponsors available.</p>
            ) : (
              // Sponsor sees organizers they partnered with (mocking with events for now)
              events.length > 0 ? events.map((event, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={event.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/80 hover:bg-secondary transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                      {event.title.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-foreground">→</Button>
                </motion.div>
              )) : <p className="text-sm text-muted-foreground text-center py-4">No events partnered yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, delay = 0 }: { title: string, value: string, icon: any, trend: string, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 shadow-lg group hover:border-accent/50 transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex flex-row items-center justify-between space-y-0 pb-3">
          <h3 className="tracking-tight text-sm font-semibold text-muted-foreground">{title}</h3>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-extrabold">{value}</div>
          <p className="text-xs font-medium mt-2 text-accent flex items-center bg-accent/10 w-fit px-2 py-1 rounded-md">{trend}</p>
        </div>
      </div>
    </motion.div>
  );
}
