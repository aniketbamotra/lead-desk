import type { ComponentType } from "react"
import type { TemplateProps } from "./_shared/content"
import type { TemplateId } from "./index"
import Brightwater from "./brightwater"
import Clearview from "./clearview"
import FifthStreet from "./fifth-street"
import Harlow from "./harlow"

// Server-side only: the demo pages render these. The desk imports ./index.
export const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<TemplateProps>> = {
  clearview: Clearview,
  brightwater: Brightwater,
  "fifth-street": FifthStreet,
  harlow: Harlow,
}
