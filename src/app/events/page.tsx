"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowLeft, X, ExternalLink, Calendar, Users, MapPin, Tag } from "lucide-react";
import EventCard from "@/components/shared/EventCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CATEGORIES = ["All Categories", "Technology", "Finance", "Healthcare", "Design", "Environment", "Engineering", "Hardware", "Software"];

import { useRouter } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch Internal Events
        const querySnapshot = await getDocs(collection(db, "events"));
        const internalEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isExternal: false,
        }));
        
        // Fetch External Live Events
        let externalEvents: any[] = [];
        try {
          const res = await fetch("http://localhost:8000/api/events/live");
          const data = await res.json();
          if (data && data.status === "success") {
            externalEvents = data.data.map((evt: any) => ({
              ...evt,
              isExternal: true, // Mark it so we can open modal instead of routing
              organizedBy: "External Partner",
            }));
          }
        } catch (fetchErr) {
          console.error("Error fetching external events:", fetchErr);
        }

        // Combine and set
        setEvents([...internalEvents, ...externalEvents]);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (event.organizedBy && event.organizedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (event.tags && event.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = activeCategory === "All Categories" || (event.tags && event.tags.includes(activeCategory));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, events]);

  return (
    <div className="min-h-screen bg-background py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-border/50 hover:bg-white/5" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Button>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Browse Events</h1>
              <p className="text-muted-foreground text-lg">
                Find the perfect event to sponsor and reach your target audience.
              </p>
            </div>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search events, tags, organizers..." 
                className="pl-9 bg-card h-11 border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 bg-card border-border/50">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button 
              key={category} 
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${category === activeCategory ? "bg-foreground text-background border-foreground shadow-md" : "bg-card border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {loading ? (
             <div className="col-span-full py-20 flex justify-center">
                 <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} onClick={(e) => {
                if (event.isExternal) {
                  e.preventDefault();
                  setSelectedEvent(event);
                }
              }}>
                 {/* Provide a wrapper to catch click if it is external. We conditionally add Link wrapper inside EventCard, normally it routes. If external we intercept. */}
                 {event.isExternal ? (
                   <div className="cursor-pointer h-full transition-transform hover:-translate-y-1">
                      <EventCard {...event} isExternal={true} />
                   </div>
                 ) : (
                   <Link href={`/events/${event.id}`} className="block h-full transition-transform hover:-translate-y-1">
                      <EventCard {...event} />
                   </Link>
                 )}
              </div>
            ))
          )}
        </div>
        
        {!loading && filteredEvents.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl bg-card/20 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p>Try adjusting your search filters or browse all categories.</p>
          </div>
        )}
      </div>

      {/* Floating Modal for External Events */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
           
           {/* Modal Dialog */}
           <div className="relative bg-card border border-border/50 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
              
              {/* Header Image/Gradient */}
              <div className="h-40 bg-gradient-to-br from-accent/20 to-blue-500/20 w-full relative">
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/20 hover:bg-background/40 text-foreground" onClick={() => setSelectedEvent(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-6">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent text-white shadow-sm mb-2">
                    External Live Event
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">{selectedEvent.title}</h2>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accent" /> {selectedEvent.date}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-accent" /> {selectedEvent.location}</div>
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-accent" /> {selectedEvent.participants.toLocaleString()} Attendees</div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-lg border-b border-border/50 pb-2">About this event</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedEvent.description || "Join us for this amazing live event happening now. Network with industry leaders, participate in workshops, and discover new opportunities."}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full flex items-center">
                        <Tag className="w-3 h-3 mr-1 opacity-70" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border/50 bg-background/50 flex justify-between items-center sm:flex-row flex-col-reverse gap-4">
                <Button variant="ghost" className="w-full sm:w-auto text-muted-foreground hover:text-foreground" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button className="w-full sm:w-auto shadow-md shadow-accent/20">
                  <ExternalLink className="w-4 h-4 mr-2" /> Request Sponsorship Docs
                </Button>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}
