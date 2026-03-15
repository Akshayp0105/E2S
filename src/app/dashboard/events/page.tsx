"use client";

import { useState, useEffect } from "react";
import { getDocs, collection, query, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, ExternalLink, Activity, Plus, FileText, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        if (!auth.currentUser) return;
        
        // In a real app we'd query by creator ID: where("creatorId", "==", auth.currentUser.uid)
        // For UI demo, we'll fetch a few events and pretend they belong to the user
        const q = query(collection(db, "events"), limit(3));
        const snapshot = await getDocs(q);
        
        const fetchedEvents: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (fetchedEvents.length === 0) {
          setEvents([]);
        } else {
          // Assign a visual status if not present (to support the tabs demo without failing)
          const decorated = fetchedEvents.map((ev, i) => ({
             ...ev, 
             status: ev.status || (i % 2 === 0 ? "upcoming" : "past"),
             sponsorshipStatus: ev.sponsorshipStatus || (i === 0 ? "funded" : "pending")
          }));
          setEvents(decorated);
        }
      } catch (err) {
        console.error("Error fetching my events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const displayedEvents = events.filter(e => e.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent inline-flex items-center gap-3">
            <Calendar className="w-8 h-8 text-accent" /> My Events
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your registered events, track sponsorship progress, and check updates.
          </p>
        </div>
        <Link href="/events/new">
          <Button className="h-11 shadow-lg shadow-accent/20 gap-2 font-semibold hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" /> Create New Event
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit mb-8">
        <button 
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'upcoming' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Upcoming Events
        </button>
        <button 
          onClick={() => setActiveTab("past")}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'past' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Past Events
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 border-2 border-dashed border-border rounded-xl">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 py-24 border-2 border-dashed border-border/50 rounded-2xl bg-card/20 backdrop-blur-sm text-center">
          <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-2xl font-bold tracking-tight mb-2">No {activeTab} events</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You don't have any {activeTab} events right now. Why not create one or browse the marketplace?
          </p>
          <Link href="/events">
            <Button variant="outline">Browse Events</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedEvents.map((event, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={event.id}
              className="bg-card/40 backdrop-blur-md rounded-2xl border border-border overflow-hidden shadow-lg hover:shadow-accent/5 hover:border-accent/40 transition-all flex flex-col sm:flex-row"
            >
              {/* Event Date Block */}
              <div className="bg-gradient-to-b from-accent/20 to-accent/5 sm:w-32 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-border backdrop-blur-md">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">
                  {event.date?.split(" ")[0]?.substring(0, 3) || 'TBS'}
                </span>
                <span className="text-4xl font-black text-foreground">
                  {event.date?.match(/\d+/)?.[0] || '--'}
                </span>
              </div>

              {/* Event Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-xl font-bold tracking-tight line-clamp-1">{event.title}</h3>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 ${
                    event.sponsorshipStatus === 'funded' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                    event.sponsorshipStatus === 'completed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                    'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  }`}>
                    {event.sponsorshipStatus === 'funded' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {event.sponsorshipStatus === 'funded' ? 'Funded' : event.sponsorshipStatus === 'completed' ? 'Completed' : 'Pending'}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                   <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location || "Online"}</div>
                   <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {event.participants?.toLocaleString() || "0"} Attendees</div>
                </div>

                {/* Timeline / Update snippet */}
                <div className="mt-auto bg-secondary/50 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">Latest Update</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {event.sponsorshipStatus === 'funded' 
                      ? "Aether Dynamics has successfully funded this event. All contracts are signed and verified."
                      : "Your sponsorship pitch deck has been viewed by 12 potential sponsors this week."}
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link href={`/events/${event.id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-xs h-10">View Details</Button>
                  </Link>
                  <Button variant="ghost" className="h-10 px-3 text-muted-foreground hover:text-foreground">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
