"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Target, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { auth, googleProvider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function SignupPage() {
  const [role, setRole] = useState<"organizer" | "sponsor">("organizer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/profile/setup");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/profile/setup");
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-lg space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <Card className="glass border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-8 border-b border-border/30">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-accent font-bold text-2xl">S</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-base text-muted">
              Choose your role and join the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}
            
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">I want to...</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("organizer")}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-200 gap-3",
                    role === "organizer" 
                      ? "border-accent bg-accent/10 ring-1 ring-accent text-accent" 
                      : "border-border/60 bg-background hover:bg-secondary text-muted-foreground"
                  )}
                >
                  <Target className={cn("w-6 h-6", role === "organizer" ? "text-accent" : "text-muted-foreground")} />
                  <span className="font-medium text-sm">Find Sponsors</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("sponsor")}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-200 gap-3",
                    role === "sponsor" 
                      ? "border-accent bg-accent/10 ring-1 ring-accent text-accent" 
                      : "border-border/60 bg-background hover:bg-secondary text-muted-foreground"
                  )}
                >
                  <Search className={cn("w-6 h-6", role === "sponsor" ? "text-accent" : "text-muted-foreground")} />
                  <span className="font-medium text-sm">Sponsor Events</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-muted-foreground">First name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="h-11 bg-background/50" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-muted-foreground">Last name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="h-11 bg-background/50" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="orgName" className="text-muted-foreground">
                  {role === "organizer" ? "Organization / College Name" : "Company Name"}
                </Label>
                <Input 
                  id="orgName" 
                  placeholder={role === "organizer" ? "Stanford University" : "Acme Corp"} 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  className="h-11 bg-background/50" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-background/50" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-background/50" 
                />
              </div>
            
            <Button disabled={loading} type="submit" className="w-full h-11 text-base font-medium mt-6 shadow-md shadow-accent/20">
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </form>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Button onClick={handleGoogleSignup} type="button" variant="outline" className="h-11 bg-background/50 hover:bg-white/5 transition-colors">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </div>
            
          </CardContent>
          <CardFooter className="flex justify-center pb-8 border-t border-border/30 pt-6 mt-2">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
