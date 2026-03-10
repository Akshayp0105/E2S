"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import EventCard from "@/components/shared/EventCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CATEGORIES = ["All Categories", "Technology", "Finance", "Healthcare", "Design", "Environment", "Engineering", "Hardware", "Software"];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
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
                            event.organizedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (event.tags && event.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = activeCategory === "All Categories" || (event.tags && event.tags.includes(activeCategory));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, events]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-white/10 hover:bg-white/5">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
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
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${category === activeCategory ? "bg-foreground text-background border-foreground" : "bg-card border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {filteredEvents.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            No events found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
