export const NEPALI_DIGITS = "०१२३४५६७८९"

// `zeros` is the power of ten: scales are matched on digit counts so that words stay exact above 2^53 — ADR-0012.
export const NEPALI_SCALES: {
  zeros: number
  label_np: string
  label_en: string
  label_ordinal: string
}[] = [
  { zeros: 19, label_np: "महाशंख", label_en: "maha-shankh", label_ordinal: "महाशंखौं" },
  { zeros: 17, label_np: "शंख", label_en: "shankh", label_ordinal: "शंखौं" },
  { zeros: 15, label_np: "पद्म", label_en: "padma", label_ordinal: "पदमौं" },
  { zeros: 13, label_np: "नील", label_en: "neel", label_ordinal: "नीलौं" },
  { zeros: 11, label_np: "खर्ब", label_en: "kharab", label_ordinal: "खरबौं" },
  { zeros: 9, label_np: "अर्ब", label_en: "arab", label_ordinal: "अरबौं" },
  { zeros: 7, label_np: "करोड", label_en: "crore", label_ordinal: "करोडौं" },
  { zeros: 5, label_np: "लाख", label_en: "lakh", label_ordinal: "लाखौं" },
  { zeros: 3, label_np: "हजार", label_en: "thousand", label_ordinal: "हजारौं" },
  { zeros: 2, label_np: "सय", label_en: "hundred", label_ordinal: "सयौं" },
]

export const NEPALI_NEGATIVE: string = "ऋण"
export const NEPALI_DECIMAL_POINT: string = "दशमलव"

// Indexed by the number: 1–4 are irregular like their ordinal words, everything else takes the first entry — ADR-0014.
export const NEPALI_ORDINAL_SUFFIXES: string[] = ["औं", "लो", "रो", "रो", "थो"]

export const ENGLISH_INTERNATIONAL_SCALES: { zeros: number, label_en: string }[] = [
  { zeros: 33, label_en: "decillion" },
  { zeros: 30, label_en: "nonillion" },
  { zeros: 27, label_en: "octillion" },
  { zeros: 24, label_en: "septillion" },
  { zeros: 21, label_en: "sextillion" },
  { zeros: 18, label_en: "quintillion" },
  { zeros: 15, label_en: "quadrillion" },
  { zeros: 12, label_en: "trillion" },
  { zeros: 9, label_en: "billion" },
  { zeros: 6, label_en: "million" },
  { zeros: 3, label_en: "thousand" },
  { zeros: 2, label_en: "hundred" },
]

export const ENGLISH_NEGATIVE: string = "negative"
export const ENGLISH_POINT: string = "point"
export const ENGLISH_AND: string = "and"

export const ENGLISH_ORDINAL_EXCEPTIONS: [cardinal: string, ordinal: string][] = [
  ["one", "first"],
  ["two", "second"],
  ["three", "third"],
  ["five", "fifth"],
  ["eight", "eighth"],
  ["nine", "ninth"],
  ["twelve", "twelfth"],
]

// Indexed by the last digit; 11, 12 and 13 take the first entry.
export const ENGLISH_ORDINAL_SUFFIXES: string[] = ["th", "st", "nd", "rd"]

export const NEPALI_CURRENCY: { symbol: string, rupee: string, paisa: string, only: string } = {
  symbol: "रू",
  rupee: "रुपैयाँ",
  paisa: "पैसा",
  only: "मात्र",
}

export const ENGLISH_CURRENCY: { rupee: string, rupees: string, paisa: string, only: string } = {
  rupee: "rupee",
  rupees: "rupees",
  paisa: "paisa",
  only: "only",
}

// Longer symbols first, so "Rs." is not read as "Rs" followed by a stray dot — ADR-0015.
export const CURRENCY_INPUT_SYMBOLS: string[] = ["रु.", "रू", "रु", "Rs.", "Rs", "NPR"]
export const CURRENCY_INPUT_SUFFIX: string = "/-"

export const NEPALI_WORDS: string[] = [
  "शून्य",
  "एक", "दुई", "तीन", "चार", "पाँच", "छ", "सात", "आठ", "नौ", "दश",
  "एघार", "बाह्र", "तेह्र", "चौध", "पन्ध्र", "सोह्र", "सत्र", "अठार", "उन्नाइस", "बीस",
  "एक्काईस", "बाईस", "तेईस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताईस", "अट्ठाईस", "उनन्तीस", "तीस",
  "एकतीस", "बत्तीस", "तेत्तीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अठतीस", "उनन्चालीस", "चालीस",
  "एकचालीस", "बयालीस", "त्रिचालीस", "चवालीस", "पैंतालीस", "छयालीस", "सतचालीस", "अठचालीस", "उनन्चास", "पचास",
  "एकाउन्न", "बाउन्न", "त्रिपन्न", "चउन्न", "पचपन्न", "छपन्न", "सन्ताउन्न", "अन्ठाउन्न", "उनन्साठी", "साठी",
  "एकसट्ठी", "बैसट्ठी", "त्रिसट्ठी", "चौंसट्ठी", "पैंसट्ठी", "छैसट्ठी", "सतसट्ठी", "अठसट्ठी", "उनन्सत्तरी", "सत्तरी",
  "एकहत्तर", "बहत्तर", "त्रिहत्तर", "चौहत्तर", "पचहत्तर", "छहत्तर", "सतहत्तर", "अठहत्तर", "उनासी", "असी",
  "एकासी", "बयासी", "त्रियासी", "चौरासी", "पचासी", "छयासी", "सतासी", "अठासी", "उनान्नब्बे", "नब्बे",
  "एकानब्बे", "बयानब्बे", "त्रियानब्बे", "चौरानब्बे", "पन्चानब्बे", "छयानब्बे", "सन्तानब्बे", "अन्ठानब्बे", "उनान्सय",
]

export const NEPALI_ORDINALS_EXCEPTIONS: string[] = ["शून्यौं", "पहिलो", "दोस्रो", "तेस्रो", "चौथो"]
export const NEPALI_ORDINALS: string[] = [
  "शून्य",
  "एकौं", "दुइऔं", "तीनौं", "चारौं", "पाँचौं", "छैटौं", "सातौं", "आठौं", "नवौं", "दशौं",
  "एघारौं", "बाह्रौं", "तेह्रौं", "चौधौं", "पन्ध्रौं", "सोह्रौं", "सत्रौं", "अठारौं", "उन्नाईसौं", "बीसौं",
  "एक्काईसौं", "बाईसौं", "तेईसौं", "चौबीसौं", "पच्चीसौं", "छब्बीसौं", "सत्ताईसौं", "अट्ठाईसौं", "उनन्तीसौं", "तीसौं",
  "एकतीसौं", "बत्तीसौं", "तेत्तीसौं", "चौंतीसौं", "पैंतीसौं", "छत्तीसौं", "सैंतीसौं", "अठतीसौं", "उनन्चालीसौं", "चालीसौं",
  "एकचालीसौं", "बयालीसौं", "त्रिचालीसौं", "चवालीसौं", "पैंतालीसौं", "छयालीसौं", "सतचालीसौं", "अठचालीसौं", "उनन्चासौं", "पचासौं",
  "एकाउन्नौं", "बाउन्नौं", "त्रिपन्नौं", "चउन्नौं", "पचपन्नौं", "छपन्नौं", "सन्ताउन्नौं", "अन्ठाउन्नौं", "उनन्साठीऔं", "साठीऔं",
  "एकसट्ठीऔं", "बैसट्ठीऔं", "त्रिसट्ठीऔं", "चौंसट्ठीऔं", "पैंसट्ठीऔं", "छैसट्ठीऔं", "सतसट्ठीऔं", "अठसट्ठीऔं", "उनन्सत्तरीऔं", "सत्तरीऔं",
  "एकहत्तरौं", "बहत्तरौं", "त्रिहत्तरौं", "चौहत्तरौं", "पचहत्तरौं", "छहत्तरौं", "सतहत्तरौं", "अठहत्तरौं", "उनासीऔं", "असीऔं",
  "एकासीऔं", "बयासीऔं", "त्रियासीऔं", "चौरासीऔं", "पचासीऔं", "छयासीऔं", "सतासीऔं", "अठासीऔं", "उनान्नब्बेऔं", "नब्बेऔं",
  "एकानब्बेऔं", "बयानब्बेऔं", "त्रियानब्बेऔं", "चौरानब्बेऔं", "पन्चानब्बेऔं", "छयानब्बेऔं", "सन्तानब्बेऔं", "अन्ठानब्बेऔं", "उनान्सयौं",
]

export const ENGLISH_WORDS: {
  ONES: string[]
  TEENS: string[]
  TENS: string[]
} = {
  "ONES": ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
  "TEENS": ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
  "TENS": ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
}

// Square feet per land unit — ADR-0017.
export const LAND_UNIT_SQFT: Record<string, number> = {
  ropani: 5476,
  aana: 342.25,
  paisa: 85.5625,
  dam: 21.390625,
  bigha: 72900,
  kattha: 3645,
  dhur: 182.25,
  sqft: 1,
  sqm: 1 / 0.09290304,
}

// Grams per weight unit — ADR-0017.
export const WEIGHT_UNIT_GRAMS: Record<string, number> = {
  tola: 11.6638,
  lal: 0.116638,
  gram: 1,
  kilogram: 1000,
}

// Largest part first; `base` is how many of a part make one of the part before it — ADR-0017.
export const UNIT_PARTS: Record<string, { unit: string, label: string, base: number }[]> = {
  ropani: [
    { unit: "ropani", label: "रोपनी", base: 0 },
    { unit: "aana", label: "आना", base: 16 },
    { unit: "paisa", label: "पैसा", base: 4 },
    { unit: "dam", label: "दाम", base: 4 },
  ],
  bigha: [
    { unit: "bigha", label: "बिघा", base: 0 },
    { unit: "kattha", label: "कट्ठा", base: 20 },
    { unit: "dhur", label: "धुर", base: 20 },
  ],
  tola: [
    { unit: "tola", label: "तोला", base: 0 },
    { unit: "lal", label: "लाल", base: 100 },
  ],
}

// Spoken quarter steps — ADR-0016. The small values have their own words; the prefixes take a whole number after them.
export const NEPALI_FRACTIONS: {
  quarter: string
  half: string
  threeQuarters: string
  oneAndQuarter: string
  oneAndHalf: string
  twoAndHalf: string
  quarterPrefix: string
  halfPrefix: string
  threeQuarterPrefix: string
  connector: string
} = {
  quarter: "पाउ",
  half: "आधा",
  threeQuarters: "तीन पाउ",
  oneAndQuarter: "सवा",
  oneAndHalf: "डेढ",
  twoAndHalf: "अढाई",
  quarterPrefix: "सवा",
  halfPrefix: "साढे",
  threeQuarterPrefix: "पौने",
  connector: "बटा",
}

// Indexed by the multiplier: only 2, 3 and 4 have their own word — ADR-0016.
export const NEPALI_MULTIPLIERS: string[] = ["", "", "दोब्बर", "तेब्बर", "चौबर"]
export const NEPALI_TIMES: string = "गुणा"
