import { Building2, ShieldCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import Link from "next/link";

interface SponsorCardProps {
  id: string;
  name: string;
  industry: string;
  tier: "Platinum" | "Gold" | "Silver" | "Custom";
  eventsSponsored: number;
  reputation: "high" | "medium" | "low";
}

export default function SponsorCard({
  id,
  name,
  industry,
  tier,
  eventsSponsored,
  reputation,
}: SponsorCardProps) {
  
  const reputationStyles = {
    high: { color: "success", icon: ShieldCheck, label: "Trusted" },
    medium: { color: "warning", icon: ShieldCheck, label: "Good" },
    low: { color: "destructive", icon: ShieldCheck, label: "Caution" },
  } as const;

  const RepIcon = reputationStyles[reputation].icon;

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarFallback className="bg-secondary text-lg font-bold">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">{name}</h3>
            <span className="text-xs text-muted-foreground flex items-center mt-0.5">
              <Building2 className="w-3 h-3 mr-1" />
              {industry}
            </span>
          </div>
        </div>
        <Badge variant={reputationStyles[reputation].color as any} className="flex items-center gap-1">
          <RepIcon className="w-3 h-3" />
          <span className="hidden sm:inline">{reputationStyles[reputation].label}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-center mb-5 bg-secondary/30 rounded-lg py-2">
        <div>
          <span className="block font-semibold text-foreground">{eventsSponsored}</span>
          <span className="text-xs text-muted-foreground mr-1">Events Sponsored</span>
        </div>
        <div className="border-l border-border/50">
          <span className="block font-semibold text-accent">{tier}</span>
          <span className="text-xs text-muted-foreground">Typical Tier</span>
        </div>
      </div>

      <Link href={`/profile/${id}`} className="mt-auto block">
        <Button variant="secondary" className="w-full bg-secondary/50 hover:bg-secondary">
          View Profile
          <ExternalLink className="ml-2 h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}
