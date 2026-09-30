// Sample content for the Harlow template. Practice details come from
// DemoContent; everything here is example copy to replace before launch.

export const dentists = [
  {
    name: "Dr. Elena Harlow",
    role: "Lead dentist",
    photo: { src: "/demos/harlow/dr-harlow.webp", width: 900, height: 1350 },
    bio: "Elena has practiced cosmetic and restorative dentistry for more than fifteen years. She plans every case with a digital scan and shows you a preview before treatment begins. Her approach is conservative: she keeps as much of your natural tooth as possible.",
    creds: ["DDS, University of Southern California", "Member, American Academy of Cosmetic Dentistry", "Advanced training in implant dentistry"],
  },
]

export const treatmentGroups = [
  {
    title: "Cosmetic and restorative",
    items: [
      ["Porcelain veneers", "Thin porcelain shells that change the shape, color or length of front teeth."],
      ["Dental implants", "A permanent replacement for one or more missing teeth."],
      ["Clear aligners", "Removable trays that straighten teeth over several months."],
      ["Whitening", "In-office or take-home whitening, planned around any existing work."],
      ["Crowns and bridges", "Porcelain restorations that repair a damaged tooth or fill a gap."],
    ],
  },
  {
    title: "General care",
    items: [
      ["Checkups and cleanings", "Exams, cleanings and X-rays that protect your health and your results."],
      ["Root canal therapy", "Treatment that saves an infected tooth and relieves the pain."],
      ["Emergency care", "Prompt appointments for pain, swelling or a broken tooth."],
    ],
  },
] as const

export const steps = [
  ["Consultation", "We talk through what you'd like to change, examine your teeth and answer your questions."],
  ["Digital scan and plan", "A 3D scan lets us show you a preview, with a written plan and costs."],
  ["Treatment", "Most treatments take two to four visits, scheduled around your calendar."],
  ["Follow-up", "We check your results after a few weeks and adjust anything that needs it."],
] as const

export const reviews = [
  { quote: "They showed me exactly what my veneers would look like before we started. They look like my own teeth.", who: "Rachel S." },
  { quote: "I put off replacing a missing tooth for years. The implant took less time than I expected, and I haven't thought about it since.", who: "David K." },
  { quote: "Clear costs, no pressure, and every appointment started on time.", who: "Monica T." },
]

export const insurers = ["Delta Dental", "Cigna", "MetLife", "Aetna", "Guardian", "UnitedHealthcare"]

export const faqs = [
  {
    q: "How long do porcelain veneers last?",
    a: "With good care, most veneers last 10 to 15 years. Regular cleanings, and a night guard if you grind your teeth, help them last longer.",
  },
  {
    q: "Do dental implants hurt?",
    a: "The procedure is done under local anesthetic, so you shouldn't feel pain during it. Most people have a few days of soreness afterward, which over-the-counter pain relief usually handles.",
  },
  {
    q: "Are clear aligners as effective as braces?",
    a: "For mild to moderate crowding and spacing, aligners work as well as braces and are far less visible. For more complex cases, we'll tell you if braces would work better.",
  },
  {
    q: "Does insurance cover cosmetic work?",
    a: "Insurance usually doesn't cover purely cosmetic treatment such as veneers or whitening. It often covers part of restorative work like crowns and implants, and we'll check your benefits before you commit.",
  },
  {
    q: "What happens at a consultation?",
    a: "We discuss your goals, examine your teeth and take a digital scan. You'll leave with a clear picture of your options, the timeline and the cost.",
  },
]

export const payment =
  "Insurance rarely covers purely cosmetic work, so we offer interest-free payment plans over up to 12 months. You'll have the full cost in writing before you commit."

export const parking = "Parking is available at the building. Ask us for directions when you book."
