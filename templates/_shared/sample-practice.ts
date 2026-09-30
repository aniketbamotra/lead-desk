import type { DemoContent } from "./content"
import { DEFAULT_HOURS } from "./practice"

// A fictional practice for previewing templates without a lead.
export const SAMPLE_CONTENT: DemoContent = {
  practice: {
    name: "Riverside Family Dental",
    phone: "919-555-0172",
    email: "hello@example.com",
    street: "2300 Glenwood Avenue",
    suite: "Suite 105",
    city: "Raleigh",
    state: "NC",
    zip: "27608",
    hours: [
      null,
      { open: "07:30", close: "17:00" },
      { open: "10:00", close: "19:00" },
      { open: "07:30", close: "17:00" },
      { open: "07:30", close: "17:00" },
      { open: "08:00", close: "14:00" },
      { open: "09:00", close: "13:00" },
    ],
    bookUrl: null,
  },
  headline: null,
  intro: null,
}

export { DEFAULT_HOURS }
