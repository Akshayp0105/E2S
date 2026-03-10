"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Users, Zap, Search, MessageSquare, Target, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import Antigravity from "@/components/ui/Antigravity";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LandingPage() {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, "events"), limit(3));
        const snapshot = await getDocs(q);
        setFeaturedEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching featured events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/events/live");
        if (res.ok) {
          const data = await res.json();
          if (data.status === "success" && data.data) {
            setLiveEvents(data.data);
          }
        }
      } catch (err) {
        console.error("Backend offline or error fetching live API events:", err);
      } finally {
        setLiveLoading(false);
      }
    };
    fetchLiveEvents();
  }, []);
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden flex flex-col items-center justify-center min-h-[90vh] py-20 px-4 text-center">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background z-20 pointer-events-none" />
          <Antigravity
            count={200}
            magnetRadius={8}
            ringRadius={10}
            waveSpeed={0.5}
            waveAmplitude={1.2}
            particleSize={1.5}
            lerpSpeed={0.08}
            color="#7c3aed"
            autoAnimate={true}
            particleVariance={1.5}
            rotationSpeed={0.2}
            depthFactor={1.5}
            pulseSpeed={2}
            particleShape="capsule"
            fieldStrength={10}
          />
        </div>
        
        <div className="max-w-4xl space-y-8 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-30">
          <div className="inline-flex items-center rounded-full border border-accent/40 bg-background/50 px-3 py-1 text-sm text-accent backdrop-blur-md shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2 mt-0.5"></span>
            The #1 Marketplace for Event Sponsorships
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Connect <span className="bg-gradient-to-r from-accent via-blue-500 to-accent bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">Visionary Events</span><br className="hidden md:block"/> With Leading Sponsors
          </h1>
          
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re organizing a college tech fest or looking to sponsor the next big hackathon, E2S makes discovering, connecting, and closing deals seamless.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup - purely visual */}
        <div className="w-full max-w-5xl mt-24 rounded-2xl border border-white/10 glass shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="h-10 bg-secondary border-b border-border flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-b from-secondary/30 to-background/50 text-left">
            <div className="col-span-1 border border-border/50 rounded-xl p-6 bg-background shadow-sm space-y-4 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.3)] hover:border-accent/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">For Organizers</h3>
              <p className="text-sm text-muted">Post your event, upload brochures, and attract sponsors that align with your audience.</p>
            </div>
            <div className="col-span-1 border border-border/50 rounded-xl p-6 bg-background shadow-sm space-y-4 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.3)] hover:border-accent/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">For Sponsors</h3>
              <p className="text-sm text-muted">Browse vetted events, find the perfect audience, and maximize your brand visibility.</p>
            </div>
            <div className="col-span-1 border border-border/50 rounded-xl p-6 bg-background shadow-sm space-y-4 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.3)] hover:border-accent/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Seamless Connection</h3>
              <p className="text-sm text-muted">Chat directly on the platform, negotiate terms, and build long-lasting partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-secondary py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
            <div className="space-y-2 flex flex-col items-center justify-center">
              <div className="flex items-center text-4xl font-bold">
                <Counter value={10000} places={[10000, 1000, 100, 10, 1]} fontSize={36} gap={2} gradientHeight={4} />
                <span className="text-accent ml-1">+</span>
              </div>
              <p className="text-sm text-muted font-medium">Active Events</p>
            </div>
            <div className="space-y-2 flex flex-col items-center justify-center">
              <div className="flex items-center text-4xl font-bold">
                <Counter value={5000} places={[1000, 100, 10, 1]} fontSize={36} gap={2} gradientHeight={4} />
                <span className="text-accent ml-1">+</span>
              </div>
              <p className="text-sm text-muted font-medium">Sponsors</p>
            </div>
            <div className="space-y-2 flex flex-col items-center justify-center">
              <div className="flex items-center text-4xl font-bold">
                <span className="text-accent mr-1">$</span>
                <Counter value={2} places={[1]} fontSize={36} gap={2} gradientHeight={0} />
                <span className="text-accent ml-1">M+</span>
              </div>
              <p className="text-sm text-muted font-medium">Sponsorships Closed</p>
            </div>
            <div className="space-y-2 flex flex-col items-center justify-center">
              <div className="flex items-center text-4xl font-bold">
                <Counter value={150} places={[100, 10, 1]} fontSize={36} gap={2} gradientHeight={4} />
                <span className="text-accent ml-1">+</span>
              </div>
              <p className="text-sm text-muted font-medium">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="w-full py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Featured Opportunities</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Discover high-potential events looking for partners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : featuredEvents.map((event) => (
              <div key={event.id} className="group relative rounded-2xl border border-border bg-background shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                <div className="aspect-[16/9] w-full bg-secondary relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <span className="text-muted-foreground/30 text-sm font-medium z-0">Poster Image</span>
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    {event.tags?.slice(0, 1).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 rounded text-xs font-semibold bg-white text-black">{tag}</span>
                    ))}
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-accent text-white">Looking for Sponsors</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-accent transition-colors">
                    <Link href={`/events/${event.id}`}>
                      <span className="absolute inset-0 z-10" aria-hidden="true" />
                      {event.title}
                    </Link>
                  </h3>
                  <p className="text-muted text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="mt-auto space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center text-sm text-muted">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-muted">
                      <Users className="h-4 w-4 mr-2" />
                      {event.participants}+ Participants
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Link href="/events">
              <Button variant="outline" size="lg">View All Internal Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live External Events Section */}
      <section className="w-full py-24 px-4 bg-secondary/30 border-t border-border relative overflow-hidden">
        {/* Glow behind the section */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto max-w-6xl space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-sm text-red-500 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)] mx-auto">
              <span className="flex h-2 w-2 shadow-[0_0_10px_rgba(239,68,68,1)] rounded-full bg-red-500 mr-2 animate-pulse"></span>
              Live External Network
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-red-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
                Happening Now
              </span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">External opportunities currently open for sponsorship.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : liveEvents.length === 0 ? (
               <div className="col-span-full text-center text-muted-foreground py-12">
                 FastAPI Backend is currently offine or no live events found. Run `uvicorn main:app --reload` in `/backend`.
               </div>
            ) : liveEvents.map((evt) => (
              <div key={evt.id} className="relative rounded-2xl border border-border bg-card shadow-lg p-6 flex flex-col hover:border-accent/40 transition-colors">
                <h3 className="font-semibold text-lg mb-2 flex items-start justify-between gap-2">
                  <span className="leading-tight">{evt.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/20 text-red-500 rounded border border-red-500/30 whitespace-nowrap">LIVE</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{evt.description}</p>
                
                <div className="mt-auto space-y-2 pt-4 border-t border-border/50 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" /> {evt.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" /> {evt.participants}+ Expected
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="container mx-auto max-w-4xl text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to take your events to the next level?</h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Join thousands of organizers and sponsors already using the platform to create meaningful partnerships.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8">Get Started Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
