import Link from "next/link";
import { Calendar, Users, MapPin, Building2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EventCardProps {
  id: string;
  title: string;
  organizedBy: string;
  date: string;
  location: string;
  participants: number;
  tags: string[];
  status: "looking_for_sponsors" | "sponsored" | "completed";
  imageUrl?: string;
  compact?: boolean;
}

export default function EventCard({ 
  id, 
  title, 
  organizedBy, 
  date, 
  location, 
  participants, 
  tags, 
  status, 
  compact = false 
}: EventCardProps) {
  
  const statusStyles = {
    looking_for_sponsors: { label: "Needs Sponsors", color: "warning" },
    sponsored: { label: "Sponsored", color: "success" },
    completed: { label: "Completed", color: "default" },
  } as const;

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden h-full">
      {!compact && (
        <div className="aspect-[2/1] w-full bg-secondary/50 relative overflow-hidden flex items-center justify-center border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <span className="text-muted-foreground/50 font-medium z-0">Event Banner</span>
          <Badge 
            variant={statusStyles[status].color as any} 
            className="absolute top-3 right-3 z-20 shadow-sm"
          >
            {statusStyles[status].label}
          </Badge>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {compact && (
          <div className="flex justify-between items-start mb-2">
            <Badge variant={statusStyles[status].color as any} className="mb-2">
              {statusStyles[status].label}
            </Badge>
          </div>
        )}
        
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-accent transition-colors">
          <Link href={`/events/${id}`} className="focus:outline-none">
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {title}
          </Link>
        </h3>
        
        <div className="flex items-center text-sm text-muted-foreground mt-1 mb-4">
          <Building2 className="mr-1 h-3.5 w-3.5" />
          {organizedBy}
        </div>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 text-muted" />
            {date}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 text-muted" />
            {location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4 text-muted" />
            {participants.toLocaleString()}+ Expected
          </div>
        </div>

        {!compact && (
          <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal text-xs bg-secondary/50">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {compact && (
          <div className="mt-4 pt-3 gap-2 flex flex-wrap">
              {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal text-xs text-muted-foreground bg-secondary/30">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
        <div className="px-5 pb-5 pt-0 relative z-20">
          <Button asChild variant="outline" className="w-full group-hover:border-accent group-hover:bg-accent/5 transition-colors">
            <Link href={`/events/${id}`}>
              View Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
    </div>
  );
}
