from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
import datetime

app = FastAPI(title="E2S Backend API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: Firebase Admin Init (if using service account)
# import firebase_admin
# from firebase_admin import credentials, firestore
# cred = credentials.Certificate("path/to/serviceAccountKey.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()

class EventModel(BaseModel):
    title: str
    description: str
    date: str
    location: str
    participants: int
    tags: List[str]
    status: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the E2S FastAPI Backend"}

@app.get("/api/events/live")
def get_live_events():
    """
    Simulates fetching real-time live events happening now from an external API (like Ticketmaster or Eventbrite).
    """
    today = datetime.datetime.now().strftime("%B %d, %Y")
    
    # In a real scenario:
    # response = requests.get(f"https://api.some-event-provider.com/v1/events?city=Ernakulam&date={today}")
    # return response.json()
    
    # Simulated Live External Events
    live_events = [
        {
            "id": "live-evt-101",
            "title": "Kochi Startup Summit - Happening Now!",
            "description": "Live networking and pitch sessions for budding startups in Kerala.",
            "date": today,
            "location": "Kaloor Stadium, Ernakulam",
            "participants": 800,
            "tags": ["Startup", "Networking", "Tech"],
            "status": "looking_for_sponsors"
        },
        {
            "id": "live-evt-102",
            "title": "Kerala Creators Meetup",
            "description": "Ongoing event for YouTube, Insta, and digital creators to collaborate.",
            "date": today,
            "location": "Marine Drive, Kochi",
            "participants": 300,
            "tags": ["Creators", "Media", "Live"],
            "status": "looking_for_sponsors"
        },
        {
            "id": "live-evt-103",
            "title": "Global FinTech Exposé",
            "description": "Premium gathering for FinTech innovators and blockchain enthusiasts.",
            "date": today,
            "location": "Le Meridien, Kochi",
            "participants": 1200,
            "tags": ["FinTech", "Blockchain", "Finance"],
            "status": "looking_for_sponsors"
        },
        {
            "id": "live-evt-104",
            "title": "Kerala AI Hackathon",
            "description": "A 48-hour intense hackathon focused on building Generative AI solutions.",
            "date": today,
            "location": "Infopark, Kakkanad",
            "participants": 500,
            "tags": ["AI", "Hackathon", "Coding"],
            "status": "looking_for_sponsors"
        },
        {
            "id": "live-evt-105",
            "title": "Women in Tech Summit",
            "description": "Empowering women leaders in technology with keynotes and workshops.",
            "date": today,
            "location": "Grand Hyatt, Bolgatty",
            "participants": 600,
            "tags": ["Women in Tech", "Leadership", "Networking"],
            "status": "looking_for_sponsors"
        },
        {
            "id": "live-evt-106",
            "title": "E-Sports Championship Series",
            "description": "Regional finals for the biggest e-sports tournament in the state.",
            "date": today,
            "location": "Rajiv Gandhi Indoor Stadium",
            "participants": 2000,
            "tags": ["Gaming", "E-Sports", "Tournament"],
            "status": "looking_for_sponsors"
        }
    ]
    return {"status": "success", "data": live_events}

@app.get("/api/events")
def get_all_events():
    # Here, we would ideally fetch from Firestore using firebase-admin
    # For now, this is a proxy structure pending Firebase admin certs
    # events_ref = db.collection(u'events').stream()
    # return [{"id": ev.id, **ev.to_dict()} for ev in events_ref]
    return {"status": "success", "message": "List of events from Firestore"}

@app.post("/api/events")
def create_event(event: EventModel):
    # db.collection(u'events').add(event.dict())
    return {"status": "success", "message": "Event created successfully", "data": event.dict()}

@app.get("/api/sponsors/live")
def get_live_sponsors():
    """
    Simulates fetching real-world sponsor profiles for display.
    These are renowned tech companies usually looking to sponsor tech events.
    """
    real_sponsors = [
        {
            "id": "sponsor-101",
            "name": "Google Cloud",
            "role": "giver",
            "industry": "Cloud Computing",
            "hq": "Mountain View, CA",
            "offerrings": "Up to $10k in Cloud Credits, Mentorship sessions, API access.",
            "matchScore": 98
        },
        {
            "id": "sponsor-102",
            "name": "Stripe",
            "role": "giver",
            "industry": "FinTech",
            "hq": "San Francisco, CA",
            "offerrings": "Payment API integration support, swag, and $2k cash prize for best FinTech hack.",
            "matchScore": 95
        },
        {
            "id": "sponsor-103",
            "name": "Vercel",
            "role": "giver",
            "industry": "Developer Tools",
            "hq": "San Francisco, CA",
            "offerrings": "Pro Accounts, Engineering mentorship, and platform credits.",
            "matchScore": 92
        },
        {
            "id": "sponsor-104",
            "name": "AWS Startups",
            "role": "giver",
            "industry": "Cloud Computing",
            "hq": "Seattle, WA",
            "offerrings": "Activate Credits ($5k - $10k), go-to-market support.",
            "matchScore": 89
        },
        {
            "id": "sponsor-105",
            "name": "Supabase",
            "role": "giver",
            "industry": "Database / Open Source",
            "hq": "Remote",
            "offerrings": "Swag boxes, Pro plan credits, and developer advocate technical talk.",
            "matchScore": 85
        }
    ]
    return {"status": "success", "data": real_sponsors}

@app.get("/api/sponsors")
def get_sponsors():
    # Fetch from Firestore 'users' collection where role == 'giver'
    return {"status": "success", "message": "List of active sponsors"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
