export interface NumberMatch {
  match: string
  value: number
  index: number
  system: "english" | "nepali" | "mixed"
}

export interface SpellOutOptions {
  words?: "nepali" | "english"
}
