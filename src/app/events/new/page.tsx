"use client";

import Link from "next/link";
import { Info, UploadCloud, Rocket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Post an Event</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the details below to list your event on the E2S marketplace.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <form className="p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center border-b border-border pb-2">
                <Info className="w-4 h-4 mr-2" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="e.g. Global Tech Hackathon 2026" className="bg-background/50" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date</Label>
                    <Input id="date" type="text" placeholder="e.g. Oct 15 - Oct 17, 2026" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (or Virtual)</Label>
                    <Input id="location" placeholder="e.g. San Francisco, CA" className="bg-background/50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="participants">Expected Participants</Label>
                    <Input id="participants" type="number" placeholder="5000" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="Technology, AI, Students" className="bg-background/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe what your event is about, the theme, and what participants will be doing..." 
                    className="h-32 bg-background/50" 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Sponsorship Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center border-b border-border pb-2">
                <Rocket className="w-4 h-4 mr-2" />
                Sponsorship Details
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience Description</Label>
                  <Textarea 
                    id="audience" 
                    placeholder="Who will be attending? e.g. 'University students in computer science, junior developers...'" 
                    className="h-20 bg-background/50" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Sponsor Benefits (one per line)</Label>
                  <Textarea 
                    id="benefits" 
                    placeholder="- Logo on all marketing materials\n- Dedicated booth access\n- Access to resumes array" 
                    className="h-32 bg-background/50" 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Media Upload */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center border-b border-border pb-2">
                <UploadCloud className="w-4 h-4 mr-2" />
                Media & Assets
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-secondary/20 transition-colors cursor-pointer">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-sm">Upload Event Poster</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">PNG, JPG or WEBP (max. 5MB)</p>
                  <Button variant="outline" size="sm" type="button">Select File</Button>
                </div>

                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-secondary/20 transition-colors cursor-pointer">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-sm">Upload Brochure (PDF)</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">PDF only (max. 10MB)</p>
                  <Button variant="outline" size="sm" type="button">Select File</Button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-4">
              <Button variant="ghost">Save Draft</Button>
              <Button type="button" className="shadow-md">Publish Event</Button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
