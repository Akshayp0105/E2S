"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Building2, UploadCloud, MapPin, Briefcase, GraduationCap, ArrowRight, Loader2, Camera, ImagePlus, UserCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
export default function ProfileSetupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"taker" | "giver">("taker");
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    location: "",
    status: "student",
    bio: "",
    hq: "",
    industry: "",
    offerrings: "",
    coordinates: { lat: 0, lng: 0 }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };
  
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setProfilePic(e.target.files[0]);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({ video: true }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Camera initialization timed out. Please check permissions.")), 8000))
      ]);
      if (videoRef.current) {
        videoRef.current.srcObject = stream as MediaStream;
      }
    } catch (err: any) {
      console.error("Error accessing camera", err);
      alert(err.message || "Camera access denied or unavailable.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "profile_capture.jpg", { type: "image/jpeg" });
            setProfilePic(capturedFile);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };
  
  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
            hq: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`, // Auto fill HQ too
            coordinates: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please sign in first.");
    setLoading(true);

    try {
      let fileUrl = "";
      if (file) {
        fileUrl = await fileToBase64(file);
      }
      
      let profilePicUrl = "";
      if (profilePic) {
        profilePicUrl = await fileToBase64(profilePic);
      }

      const userData = {
        role,
        ...formData,
        verificationUrl: fileUrl,
        profilePictureUrl: profilePicUrl,
        setupComplete: true,
        reputationStatus: "green",
        email: auth.currentUser!.email
      };

      await setDoc(doc(db, "users", auth.currentUser!.uid), userData, { merge: true });
      setStep(2);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Error setting up profile:", error);
      alert(error.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Please provide additional details to verify your account.</p>
        </div>

        {/* Setup Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 md:p-8 shadow-2xl">
          
          <div className="flex gap-4 mb-6">
            <button 
              type="button"
              onClick={() => setRole("taker")}
              className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 transition-all ${role === "taker" ? "border-accent bg-accent/10 text-accent font-semibold" : "border-border/50 text-muted-foreground hover:border-accent/40"}`}
            >
              <User className="w-5 h-5 mr-2" /> Sponsorship Taker
            </button>
            <button 
               type="button"
               onClick={() => setRole("giver")}
              className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 transition-all ${role === "giver" ? "border-accent bg-accent/10 text-accent font-semibold" : "border-border/50 text-muted-foreground hover:border-accent/40"}`}
            >
              <Building2 className="w-5 h-5 mr-2" /> Sponsorship Giver
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Profile Picture Upload/Capture */}
            <div className="flex flex-col items-center justify-center space-y-4 pb-6 border-b border-border text-center">
              <div className="relative group">
                {profilePic ? (
                  <img src={URL.createObjectURL(profilePic)} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-2 border-accent shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-dashed border-border group-hover:border-accent transition-colors">
                    <UserCircle className="w-10 h-10 text-muted-foreground group-hover:text-accent" />
                  </div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute -right-2 -bottom-2 flex gap-1">
                   <label className="w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-secondary transition-colors text-primary" title="Upload Image">
                      <ImagePlus className="w-4 h-4 text-foreground" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
                   </label>
                   <button type="button" onClick={startCamera} className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-accent/90 transition-colors" title="Take Photo">
                      <Camera className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <div>
                <Label>Profile Picture</Label>
                <p className="text-xs text-muted-foreground mt-1">Upload an image or take a photo</p>
              </div>
            </div>

            {/* Camera Modal */}
            {showCamera && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-card w-full max-w-md rounded-2xl border border-border overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-border flex justify-between items-center">
                    <h3 className="font-semibold">Take a Photo</h3>
                    <Button variant="ghost" size="sm" onClick={stopCamera}>Cancel</Button>
                  </div>
                  <div className="relative aspect-square bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} width="400" height="400" className="hidden" />
                  </div>
                  <div className="p-4 flex justify-center bg-secondary/50">
                    <Button type="button" onClick={capturePhoto} className="rounded-full w-16 h-16 p-0 flex items-center justify-center shadow-lg border-4 border-background">
                      <div className="w-12 h-12 bg-accent rounded-full" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {role === "taker" ? (
              // TAKER FORM
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <Label htmlFor="location">Location</Label>
                       <button type="button" onClick={getLocation} className="text-xs flex items-center text-accent hover:text-accent/80 font-medium">
                         <Navigation className="w-3 h-3 mr-1" /> Get Auto Location
                       </button>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="City, Country" className="pl-9 bg-background/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select id="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="student">Student</option>
                        <option value="employer">Employer / NGO</option>
                        <option value="independent">Independent Organizer</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ID Verification (Student/Employer ID)</Label>
                  <label className="block border-2 border-dashed border-border/60 rounded-xl p-6 text-center hover:bg-secondary/40 transition-colors cursor-pointer group">
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium mb-1">{file ? file.name : "Upload Document"}</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max. 10MB)</p>
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Brief Bio</Label>
                  <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Tell sponsors about yourself and the types of events you organize..." className="bg-background/50" rows={3} />
                </div>
              </>
            ) : (
              // GIVER FORM
              <>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <Label htmlFor="hq">Headquarters</Label>
                       <button type="button" onClick={getLocation} className="text-xs flex items-center text-accent hover:text-accent/80 font-medium">
                         <Navigation className="w-3 h-3 mr-1" /> Get Auto Location
                       </button>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="hq" value={formData.hq} onChange={(e) => setFormData({...formData, hq: e.target.value})} placeholder="City, Country" className="pl-9 bg-background/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="industry" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} placeholder="e.g. Fintech, SaaS, Healthcare" className="pl-9 bg-background/50" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerrings">What we offer & Conditions</Label>
                  <Textarea id="offerrings" value={formData.offerrings} onChange={(e) => setFormData({...formData, offerrings: e.target.value})} placeholder="Describe what you typically sponsor (cash, APIs, merch) and any specific conditions you have..." className="bg-background/50" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>Company Verification Docs</Label>
                  <label className="block border-2 border-dashed border-border/60 rounded-xl p-6 text-center hover:bg-secondary/40 transition-colors cursor-pointer group">
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium mb-1">{file ? file.name : "Upload Verification"}</p>
                    <p className="text-xs text-muted-foreground">PDF or Image (max. 10MB)</p>
                  </label>
                </div>
              </>
            )}

            <Button type="submit" disabled={loading} className="w-full text-base h-12" size="lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {step === 1 ? "Complete Verification" : "Profile Setup Complete! Redirecting..."}
                  {step === 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              By completing this setup, you agree to the E2S Terms of Service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
