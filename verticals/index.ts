import { dental } from "./dental"
import type { VerticalConfig } from "./types"

// One vertical in v0.1. A switcher later only needs to change what this returns.
export const activeVertical: VerticalConfig = dental

export type { VerticalConfig } from "./types"
