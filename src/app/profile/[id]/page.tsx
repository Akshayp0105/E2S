import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Globe, Mail, MapPin, ShieldCheck, Twitter, Linkedin, Briefcase, Award, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import EventCard from "@/components/shared/EventCard";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // Dummy profile data
  const profile = {
    id: resolvedParams.id,
    name: "Aether Dynamics",
    type: "sponsor" as const,
    industry: "Cloud Infrastructure",
    location: "Seattle, WA",
    website: "aetherdynamics.dev",
    reputation: "high" as const,
    reputationStatus: "green" as "green" | "yellow" | "red",
    joined: "March 2025",
    about: "Aether Dynamics is a leading provider of scalable cloud infrastructure for startups and enterprise teams. We passionately support tech education, open-source development, and student hackathons globally.",
    established: "2018",
    employees: "1,000 - 5,000",
    stats: {
      sponsored: 24,
      totalSpent: "$150k+",
      responseRate: "98%"
    }
  };

  const RECENT_SPONSORSHIPS = [
    {
      id: "101",
      title: "MIT Fall Hackathon",
      organizedBy: "MIT Tech Club",
      date: "Sep 2026",
      location: "Cambridge, MA",
      participants: 1500,
      tags: ["AI", "Cloud", "Students"],
      status: "completed" as const,
    },
    {
      id: "102",
      title: "Open Source Summit",
      organizedBy: "Linux Found.",
      date: "Aug 2026",
      location: "Virtual",
      participants: 8000,
      tags: ["Open Source", "Linux", "DevOps"],
      status: "completed" as const,
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Banner */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-accent/20 to-background border-b border-border relative">
        <div className="absolute top-6 left-6 z-20">
          <Link href="/events">
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-md border-white/10 hover:bg-background/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-16 md:-mt-24 relative z-20">
        
        {/* Profile Header Card */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row gap-6 md:items-end">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-primary text-primary-foreground border-4 border-background flex items-center justify-center text-5xl font-bold shadow-md shrink-0">
            {profile.name.charAt(0)}
          </div>
          
          <div className="flex-1 space-y-3 pb-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                  <Badge variant="success" className="h-6 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
                  </Badge>
                </div>
                <div className="flex items-center text-muted-foreground mt-2 font-medium">
                  <Building2 className="w-4 h-4 mr-1.5" /> {profile.industry}
                  <span className="mx-2">•</span>
                  <MapPin className="w-4 h-4 mr-1.5" /> {profile.location}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-2" /> Website
                </Button>
                <Button className="shadow-md">
                  <Mail className="w-4 h-4 mr-2" /> Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {profile.about}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Company Size</h4>
                  <p className="font-medium flex items-center"><Users className="w-4 h-4 mr-2 text-muted-foreground" /> {profile.employees}</p>
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Established</h4>
                  <p className="font-medium flex items-center"><Calendar className="w-4 h-4 mr-2 text-muted-foreground" /> {profile.established}</p>
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Socials</h4>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Twitter className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Linkedin className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Sponsorships</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RECENT_SPONSORSHIPS.map(event => (
                  <EventCard key={event.id} {...event} compact={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-lg mb-6 flex items-center">
                Sponsor Reputation
              </h3>
              
              <div className="space-y-6">
                
                {/* Reputation Core Status Indicator */}
                <div className={`p-4 rounded-xl border ${
                  profile.reputationStatus === "green" ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400" :
                  profile.reputationStatus === "yellow" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400" :
                  "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400" 
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      profile.reputationStatus === "green" ? "bg-green-500" :
                      profile.reputationStatus === "yellow" ? "bg-yellow-500" :
                      "bg-red-500" 
                    }`} />
                    <span className="font-bold uppercase tracking-wider text-sm">
                      Status: {profile.reputationStatus}
                    </span>
                  </div>
                  <p className="text-xs opacity-90">
                    {profile.reputationStatus === "green" && "Excellent standing. Reliable sponsor with no recent withdrawals."}
                    {profile.reputationStatus === "yellow" && "Warning. Has recent reports or minor violations."}
                    {profile.reputationStatus === "red" && "Restricted. Repeated agreement withdrawals."}
                  </p>
                </div>

                <div className="flex items-start pt-2">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mr-4 shrink-0 text-success">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Top Tier Partner</h4>
                    <p className="text-sm text-muted-foreground mt-1">Has consistently delivered high-value sponsorships.</p>
                  </div>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Events Sponsored</span>
                    <span className="font-bold">{profile.stats.sponsored}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Invested</span>
                    <span className="font-bold">{profile.stats.totalSpent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Response Rate</span>
                    <span className="font-bold text-accent">{profile.stats.responseRate}</span>
                  </div>
                </div>
                
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Member since {profile.joined}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
