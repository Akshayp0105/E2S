"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Phone, Video, MoreVertical, MessageSquare, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function MessagesPage() {
  const [chatsList, setChatsList] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch all other users to act as a contact list
  useEffect(() => {
    const fetchUsers = async () => {
      if (!auth.currentUser) return;
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs
          .map((doc: any) => ({ id: doc.id, ...doc.data() }))
          .filter((user: any) => user.id !== auth.currentUser?.uid)
          .map((user: any) => ({
            id: user.id,
            name: user.orgName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
            lastMessage: "Tap to view conversation",
            time: "",
            unread: 0,
            online: true,
          }));
        
        setChatsList(users);
        if (users.length > 0 && !activeChat) {
          setActiveChat(users[0]);
        }
      } catch (err) {
        console.error("Error fetching users for chat:", err);
      }
    };
    
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) fetchUsers();
    });
    
    return () => unsubscribeAuth();
  }, []);

  // Fetch messages between current user and activeChat
  useEffect(() => {
    if (!activeChat || !auth.currentUser) return;
    
    const chatId = [auth.currentUser.uid, activeChat.id].sort().join('-');
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [activeChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !auth.currentUser) return;

    try {
      const text = message;
      setMessage("");
      const chatId = [auth.currentUser.uid, activeChat.id].sort().join('-');
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        senderId: auth.currentUser.uid,
        senderEmail: auth.currentUser.email,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Chat directly with sponsors and organizers.
        </p>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex animate-in fade-in duration-500">
        
        {/* Sidebar / Chat List */}
        <div className="w-80 border-r border-border flex flex-col bg-background/50">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 bg-background/50 border-white/10" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chatsList.length === 0 ? (
               <div className="p-4 text-sm text-muted-foreground text-center mt-4">No contacts found</div>
            ) : chatsList.map(chat => (
              <div 
                key={chat.id} 
                className={`p-4 border-b border-border/50 cursor-pointer transition-colors flex gap-3 ${activeChat?.id === chat.id ? "bg-secondary/80 border-l-2 border-l-accent" : "hover:bg-secondary/30 border-l-2 border-l-transparent"}`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className={activeChat?.id === chat.id ? "bg-accent/20 text-accent font-bold" : "bg-primary text-primary-foreground font-bold"}>
                      {chat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                     <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                     {chat.time && <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background relative">
          
          {/* Default State or Active Chat */}
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-card z-10 w-full relative">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-accent/10 text-accent font-bold">
                      {activeChat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activeChat.name}</h3>
                    <p className="text-xs text-green-500 font-medium">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                    <Video className="w-4 h-4" />
                  </Button>
                  
                  {/* Reporting UI Logic Trigger */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-600 font-medium text-xs ml-2"
                    onClick={() => {
                      if(window.confirm(`Report ${activeChat.name} for explicit language or bad gestures? If team validates, they will be fined and marked Yellow.`)) {
                         alert(`Report submitted. ${activeChat.name} is under review.`);
                      }
                    }}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Report User
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                <div className="flex justify-center mb-6">
                  <span className="text-xs font-medium bg-secondary text-muted-foreground px-3 py-1 rounded-full">
                    Conversation Started
                  </span>
                </div>
                
                {messages.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground my-10">
                    No messages yet. Say hi!
                  </div>
                )}
                
                {messages.map((msg) => {
                  const isMe = auth.currentUser ? msg.senderId === auth.currentUser.uid : false;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                        isMe 
                          ? "bg-accent text-white rounded-br-sm" 
                          : "bg-secondary text-foreground rounded-bl-sm border border-border/50"
                      }`}>
                        <p className="text-sm shadow-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? "text-white/70" : "text-muted-foreground"}`}>
                          {msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Sending..."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-card border-t border-border">
                <form className="flex items-center gap-2" onSubmit={sendMessage}>
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1 bg-background/50 h-12 rounded-full px-6"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="h-12 w-12 rounded-full shrink-0 shadow-md disabled:opacity-50" disabled={!message.trim()}>
                    <Send className="w-5 h-5 ml-1" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 opacity-50" />
              </div>
              <p>Select a contact to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
