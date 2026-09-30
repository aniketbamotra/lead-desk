// Sample content for the Fifth Street template. Practice details come from
// DemoContent; everything here is example copy to replace before launch.

export const team = [
  {
    name: "Dr. Sam Patel",
    role: "Owner and dentist",
    photo: { src: "/demos/fifth-street/dr-patel.webp", width: 800, height: 1200 },
    bio: "Sam opened the practice in 2015, a few blocks from Sam's first apartment in town. On weekends you'll usually find Sam out on a trail with the family dog.",
  },
  {
    name: "Dr. Jess Moreno",
    role: "Associate dentist",
    photo: { src: "/demos/fifth-street/dr-moreno.webp", width: 800, height: 1200 },
    bio: "Jess joined in 2021 and sees a lot of our youngest patients. Ask about the best breakfast tacos nearby and you'll get a very detailed answer.",
  },
]

export const prices = [
  { label: "New patient visit (exam, cleaning and X-rays)", price: "$99" },
  { label: "Emergency exam", price: "$75" },
  { label: "Whitening", price: "$299" },
]

export const priceNote = "Prices for patients without insurance. With insurance, we'll check your coverage before your visit."

export const reviews = [
  { quote: "Evening appointments mean I don't have to take time off work. That alone won me over.", who: "Maria G." },
  { quote: "Dr. Patel explained my options and what each one would cost, then let me decide. No pressure at all.", who: "Chris W." },
  { quote: "Both my kids go here. They like the front desk team almost as much as the stickers.", who: "Aisha B." },
]

export const steps = [
  ["Fill in your forms online", "We'll text you a link before your visit, so there's no clipboard in the waiting room."],
  ["Have a chat", "Your dentist asks about your health, any worries and what you'd like from the visit."],
  ["Exam and X-rays", "A full check of your teeth and gums, with digital X-rays if you need them."],
  ["Get your plan", "You'll leave with a written plan and prices, checked against your insurance."],
] as const

export const insurers = ["Delta Dental", "Cigna", "MetLife", "Aetna", "Guardian", "United Concordia"]

export const faqs = [
  {
    q: "Do you take my insurance?",
    a: "We're in network with most major PPO plans, including Delta Dental, Cigna, MetLife, Aetna, Guardian and United Concordia. Call us with your plan details and we'll check your coverage before you come in.",
  },
  {
    q: "I get nervous at the dentist. Can you help?",
    a: "Yes. Tell us when you book and we'll give you extra time. We explain each step before we do it, and you can ask us to stop whenever you need.",
  },
  {
    q: "When should my child first see a dentist?",
    a: "By their first birthday, or within six months of their first tooth. Early visits are short and mostly about getting comfortable.",
  },
  {
    q: "What counts as a dental emergency?",
    a: "Severe tooth pain, swelling in your face or gums, a knocked-out or broken tooth, or bleeding that won't stop. Call us as early as you can and we'll do our best to see you the same day.",
  },
  {
    q: "How long does a first visit take?",
    a: "About an hour. That covers a chat, a full exam, X-rays if needed and, in most cases, a cleaning.",
  },
]

export const parking = "Free parking by the building, and a bike rack by the front door."
