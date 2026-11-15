# nepali-number

[![NPM Version](https://img.shields.io/npm/v/nepali-number)](https://www.npmjs.com/package/nepali-number)
[![npm download (18m)](https://img.shields.io/npm/d18m/nepali-number)](https://www.npmjs.com/package/nepali-number)
[![npm bundle size](https://img.shields.io/bundlephobia/min/nepali-number)](https://bundlephobia.com/result?p=nepali-number)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/nepali-number)](https://bundlephobia.com/result?p=nepali-number)
[![codecov](https://codecov.io/gh/nepal-dev-com/nepali-number-js/graph/badge.svg)](https://codecov.io/gh/nepal-dev-com/nepali-number-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/puncoz)](https://x.com/puncoz)

> Convert, format and spell out numbers in Nepali (Devanagari) — digits, lakh/crore grouping,
> words, ordinals, Nepali Rupees, fractions, traditional units and numbers inside text. Zero
> dependencies, fully typed, runs everywhere.

```ts
import { toNepali, formatNepaliNumber, toNepaliWords, toNepaliCurrency } from "nepali-number"

toNepali(2081)                    // → "२०८१"
formatNepaliNumber(1234567)       // → "१२,३४,५६७"
toNepaliWords(1234567)            // → "बाह्र लाख चौंतीस हजार पाँच सय सतसट्ठी"
toNepaliCurrency(1234567.89)      // → "रू १२,३४,५६७.८९"
```

> **Version note.** This README describes **v2** (`package.json` 2.0.0). npm's `latest` is
> still **1.0.3**, whose API is different — run `npm view nepali-number version` to check.
> Moving from v1? See the [migration guide](https://docs.nepal-dev.com/nepali-number/user-guide/latest/guides/migration-v1-to-v2).

## Features

- **Digits both ways** — `0-9` ⇄ `०-९`, in plain numbers or inside any text.
- **Grouping** — Nepali `1,23,45,678` or international `123,456,789`, with precision, sign and
  percent formatting.
- **Words** — Nepali cardinals with decimals (`बाह्र दशमलव पाँच`), English words in Nepali or
  international scales, ordinals in both (`पाँचौं`, `५औं`, `twenty first`, `21st`), short forms
  (`१२ लाख`), and words back to numbers.
- **Currency** — `रू १२,३४,५६७.८९`, rupees and paisa in Nepali or English words, cheque wording
  (`… मात्र`), and parsing amounts such as `Rs. 1,234/-`.
- **Fractions and multipliers** — `डेढ`, `साढे तीन`, `दुई बटा पाँच`, `दोब्बर`.
- **Traditional units** — रोपनी-आना-पैसा-दाम, बिघा-कट्ठा-धुर and तोला-लाल, converted and
  formatted.
- **Numbers in text** — find, replace and spell out the numbers in a sentence; compare and sort
  numbers written in either script.
- **Exact at any size** — numbers are read as decimal digits, never as floats: `bigint` and long
  digit strings format and spell without loss, and rounding is half away from zero.
- **Any digits in** — every function reads English, Nepali or mixed digits, as a `number`, a
  `bigint` or a string.
- **Zero dependencies**, about 7.5 kB gzipped, tree-shakeable named exports.
- **Everywhere** — ESM, CommonJS, UMD and IIFE builds with TypeScript declarations; Node.js,
  Bun, Deno, bundlers, browsers, workers and edge runtimes.
- **Never throws** for its declared input types — input that is not a number returns `""` or
  `NaN`, never a false zero.

## Installation

```bash
npm install nepali-number
# or
pnpm add nepali-number
yarn add nepali-number
bun add nepali-number
```

## Usage

```js
// ES modules (Node, Bun, Vite, webpack, esbuild…)
import { toNepali } from "nepali-number"

// CommonJS
const { toNepali } = require("nepali-number")

// Deno
import { toNepali } from "npm:nepali-number"
```

In the browser without a build step, the IIFE build exposes a global **`nepaliNumber`**:

```html
<script src="https://unpkg.com/nepali-number@2/dist/nepali-number.iife.js"></script>
<script>
  nepaliNumber.toNepali(123)   // "१२३"
</script>
```

TypeScript declarations are included — no `@types` package needed. Details for every
environment: [**Getting started**](https://docs.nepal-dev.com/nepali-number/user-guide/latest/getting-started).

## Using an AI coding agent

Paste this into Claude Code, Cursor, Copilot or another coding agent, and change the last line
to your task:

```text
Add the npm package "nepali-number" (version 2) to this project with the package manager the
project already uses. Before writing code, read
https://docs.nepal-dev.com/nepali-number/user-guide/latest/api.md and use only the functions it
lists, imported by name from "nepali-number". If the installed version is 1.x, stop and tell me.
Invalid input returns NaN or "" and never throws: handle it, and do not assume zero.

My task: show prices in Nepali digits with the rupee symbol on the cart page.
```

More prompts, and rules to keep in your project's `AGENTS.md`:
[**Using an AI coding agent**](https://docs.nepal-dev.com/nepali-number/user-guide/latest/guides/ai-agents).

## API at a glance

45 named, pure functions in eight domains. Full reference with options, defaults and edge cases:
[**API reference**](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api).

Every function that reads a number takes `NumericInput` — `number | bigint | string`.

### [Conversion](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/conversion)

| Function | Example |
|---|---|
| `toNepali(input)` | `toNepali("Room 12B")` → `"Room १२B"` |
| `toEnglish(input)` | `toEnglish("रू १,२३४")` → `"रू 1,234"` |
| `parseNepaliNumber(input)` | `parseNepaliNumber("१२,३४५.६७")` → `12345.67` |
| `convert(text, toNepali = true)` | `convert("मेरो उमेर २५ वर्ष", false)` → `"मेरो उमेर 25 वर्ष"` |

### [Formatting](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/formatting)

| Function | Example |
|---|---|
| `formatNepaliNumber(n, options?)` | `formatNepaliNumber(1234567.891)` → `"१२,३४,५६७.८९"` |
| `addNepaliCommas(n, grouping?)` | `addNepaliCommas(12345678)` → `"1,23,45,678"` |
| `formatPercent(value, options?)` | `formatPercent(12.5)` → `"१२.५०%"` |
| `removeFormatting(str)` | `removeFormatting("रू १२,३४,५६७.८९")` → `1234567.89` |

`formatNepaliNumber` options: `useNepaliDigits` (default `true`), `addCommas` (`true`),
`grouping` (`"nepali"`), `precision` (`2`), `trimZero` (`true` — drops an all-zero decimal
part), `sign` (`"auto"`).

```ts
formatNepaliNumber(1234567, { useNepaliDigits: false })       // → "12,34,567"
formatNepaliNumber(1234.567, { precision: 0 })                // → "१,२३५"
formatNepaliNumber(1234567, { grouping: "international" })    // → "१,२३४,५६७"
formatNepaliNumber(12345678901234567890n)                     // → "१,२३,४५,६७,८९,०१,२३,४५,६७,८९०"
```

### [Words](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/words)

| Function | Example |
|---|---|
| `toNepaliWords(n)` | `toNepaliWords(123)` → `"एक सय तेईस"`, `toNepaliWords(12.5)` → `"बाह्र दशमलव पाँच"` |
| `toEnglishWords(n, options?)` | `toEnglishWords(12345678)` → `"one crore twenty three lakh forty five thousand six hundred seventy eight"` |
| `toNepaliOrdinal(n)` | `toNepaliOrdinal(1)` → `"पहिलो"`, `toNepaliOrdinal(5)` → `"पाँचौं"` |
| `toEnglishOrdinal(n, options?)` | `toEnglishOrdinal(21)` → `"twenty first"` |
| `toNepaliOrdinalNumber(n, options?)` | `toNepaliOrdinalNumber(5)` → `"५औं"` |
| `toEnglishOrdinalNumber(n, options?)` | `toEnglishOrdinalNumber(21)` → `"21st"` |
| `toDecimalWord(n, options?)` | `toDecimalWord(1200000)` → `"१२ लाख"`, `toDecimalWord(25000000)` → `"२.५० करोड"` |
| `parseNepaliWords(words)` | `parseNepaliWords("एक लाख पच्चीस हजार")` → `125000` |
| `parseEnglishWords(words)` | `parseEnglishWords("one lakh twenty five thousand")` → `125000` |

### [Currency](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/currency)

| Function | Example |
|---|---|
| `toNepaliCurrency(n, options?)` | `toNepaliCurrency(1234567.89)` → `"रू १२,३४,५६७.८९"` |
| `toNepaliCurrencyWords(n, options?)` | `toNepaliCurrencyWords(250, { only: true })` → `"दुई सय पचास रुपैयाँ मात्र"` |
| `toEnglishCurrencyWords(n, options?)` | `toEnglishCurrencyWords(250, { only: true })` → `"two hundred fifty rupees only"` |
| `parseNepaliCurrency(text)` | `parseNepaliCurrency("Rs. 1,234/-")` → `1234` |

`toNepaliCurrency` options: `useNepaliDigits` (`true`), `showPaisa` (`true`),
`currencySymbol` (`"रू"`), `precision` (`2`), `symbolPosition` (`"before"`), `grouping`
(`"nepali"`).

```ts
toNepaliCurrency(1234567.89, { showPaisa: false })                          // → "रू १२,३४,५६८"
toNepaliCurrency(1234, { useNepaliDigits: false, currencySymbol: "Rs." })   // → "Rs. 1,234.00"
toNepaliCurrency(-1234.5)                                                   // → "-रू १,२३४.५०"
```

### [Fractions](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/fractions)

| Function | Example |
|---|---|
| `toNepaliFraction(value)` | `toNepaliFraction(1.5)` → `"डेढ"`, `toNepaliFraction(3.5)` → `"साढे तीन"` |
| `toNepaliFractionWords(numerator, denominator)` | `toNepaliFractionWords(2, 5)` → `"दुई बटा पाँच"` |
| `toNepaliMultiplier(times)` | `toNepaliMultiplier(2)` → `"दोब्बर"` |

### [Units](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/units)

| Function | Example |
|---|---|
| `convertLandArea(value, from, to)` | `convertLandArea(1, "ropani", "sqft")` → `5476` |
| `formatRopani(value, options?)` | `formatRopani(6438.578125)` → `"१-२-३-१"` |
| `formatBigha(value, options?)` | `formatBigha(72900)` → `"१-०-०"` |
| `parseLandArea(text, system)` | `parseLandArea("१-२-३-१", "ropani")` → `6438.578125` |
| `convertWeight(value, from, to)` | `convertWeight(1, "tola", "gram")` → `11.6638` |
| `formatTola(value, options?)` | `formatTola(29.1595, { style: "words" })` → `"२ तोला ५० लाल"` |

### [Text](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/text)

| Function | Example |
|---|---|
| `findNumbers(text)` | `findNumbers("३ वटा")` → `[{ match: "३", value: 3, index: 0, system: "nepali" }]` |
| `extractNumbers(text)` | `extractNumbers("मसँग ३ वटा किताब र 1,200 रुपैयाँ छ")` → `[3, 1200]` |
| `replaceNumbers(text, replacer)` | `replaceNumbers("Total 1234567 people", (m) => formatNepaliNumber(m.value))` → `"Total १२,३४,५६७ people"` |
| `spellOutNumbers(text, options?)` | `spellOutNumbers("मसँग ३ वटा किताब र 1,200 रुपैयाँ छ")` → `"मसँग तीन वटा किताब र एक हजार दुई सय रुपैयाँ छ"` |
| `compareNumbers(a, b)` | `compareNumbers("१२३", 123)` → `0` |
| `sortNumbers(values, order?)` | `sortNumbers(["१०", 9, "1,000", "२.५"])` → `["२.५", 9, "१०", "1,000"]` |

### [Utilities](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/utils)

| Function | Example |
|---|---|
| `normalize(str)` | `normalize("  १२३  ४५६  ")` → `"१२३४५६"` |
| `detectNumberSystem(str)` | `"1234"` → `"english"`, `"१२३४"` → `"nepali"`, `"12३४"` → `"mixed"`, `"abcd"` → `"none"` |
| `isValidNumber(str)` | `"-1,234.5"` → `true` |
| `validateNepaliNumber(str)` | `"१२३.४५"` → `true`, `"१२३.४५.६"` → `false` |
| `isNepaliDigit(char)` | `"५"` → `true` |
| `isEnglishDigit(char)` | `"5"` → `true` |
| `isMixedNumber(str)` | `"12३४"` → `true` |
| `padZeros(n, length, options?)` | `padZeros(42, 5)` → `"०००४२"`, `padZeros(-5, 4)` → `"-००५"` |
| `roundNepali(n, decimals = 2)` | `roundNepali(3.14159)` → `"३.१४"` |

### Types

Every input, option and result type is exported
([types](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/types)):

```ts
import type { NumericInput, FormatOptions, CurrencyOptions, NumberMatch } from "nepali-number"
```

## Good to know

The full list, with a workaround for each, is in
[**limitations**](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/limitations).

- **Input that is not a number returns `""` or `NaN`, not zero** — `formatNepaliNumber("abc")` →
  `""`, `parseNepaliNumber("abc")` → `NaN`. Write `formatNepaliNumber(value) || "०"` where a zero
  fallback is wanted.
- **The whole string must be a number** — `parseNepaliNumber("12abc")` → `NaN`. To pull digits
  out of any text use `removeFormatting`, and for amounts with a symbol `parseNepaliCurrency`.
- **Rounding is half away from zero, on the digits as written** — `formatNepaliNumber(1.005)` →
  `"१.०१"`.
- **A function that returns a `number` is still a JavaScript number** — above 2⁵³ keep the value
  as a string or a `bigint` and pass it straight to the formatting and word functions.

## Documentation

| | |
|---|---|
| [Getting started](https://docs.nepal-dev.com/nepali-number/user-guide/latest/getting-started) | Install and import in Node, Bun, Deno, bundlers, TypeScript, the browser |
| [Recipes](https://docs.nepal-dev.com/nepali-number/user-guide/latest/guides/recipes) | Reading typed input, displaying amounts, cheques in words, sorting, land area, React and Vue helpers |
| [Using an AI coding agent](https://docs.nepal-dev.com/nepali-number/user-guide/latest/guides/ai-agents) | Prompts to paste, rules for your `AGENTS.md`, docs as Markdown |
| [API reference](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api) | Every export: signature, options, defaults, outputs |
| [Limitations](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api/limitations) | Edge cases and workarounds |
| [Migrating from v1](https://docs.nepal-dev.com/nepali-number/user-guide/latest/guides/migration-v1-to-v2) | v1 function → v2 function |
| [Versioning](https://docs.nepal-dev.com/nepali-number/maintainer-guide/release/versioning) | What counts as a breaking change |
| [All documentation](https://docs.nepal-dev.com/nepali-number/maintain) | The map, including architecture, decisions and security |

## Contributing

Issues and pull requests are welcome. Start with [**`CONTRIBUTING.md`**](CONTRIBUTING.md): how to
report a bug or a wrong Nepali word, how to set up, and what a pull request needs.

In short: **every feature and functional change starts with an ADR** in
[decision records](https://docs.nepal-dev.com/nepali-number/maintainer-guide/adr) that the owner approves before code is written. Any change a
consumer can observe — including a changed word or spelling — ships its
[API reference](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api) update and a semver decision with it. Tests are part of
every change. Unclear Nepali-language or rounding questions are asked, not guessed. The working
agreement itself, for people and AI agents alike, is [`AGENTS.md`](AGENTS.md).

| | |
|---|---|
| [Code of conduct](CODE_OF_CONDUCT.md) | How we treat each other here |
| [Getting help](SUPPORT.md) | Where a question, a bug or an idea goes |
| [Security policy](SECURITY.md) | **Report a vulnerability privately**, never in a public issue |

## License

[MIT](LICENSE) © Puncoz Nepal

## Author

**Puncoz Nepal**

- X (formerly Twitter): [@puncoz](https://x.com/puncoz)
- GitHub: [@puncoz](https://github.com/puncoz)
- Website: [https://puncoz.com](https://puncoz.com)
- Email: <info@puncoz.com>

## Related packages

- [bikram-sambat-js](https://github.com/puncoz-official/bikram-sambat-js) — convert dates between
  AD and Nepali BS (Bikram Sambat).
- [nepali-datepicker-reactjs](https://github.com/puncoz-official/nepali-datepicker-reactjs) — React
  date picker for Bikram Sambat.

---

Made with ❤️ for the Nepali developer community
