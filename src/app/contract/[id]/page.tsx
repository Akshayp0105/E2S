"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate long press
  let pressTimer: ReturnType<typeof setTimeout>;
  let progressInterval: ReturnType<typeof setInterval>;

  const handlePointerDown = () => {
    if (isSigned) return;
    setIsSigning(true);
    
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 5;
      });
    }, 50);

    pressTimer = setTimeout(() => {
      setIsSigned(true);
      setIsSigning(false);
      setProgress(100);
      clearInterval(progressInterval);
    }, 1000);
  };

  const handlePointerUp = () => {
    if (isSigned) return;
    clearTimeout(pressTimer);
    clearInterval(progressInterval);
    setIsSigning(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background py-12 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="bg-secondary p-6 border-b border-border flex justify-between items-center">
          <div>
            <Link href={`/events/${resolvedParams.id}`} className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-accent" /> Sponsorship Agreement
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Contract ID: #SC-{resolvedParams.id}-8923</p>
          </div>
          <div className="hidden sm:block">
            <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${isSigned ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
              {isSigned ? 'Countersigned' : 'Pending Signature'}
            </div>
          </div>
        </div>

        {/* Contract Body */}
        <div className="p-8 prose prose-invert max-w-none text-sm leading-relaxed text-muted-foreground h-96 overflow-y-auto mb-6 bg-background/50 border-b border-border">
          <h3 className="text-foreground">1. PARTIES</h3>
          <p>This Sponsorship Agreement ("Agreement") is entered into on March 15, 2026, by and between <strong>Stanford CS Dept</strong> ("Organizer") and <strong>Aether Dynamics</strong> ("Sponsor").</p>
          
          <h3 className="text-foreground mt-6">2. EVENT DETAILS</h3>
          <p>The Organizer agrees to host the "Global Tech Hackathon 2026" on October 15-17, 2026. The Sponsor agrees to provide sponsorship in the form of $15,000 USD (Platinum Tier) to support the event.</p>
          
          <h3 className="text-foreground mt-6">3. SPONSOR BENEFITS</h3>
          <ul className="list-disc pl-5">
            <li>Logo placement on main event banners and website.</li>
            <li>Keynote speaking opportunity (15 minutes).</li>
            <li>Custom 10x10 booth space in the main hall.</li>
            <li>Access to resume database of attendees.</li>
          </ul>

          <h3 className="text-foreground mt-6">4. PLATFORM FEE</h3>
          <p>Both parties acknowledge and agree to a 2.5% platform transaction fee applied by E2S. The fee will be deducted during payment processing.</p>

          <h3 className="text-foreground mt-6">5. CANCELLATION</h3>
          <p className="text-red-400">If the Sponsor withdraws from this agreement within 30 days of the event without valid cause, their automated reputation will be marked negatively (Red status flag) on the platform.</p>

          <br/>
          <p>By signing below, both parties agree to the terms outlined in this document via electronic signature.</p>
        </div>

        {/* Signature Action */}
        <div className="p-8 bg-card flex flex-col items-center justify-center border-t border-white/5">
          {!isSigned ? (
            <div className="text-center w-full max-w-sm">
              <p className="text-sm text-muted-foreground mb-6">Press and hold the button below to sign the contract digitally.</p>
              
              <div 
                className="relative w-full h-16 rounded-xl overflow-hidden cursor-pointer touch-none select-none border-2 border-accent/50 group"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                {/* Hold Progress Bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-accent transition-all ease-linear"
                  style={{ width: `${progress}%` }}
                />
                
                {/* Text Content */}
                <div className="absolute inset-0 flex items-center justify-center z-10 font-bold text-white uppercase tracking-wider">
                  {isSigning ? "Holding to Sign..." : "Hold to Sign Contract"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center w-full max-w-sm animate-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Contract Signed</h3>
              <p className="text-muted-foreground mb-6">The agreement has been securely recorded on the platform.</p>
              
              <Link href={`/checkout/${resolvedParams.id}`}>
                <Button className="w-full text-base h-12 shadow-md">
                  Proceed to Payment
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
