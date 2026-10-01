// Sample content for the Clearview template. Practice details (name, phone,
// address, hours) come from DemoContent; everything here is example copy to
// replace with the practice's own before a site goes live.

export const team = [
  {
    name: "Dr. Priya Raman",
    role: "Dentist and practice owner",
    photo: { src: "/demos/clearview/dr-raman.webp", width: 800, height: 1200 },
    bio: "Priya leads our crown and implant work. She likes to show patients their scans on screen so every decision is easy to follow.",
  },
  {
    name: "Dr. Michael Grant",
    role: "General dentist",
    photo: { src: "/demos/clearview/dr-grant.webp", width: 800, height: 1000 },
    bio: "Michael has cared for local families for more than a decade. Patients who feel anxious about treatment often ask for him by name.",
  },
  {
    name: "Dr. Anna Kowalski",
    role: "Family and children's dentist",
    photo: { src: "/demos/clearview/dr-kowalski.webp", width: 800, height: 1055 },
    bio: "Anna sees most of our younger patients. She keeps visits short, clear and calm for kids and parents alike.",
  },
]

export const serviceGroups = [
  {
    title: "Everyday care",
    items: [
      ["Checkups & cleanings", "Exams, cleanings and X-rays, usually twice a year.", "checkups"],
      ["Children's dentistry", "Calm, friendly visits for kids from their first tooth.", "children"],
      ["Fillings & crowns", "Tooth-colored fillings and crowns to repair damage.", "fillings"],
    ],
  },
  {
    title: "Repair and replace",
    items: [
      ["Root canal therapy", "Save an infected tooth and relieve the pain.", "rootCanal"],
      ["Dental implants", "A long-lasting replacement for a missing tooth.", "implants"],
    ],
  },
  {
    title: "Cosmetic",
    items: [
      ["Whitening", "In-office or take-home options for a brighter smile.", "whitening"],
      ["Clear aligners", "Removable aligners that straighten teeth gradually.", "aligners"],
    ],
  },
] as const

export const modern = [
  {
    title: "Digital X-rays",
    photo: { src: "/demos/clearview/xrays.webp", width: 960, height: 640, alt: "A dentist reviewing X-ray images on a light box" },
    text: "They use much less radiation than film X-rays. Your images appear on screen straight away, so we can talk them through with you.",
  },
  {
    title: "No impression trays",
    photo: { src: "/demos/clearview/scanner.webp", width: 960, height: 1440, alt: "A dentist scanning a patient's teeth with a small intraoral scanner" },
    text: "Instead of biting into trays of putty, we take a quick 3D scan with a small wand. It's more comfortable and gives a more accurate fit.",
  },
  {
    title: "Crowns and implants, planned precisely",
    photo: { src: "/demos/clearview/crown.webp", width: 960, height: 640, alt: "A model of a dental implant and crown between natural teeth" },
    text: "Your scan becomes a precise 3D model, so crowns and implants fit well the first time and you spend less time in the chair.",
  },
]

export const reviews = [
  { quote: "I booked at 10pm and was in the chair at 7:30 the next morning. Done before work.", who: "Jordan P." },
  { quote: "The scan instead of the putty trays was a relief. My crown fit perfectly.", who: "Linda H." },
  { quote: "They showed me my X-rays on screen and gave me a clear price before anything started.", who: "Marcus R." },
]

export const steps = [
  ["Book a time", "Choose a time that suits you. You'll get a confirmation by text and email."],
  ["Fill in your forms", "We send a short online form beforehand, so there's no paperwork at the desk."],
  ["Exam and X-rays", "A full check of your teeth and gums, with digital X-rays if you need them."],
  ["Your plan", "Before you leave, you'll get a written plan with costs, checked against your insurance."],
] as const

export const insurers = ["Delta Dental", "Cigna", "MetLife", "Aetna", "Guardian", "United Concordia"]

export const faqs = [
  {
    q: "Do you take my insurance?",
    a: "We're in network with most major PPO plans, including Delta Dental, Cigna, MetLife, Aetna, Guardian and United Concordia. Call us with your plan details and we'll check your coverage before your visit.",
  },
  {
    q: "I get nervous at the dentist. Can you help?",
    a: "Yes. Tell us when you book and we'll allow extra time. We explain each step before we start, and you can ask us to pause at any point.",
  },
  {
    q: "When should my child first see a dentist?",
    a: "By their first birthday, or within six months of their first tooth. Early visits are short and focus on getting comfortable.",
  },
  {
    q: "What counts as a dental emergency?",
    a: "Severe tooth pain, swelling in your face or gums, a knocked-out or broken tooth, or bleeding that won't stop. Call us as early as you can and we'll do our best to see you the same day.",
  },
  {
    q: "How long does a first visit take?",
    a: "About an hour. That covers a conversation about your health, a full exam, X-rays if needed and, in most cases, a cleaning.",
  },
]

export const parking = "Free parking outside the building. Our entrance is at street level."
