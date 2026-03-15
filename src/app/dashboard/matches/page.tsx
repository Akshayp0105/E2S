"use client";

import { useState, useEffect } from "react";
import { getDocs, collection, query, where, documentId } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, MapPin, Building2, Check, X, Handshake, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";

type MatchProfile = {
  id: string;
  name: string;
  role: "taker" | "giver";
  industry?: string;
  location?: string;
  hq?: string;
  bio?: string;
  offerrings?: string;
  matchScore: number;
};

// Dummy tags to make the UI look rich
const PROFILE_TAGS = {
  taker: ["Hackathons", "Tech Students", "High Engagement", "Fast Growing"],
  giver: ["Startup Friendly", "Cash Deals", "Swag Provided", "API Credits"],
};

export default function SponsorMatchesPage() {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"taker" | "giver" | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!auth.currentUser) return;

      try {
        // Find current user role first (for real app we'd get from context)
        const userDoc = await getDocs(query(collection(db, "users"), where(documentId(), "==", auth.currentUser.uid)));
        let currentRole: "taker" | "giver" | null = null;
        if (!userDoc.empty) {
          currentRole = userDoc.docs[0].data().role as "taker" | "giver";
          setUserRole(currentRole);
        }

        // Fetch potential matches (Opposite Role)
        const targetRole = currentRole === "taker" ? "giver" : "taker";
        const q = query(collection(db, "users"), where("role", "==", targetRole));
        const matchSnapshot = await getDocs(q);
        
        const fetchedMatches = matchSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.orgName || data.firstName + " " + (data.lastName || "") || "Unknown",
            role: data.role,
            industry: data.industry,
            location: data.location,
            hq: data.hq,
            bio: data.bio,
            offerrings: data.offerrings,
            // Generate a random match score for demo purposes (80-99)
            matchScore: Math.floor(Math.random() * (99 - 80 + 1) + 80),
          };
        }).sort((a, b) => b.matchScore - a.matchScore);

        // Fetch real-world external matches from the backend to ensure we always have data
        let externalMatches: MatchProfile[] = [];
        try {
           if (currentRole === "taker") {
             const res = await fetch("http://localhost:8000/api/sponsors/live");
             const data = await res.json();
             if (data && data.status === "success") {
               externalMatches = data.data;
             }
           } else {
             // Givers should match with live external events
             const res = await fetch("http://localhost:8000/api/events/live");
             const data = await res.json();
             if (data && data.status === "success") {
               externalMatches = data.data.map((evt: any) => ({
                 id: evt.id,
                 name: evt.title,
                 role: "taker",
                 industry: "Live Event",
                 location: evt.location,
                 bio: evt.description,
                 matchScore: Math.floor(Math.random() * (99 - 80 + 1) + 80),
               }));
             }
           }
        } catch (fetchErr) {
           console.error("Error fetching external matches:", fetchErr);
        }
        
        const allMatches = [...fetchedMatches, ...externalMatches].sort((a, b) => b.matchScore - a.matchScore);
        setMatches(allMatches);

      } catch (err) {
        console.error("Error fetching matches", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchMatches();
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = (id: string, action: "accept" | "reject") => {
    // In a real app we'd save this interaction to DB to avoid showing again
    setMatches(prev => prev.filter(m => m.id !== id));
    if (action === "accept") {
      // Show mini-toast or alert (for demo, just console log)
      console.log(`Sent connection request to ${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent inline-flex items-center gap-3">
            <Flame className="w-8 h-8 text-accent" /> Top Matches
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            AI-powered recommendations tailored for {userRole === "taker" ? "your events" : "your brand"}.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 border-2 border-dashed border-border rounded-xl">
          <div className="flex flex-col items-center gap-4 text-accent">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium animate-pulse">Finding your perfect match...</p>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 py-24 border-2 border-dashed border-border/50 rounded-2xl bg-card/20 backdrop-blur-sm text-center">
          <Users className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-2xl font-bold tracking-tight mb-2">No more matches</h3>
          <p className="text-muted-foreground max-w-sm">
            You've reviewed all available recommendations for now. Check back later for new profiles.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {matches.map((match) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                key={match.id}
                className="group bg-card/40 backdrop-blur-md rounded-2xl border border-border overflow-hidden shadow-xl hover:shadow-accent/10 hover:border-accent/40 transition-all flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="relative h-40 bg-gradient-to-br from-secondary to-background w-full p-6 flex flex-col justify-end">
                  {/* Decorative backdrop */}
                  <div className="absolute inset-0 opacity-20 bg-[url('/grid-pattern.svg')]"></div>
                  
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent/20 shadow-sm text-accent z-10">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-bold">{match.matchScore}% Match</span>
                  </div>
                  
                  <div className="relative z-10 flex items-end gap-4 translate-y-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-xl border border-accent/30 flex items-center justify-center text-accent font-black text-3xl shadow-lg group-hover:scale-105 transition-transform">
                      {match.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="pt-12 p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold tracking-tight mb-1 text-foreground line-clamp-1">{match.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    {match.role === "giver" ? (
                      <><Building2 className="w-4 h-4" /> {match.industry || "Tech Corporate"}</>
                    ) : (
                      <><FileText className="w-4 h-4" /> {match.industry || "Event Organizer"}</>
                    )}
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <MapPin className="w-4 h-4" /> {match.hq || match.location || "Global"}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {match.bio || match.offerrings || `Leading ${match.industry || 'technology'} entity looking to connect and build meaningful sponsorships.`}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {PROFILE_TAGS[match.role].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-[10px] font-semibold uppercase tracking-wider rounded-md border border-border/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto pt-4 border-t border-border/50">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                      onClick={() => handleAction(match.id, "reject")}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    <Button 
                      className="flex-[2] h-12 rounded-xl bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] transition-all gap-2"
                      onClick={() => handleAction(match.id, "accept")}
                    >
                      <Handshake className="w-5 h-5" /> Connect
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
