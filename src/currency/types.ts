import type { Grouping } from "@/conversion/decimal"
import type { EnglishWordsOptions } from "@/words"

export interface CurrencyOptions {
  useNepaliDigits?: boolean
  showPaisa?: boolean
  currencySymbol?: string
  precision?: number
  symbolPosition?: "before" | "after"
  grouping?: Grouping
}

export interface CurrencyWordsOptions {
  only?: boolean
}

export interface EnglishCurrencyWordsOptions extends EnglishWordsOptions {
  only?: boolean
}
