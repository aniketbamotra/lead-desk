// Sample content for the Brightwater template. Practice details come from
// DemoContent; everything here is example copy to replace before launch.

export const services = [
  ["Checkups & cleanings", "checkups-cleanings", "Gentle cleanings, exams and low-dose digital X-rays, usually every six months."],
  ["Fillings & crowns", "fillings-crowns", "Tooth-colored fillings and ceramic crowns, matched to your own teeth."],
  ["Children's dentistry", "childrens-dentistry", "First visits from age one, sealants, fluoride and plenty of patience."],
  ["Whitening", "whitening", "In-office whitening in about an hour, or custom trays to use at home."],
  ["Clear aligners", "clear-aligners", "Straighten teeth discreetly with removable aligners and regular check-ins."],
  ["Dental implants", "dental-implants", "A permanent, natural-looking replacement for a missing tooth."],
  ["Root canal therapy", "root-canal", "Save an infected tooth and end the pain, usually in one comfortable visit."],
  ["Emergency care", "emergency-care", "Same-day appointments for pain, swelling, and chipped or knocked-out teeth."],
] as const

export const comforts = [
  ["A plan before any treatment.", "We show you photos, explain the options and give you the cost up front."],
  ["Raise a hand to pause.", "Any time, for any reason."],
  ["Comfort options.", "Headphones, weighted blankets and nitrous oxide are available on request."],
] as const

export const team = [
  {
    photo: "/demos/brightwater/dr-maya-okafor.webp",
    name: "Dr. Maya Okafor",
    role: "Founder and general dentist",
    bio: "Maya opened the practice after a decade in community clinics. She has a soft spot for anxious patients.",
  },
  {
    photo: "/demos/brightwater/dr-daniel-reyes.webp",
    name: "Dr. Daniel Reyes",
    role: "Family and pediatric dentist",
    bio: "Daniel sees most of our youngest patients and is known for explaining X-rays with dinosaur analogies.",
  },
  {
    photo: "/demos/brightwater/dr-hannah-liu.webp",
    name: "Dr. Hannah Liu",
    role: "Restorative and cosmetic dentist",
    bio: "Hannah leads our crown and aligner work, and plans each case with patients using 3D scans.",
  },
]

export const reviews = [
  { quote: "I hadn't been to a dentist in eight years. Nobody lectured me. They just made a plan and got me back on track.", who: "Priya S., patient since 2022" },
  { quote: "Both my kids actually ask when they get to go back. I didn't think that was possible.", who: "Marcus T., parent" },
  { quote: "Cracked a molar on a Saturday morning and was in the chair by eleven.", who: "Elena W., patient since 2019" },
]

export const firstVisit = [
  "A conversation about your history and any concerns",
  "Low-dose digital X-rays and a full exam",
  "A cleaning, if time and your gums allow",
  "A written plan with costs, before you leave",
]

export const insurers = ["Delta Dental", "Cigna", "MetLife", "Aetna", "Guardian", "Humana", "United Concordia", "Ameritas"]

export const reasons = ["Checkup & cleaning", "Tooth pain", "Cosmetic consult", "Child's visit", "Filling or crown", "Something else"]

export const parking = "Free parking next to the building, with a step-free entrance."
