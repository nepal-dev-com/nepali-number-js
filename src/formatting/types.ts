import type { Grouping } from "@/conversion/decimal"

export interface FormatOptions {
  useNepaliDigits?: boolean
  addCommas?: boolean
  grouping?: Grouping
  precision?: number
  trimZero?: boolean
  sign?: "auto" | "always"
}

export interface PercentOptions {
  useNepaliDigits?: boolean
  precision?: number
  trimZero?: boolean
  addCommas?: boolean
  isRatio?: boolean
  symbol?: string
}
