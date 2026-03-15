"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { Loader2, Save, Send, User, Bell, Shield, MessageSquare, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "feedback" | "notifications" | "security">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    orgName: "",
    bio: "",
    location: "",
    hq: "",
    industry: "",
    offerrings: "",
    role: "taker",
  });

  // Feedback State
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!auth.currentUser) return;
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setProfileData(prev => ({ ...prev, ...userDoc.data() }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserData();
      else setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), profileData, { merge: true });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !feedback.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "feedback"), {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        message: feedback,
        createdAt: new Date(),
      });
      setFeedback("");
      alert("Thank you for your feedback! We will review it shortly.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-accent/10 text-accent border border-accent/20" : "hover:bg-secondary text-muted-foreground"}`}
          >
            <User className="w-4 h-4" /> Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "feedback" ? "bg-accent/10 text-accent border border-accent/20" : "hover:bg-secondary text-muted-foreground"}`}
          >
            <MessageSquare className="w-4 h-4" /> Feedback & Issues
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "notifications" ? "bg-accent/10 text-accent border border-accent/20" : "hover:bg-secondary text-muted-foreground"}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "security" ? "bg-accent/10 text-accent border border-accent/20" : "hover:bg-secondary text-muted-foreground"}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-card/40 border border-border backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Update your personal and organizational details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgName">{profileData.role === "giver" ? "Company Name" : "Organization Name"}</Label>
                  <Input id="orgName" value={profileData.orgName} onChange={e => setProfileData({...profileData, orgName: e.target.value})} className="bg-background/50" />
                </div>
                {profileData.role === "giver" ? (
                  <div className="space-y-2">
                    <Label htmlFor="hq">Headquarters</Label>
                    <Input id="hq" value={profileData.hq} onChange={e => setProfileData({...profileData, hq: e.target.value})} className="bg-background/50" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} className="bg-background/50" />
                  </div>
                )}
              </div>

              {profileData.role === "taker" ? (
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} rows={4} className="bg-background/50" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" value={profileData.industry} onChange={e => setProfileData({...profileData, industry: e.target.value})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offerrings">Offerings</Label>
                    <Textarea id="offerrings" value={profileData.offerrings} onChange={e => setProfileData({...profileData, offerrings: e.target.value})} rows={4} className="bg-background/50" />
                  </div>
                </>
              )}

              <Button type="submit" disabled={saving} className="w-full md:w-auto">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </form>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground">Manage how and when you receive updates.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-xl bg-background/50 gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your account and new matches.</p>
                  </div>
                  <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-accent">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-xl bg-background/50 gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive tips, newsletters, and promotional offers.</p>
                  </div>
                  <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-secondary border border-border">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-muted-foreground transition-transform translate-x-1" />
                  </button>
                </div>
              </div>
              <Button onClick={() => alert("Preferences saved successfully!")}>
                <Save className="w-4 h-4 mr-2" /> Save Preferences
              </Button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Security Settings</h2>
                <p className="text-sm text-muted-foreground">Protect your account and manage credentials.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-xl bg-background/50 gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Password Reset</Label>
                    <p className="text-sm text-muted-foreground">Send a secure link to your email to reset your password.</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      if (!auth.currentUser?.email) return;
                      try {
                        const { sendPasswordResetEmail } = await import("firebase/auth");
                        await sendPasswordResetEmail(auth, auth.currentUser.email);
                        alert("Password reset email sent! Check your inbox.");
                      } catch (error) {
                        alert("Failed to send password reset email.");
                      }
                    }}
                  >
                    <Key className="w-4 h-4 mr-2" /> Send Reset Link
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-red-500/20 rounded-xl bg-red-500/5 gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium text-red-500">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all its data.</p>
                  </div>
                  <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => alert("Please contact support to delete your account.")}>
                     Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
