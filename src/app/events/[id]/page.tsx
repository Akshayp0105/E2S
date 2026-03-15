"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Users, MapPin, Building2, CheckCircle2, ShieldCheck, Mail, Globe, Sparkles, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isVouched, setIsVouched] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", resolvedParams.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <Button onClick={() => router.back()}>Back to Previous Page</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Banner Area */}
      <div className="w-full h-[40vh] min-h-[300px] bg-secondary/50 relative overflow-hidden flex items-center justify-center border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-black/30 z-10" />
        <span className="text-muted-foreground font-medium z-0 text-2xl tracking-widest uppercase">Event Banner / Poster</span>
        
        <div className="absolute top-6 left-6 z-20">
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-md border-white/10 hover:bg-background/80" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="warning">Needs Sponsors</Badge>
                {event.tags?.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{event.title}</h1>
              
              <div className="flex items-center gap-2 mb-8">
                <div className="h-10 w-10 bg-accent/10 rounded overflow-hidden flex items-center justify-center text-accent font-bold">
                  S
                </div>
                <div>
                  <div className="text-sm font-medium flex items-center">
                    {event.organizedBy}
                    <ShieldCheck className="w-4 h-4 text-green-500 ml-1" />
                  </div>
                  <div className="text-xs text-muted-foreground">Organizer</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 mr-1.5" /> Date
                  </div>
                  <div className="font-semibold text-sm">Oct 15 - 17, 2026</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 mr-1.5" /> Location
                  </div>
                  <div className="font-semibold text-sm">San Francisco</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Users className="w-4 h-4 mr-1.5" /> Expected
                  </div>
                  <div className="font-semibold text-sm">5,000+</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Globe className="w-4 h-4 mr-1.5" /> Type
                  </div>
                  <div className="font-semibold text-sm">In-Person</div>
                </div>
              </div>

              <div className="py-6 space-y-4">
                <h3 className="text-xl font-semibold">About the Event</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This year&apos;s theme is &quot;Building scalable AI pipelines.&quot; We are bringing together industry leaders, open-source maintainers, and top university talent to hack on the next generation of generative AI tooling.
                </p>
              </div>

              <div className="py-6 border-t border-border space-y-4">
                <h3 className="text-xl font-semibold">Target Audience</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.targetAudience || event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-xl mb-6">Sponsorship Tiers & Benefits</h3>
              
              <ul className="space-y-4 mb-8">
                {event.benefits?.map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mr-3 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                {!isVouched ? (
                  <Button 
                    className="w-full font-medium h-12 text-base shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:scale-[1.02]"
                    onClick={() => setIsVouched(true)}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Vouch to Sponsor
                  </Button>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg p-3 text-sm font-medium flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Vouch Sent to Organizer
                    </div>
                    
                    <Link href={`/contract/${resolvedParams.id}`} className="block w-full">
                      <Button variant="outline" className="w-full h-12 border-accent text-accent hover:bg-accent hover:text-white">
                        <FileText className="w-4 h-4 mr-2" /> Create Contract Draft
                      </Button>
                    </Link>
                  </div>
                )}
                
                <Link href="/dashboard/messages" className="block w-full">
                  <Button variant="outline" className="w-full h-12">
                    <Mail className="w-4 h-4 mr-2" /> Message Organizer
                  </Button>
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Platform fee: 2.5% applies to finalized deals.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
