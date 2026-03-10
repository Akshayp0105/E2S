"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, Lock, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // Dummy specific values
  const baseAmount = 15000;
  const platformFeePercentage = 2.5;
  const platformFee = (baseAmount * platformFeePercentage) / 100;
  const totalAmount = baseAmount + platformFee;

  return (
    <div className="min-h-screen bg-background border-t border-border py-12 flex justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Summary */}
        <div className="space-y-6">
          <Link href={`/contract/${resolvedParams.id}`} className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Contract
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Payment</h1>
            <p className="text-muted-foreground">Review your transaction details and finalize the sponsorship.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Receipt className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Platinum Sponsorship Tier</h3>
                <p className="text-sm text-muted-foreground">Global Tech Hackathon 2026</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Base Sponsorship</span>
                <span>${baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Fee ({platformFeePercentage}%)</span>
                <span>${platformFee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg text-foreground pt-4 border-t border-border">
                <span>Total Due</span>
                <span>${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex gap-3 text-sm">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
            <p className="text-muted-foreground"><strong className="text-accent">Secure Escrow.</strong> Funds are held safely by E2S and released to the organizer only after terms are met.</p>
          </div>
        </div>

        {/* Right: Payment Input */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xl animate-in fade-in slide-in-from-right-8 duration-500">
          <h3 className="text-xl font-semibold mb-6">Payment Method</h3>

          <div className="space-y-4">
            {/* Card Mockup fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CVC</label>
                <input 
                  type="password" 
                  placeholder="123" 
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            
            <div className="space-y-2 pb-4">
              <label className="text-sm font-medium">Name on Card</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <Link href="/dashboard" className="block w-full">
              <Button className="w-full text-base h-12 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                <Lock className="w-4 h-4 mr-2" />
                Pay ${totalAmount.toLocaleString()}
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
