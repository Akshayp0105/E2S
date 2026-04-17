"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Users, Zap, Search, MessageSquare, Target, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import Antigravity from "@/components/ui/Antigravity";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

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
        const res = await fetch("https://e2s-3.onrender.com/api/events/live");
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Featured Opportunities</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Discover high-potential events looking for partners.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : featuredEvents.map((event, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                key={event.id} 
                className="group relative rounded-2xl border border-border bg-background shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-accent/40 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/9] w-full bg-secondary relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                  <span className="text-muted-foreground/30 text-sm font-medium z-0">Poster Image</span>
                  <div className="absolute top-0 right-0 p-4 z-20 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                     <div className="bg-background/80 backdrop-blur-md rounded-full shadow-lg p-2">
                       <ArrowRight className="w-5 h-5 text-accent -rotate-45" />
                     </div>
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    {event.tags?.slice(0, 1).map((tag: string) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-bold bg-white text-black shadow-sm">{tag}</span>
                    ))}
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-accent text-white shadow-sm">Looking for Sponsors</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col relative z-20 -mt-2 bg-background rounded-t-xl">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors line-clamp-1">
                    <Link href={`/events/${event.id}`}>
                      <span className="absolute inset-0 z-10" aria-hidden="true" />
                      {event.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="mt-auto space-y-3 pt-4 border-t border-border/50">
                    <div className="flex items-center text-sm font-medium text-foreground/80">
                      <Calendar className="h-4 w-4 mr-2 text-accent" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm font-medium text-foreground/80">
                      <Users className="h-4 w-4 mr-2 text-accent" />
                      {event.participants}+ Participants
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Link href="/events">
               <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-accent hover:text-white transition-all duration-300">
                 View All Internal Events
               </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live External Events Section */}
      <section className="w-full py-24 px-4 bg-secondary/20 border-t border-border relative overflow-hidden">
        {/* Glow behind the section */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="container mx-auto max-w-6xl space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center rounded-full border border-red-500/30 bg-red-500/5 px-4 py-1.5 text-sm font-semibold text-red-500 backdrop-blur-md shadow-[0_0_25px_rgba(239,68,68,0.15)] mx-auto">
              <span className="flex h-2 w-2 shadow-[0_0_10px_rgba(239,68,68,1)] rounded-full bg-red-500 mr-2 animate-pulse"></span>
              Live External Network
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-red-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
                Happening Now
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">Real-time external opportunities currently open for sponsorship.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : liveEvents.length === 0 ? (
               <div className="col-span-full p-8 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center text-muted-foreground bg-card/30 backdrop-blur-md">
                 <Zap className="w-8 h-8 opacity-20 mb-3" />
                 <p className="font-medium">No external events fetching.</p>
                 <p className="text-sm mt-1">Make sure the FastAPI backend is running.</p>
               </div>
            ) : liveEvents.map((evt, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                key={evt.id} 
                className="group relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md shadow-lg p-6 flex flex-col hover:border-red-500/50 hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="font-bold text-lg mb-3 flex items-start justify-between gap-3">
                  <span className="leading-tight text-foreground">{evt.title}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20 whitespace-nowrap animate-pulse shrink-0">
                    LIVE
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{evt.description}</p>
                
                <div className="mt-auto space-y-3 pt-4 border-t border-border/50 text-sm font-medium">
                  <div className="flex items-center text-foreground/80">
                    <MapPin className="h-4 w-4 mr-2.5 text-red-400" /> {evt.location}
                  </div>
                  <div className="flex items-center text-foreground/80">
                    <Users className="h-4 w-4 mr-2.5 text-red-400" /> {evt.participants}+ Expected
                  </div>
                </div>
              </motion.div>
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
