import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const seedMockData = async () => {
  const events = [
    {
      id: "ekm-cusat-techfest",
      title: "Dhishna 2026 - CUSAT Tech Fest",
      organizedBy: "CUSAT School of Engineering",
      date: "Nov 12-14, 2026",
      location: "Ernakulam, Kerala (CUSAT Campus)",
      participants: 12000,
      tags: ["Tech", "Engineering", "College"],
      status: "Looking for Sponsors",
      description: "One of the largest technical symposia in South India, hosted by Cochin University of Science and Technology. Attracting thousands of engineering students nationwide for hackathons, robotics, and workshops.",
      requiredSponsorship: "$10,000",
      benefits: ["Logo on main stage", "Speaking slot (30 min)", "Booth access in prime campus spots"]
    },
    {
      id: "ekm-mec-excel",
      title: "Excel 2026 - Model Engineering College",
      organizedBy: "Govt. Model Engineering College, Thrikkakara",
      date: "Oct 5-7, 2026",
      location: "Ernakulam, Kerala (Thrikkakara)",
      participants: 8000,
      tags: ["Open Source", "Hackathon", "Web3"],
      status: "Looking for Sponsors",
      description: "Excel is the annual techno-managerial fest of Govt. Model Engineering College. Known for driving open-source culture in Kerala and hosting ibHack, a premier hackathon.",
      requiredSponsorship: "$8,500",
      benefits: ["Logo on website", "Access to top developer resumes", "Social media shoutouts"]
    },
    {
      id: "ekm-maker-village",
      title: "Kerala IoT Summit 2026",
      organizedBy: "Maker Village",
      date: "Dec 10, 2026",
      location: "Kochi, Kerala (KINFRA Hi-Tech Park)",
      participants: 3000,
      tags: ["Hardware", "IoT", "Startups"],
      status: "Looking for Sponsors",
      description: "Bringing together the brightest minds in hardware and electronics from across Kerala. Features pitches, prototyping challenges, and showcases.",
      requiredSponsorship: "$5,000",
      benefits: ["Event title association", "Workshop hosting", "Mentorship access"]
    },
    {
      id: "ekm-infopark-devcon",
      title: "Infopark Web DevCon",
      organizedBy: "Kerala IT Parks",
      date: "Feb 20-21, 2026",
      location: "Kakkanad, Ernakulam",
      participants: 5000,
      tags: ["Software", "React", "Cloud"],
      status: "Looking for Sponsors",
      description: "A two-day massive conference happening at Infopark, aimed at connecting professional developers, IT leaders, and cloud architects in Kerala.",
      requiredSponsorship: "$15,000",
      benefits: ["Keynote speaker tier", "Custom booth in IT hall", "Premium swag branding"]
    }
  ];

  for (const event of events) {
    try {
      await setDoc(doc(collection(db, "events"), event.id), event);
      console.log(`Seeded event: ${event.id}`);
    } catch (e) {
      console.error("Error seeding event:", e);
    }
  }

  const sponsors = [
    {
      id: "sponsor-tcs-kochi",
      name: "TCS Enterprise Kochi",
      type: "sponsor",
      industry: "IT Services",
      location: "Infopark, Ernakulam",
      website: "tcs.com/kochi",
      reputationStatus: "green",
      about: "Leading global IT services, consulting, and business solutions organization looking to support tech talent in Kerala.",
      stats: { sponsored: 45, totalSpent: "$250k+", responseRate: "95%" }
    },
    {
      id: "sponsor-aws-india",
      name: "AWS India Starter Pack",
      type: "sponsor",
      industry: "Cloud Infrastructure",
      location: "Remote / India",
      website: "aws.amazon.com/startups",
      reputationStatus: "green",
      about: "Providing cloud credits and technical support to student hackathons and technical fests heavily throughout South India.",
      stats: { sponsored: 120, totalSpent: "$1M+", responseRate: "99%" }
    }
  ];

  for (const sponsor of sponsors) {
    try {
      await setDoc(doc(collection(db, "sponsors"), sponsor.id), sponsor);
      console.log(`Seeded sponsor: ${sponsor.id}`);
    } catch (e) {
      console.error("Error seeding sponsor:", e);
    }
  }
};
