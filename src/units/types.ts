export type LandUnit = "ropani" | "aana" | "paisa" | "dam" | "bigha" | "kattha" | "dhur" | "sqft" | "sqm"

export type WeightUnit = "tola" | "lal" | "gram" | "kilogram"

export interface UnitFormatOptions {
  from?: LandUnit | WeightUnit
  style?: "notation" | "words"
  useNepaliDigits?: boolean
}
