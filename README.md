# nepali-number

[![NPM Version](https://img.shields.io/npm/v/nepali-number)](https://www.npmjs.com/package/nepali-number)
[![npm download (18m)](https://img.shields.io/npm/d18m/nepali-number)](https://www.npmjs.com/package/nepali-number)
[![npm bundle size](https://img.shields.io/bundlephobia/min/nepali-number)](https://bundlephobia.com/result?p=nepali-number)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/nepali-number)](https://bundlephobia.com/result?p=nepali-number)
[![codecov](https://codecov.io/gh/puncoz-official/nepali-number-js/graph/badge.svg)](https://codecov.io/gh/puncoz-official/nepali-number-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/puncoz)](https://x.com/puncoz)

> Convert, format and spell out numbers in Nepali (Devanagari) — digits, lakh/crore grouping,
> words, ordinals and Nepali Rupees. Zero dependencies, fully typed, runs everywhere.

```ts
import { toNepali, formatNepaliNumber, toNepaliWords, toNepaliCurrency } from "nepali-number"

toNepali(2081)                    // → "२०८१"
formatNepaliNumber(1234567)       // → "१२,३४,५६७"
toNepaliWords(1234567)            // → "बाह्र लाख चौंतीस हजार पाँच सय सतसट्ठी"
toNepaliCurrency(1234567.89)      // → "रू १२,३४,५६७.८९"
```

> **Version note.** This README describes **v2** (`package.json` 2.0.0). npm's `latest` is
> still **1.0.3**, whose API is different — run `npm view nepali-number version` to check.
> Moving from v1? See the [migration guide](https://docs.nepal-dev.com/nepali-number/use/latest/guides/migration-v1-to-v2).

## Features

- **Digits both ways** — `0-9` ⇄ `०-९`, in plain numbers or inside any text.
- **Nepali grouping** — `1,23,45,678`, with precision and trailing-zero control.
- **Words** — Nepali cardinals (`एक सय तेईस`), English words with Nepali scales
  (`twelve lakh …`), Nepali ordinals (`पहिलो`, `पाँचौं`), and short forms (`१२ लाख`).
- **Currency** — `रू १२,३४,५६७.८९` and `… रुपैयाँ … पैसा`.
- **Utilities** — normalise typed input, detect and validate digit systems, pad, round.
- **Any digits in** — every function reads English, Nepali or mixed digits.
- **Zero dependencies**, ~2.8 kB gzipped, tree-shakeable named exports.
- **Everywhere** — ESM, CommonJS, UMD and IIFE builds with TypeScript declarations; Node.js,
  Bun, Deno, bundlers, browsers, workers and edge runtimes.
- **Never throws** for its declared input types — invalid input returns a documented default.

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
environment: [**Getting started**](https://docs.nepal-dev.com/nepali-number/use/latest/getting-started).

## API at a glance

Every export is a named, pure function. Full reference with options, defaults and edge cases:
[**API reference**](https://docs.nepal-dev.com/nepali-number/use/latest/api).

### Conversion

| Function | Example |
|---|---|
| [`toNepali(input)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/conversion#tonepaliinput) | `toNepali("Room 12B")` → `"Room १२B"` |
| [`toEnglish(input)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/conversion#toenglishinput) | `toEnglish("रू १,२३४")` → `"रू 1,234"` |
| [`parseNepaliNumber(str)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/conversion#parsenepalinumbernepalinumber) | `parseNepaliNumber("१२,३४५.६७")` → `12345.67` |
| [`convert(text, toNepali = true)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/conversion#converttext-tonepalinumber) | `convert("मेरो उमेर २५ वर्ष", false)` → `"मेरो उमेर 25 वर्ष"` |

### Formatting

| Function | Example |
|---|---|
| [`formatNepaliNumber(n, options?)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/formatting#formatnepalinumbernumber-options) | `formatNepaliNumber(1234567.891)` → `"१२,३४,५६७.८९"` |
| [`addNepaliCommas(n)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/formatting#addnepalicommasnumber) | `addNepaliCommas(12345678)` → `"1,23,45,678"` |
| [`removeFormatting(str)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/formatting#removeformattingformattedstring) | `removeFormatting("रू १२,३४,५६७.८९")` → `1234567.89` |

`formatNepaliNumber` options: `useNepaliDigits` (default `true`), `addCommas` (`true`),
`precision` (`2`), `trimZero` (`true` — drops an all-zero decimal part).

```ts
formatNepaliNumber(1234567, { useNepaliDigits: false })   // → "12,34,567"
formatNepaliNumber(1234.567, { precision: 0 })            // → "१,२३५"
formatNepaliNumber(0, { trimZero: false })                // → "०.००"
```

### Words

| Function | Example |
|---|---|
| [`toNepaliWords(n)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/words#tonepaliwordsnumber) | `toNepaliWords(123)` → `"एक सय तेईस"` |
| [`toEnglishWords(n)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/words#toenglishwordsnumber) | `toEnglishWords(12345678)` → `"one crore twenty three lakh forty five thousand six hundred seventy eight"` |
| [`toNepaliOrdinal(n)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/words#tonepaliordinalnumber) | `toNepaliOrdinal(1)` → `"पहिलो"`, `toNepaliOrdinal(5)` → `"पाँचौं"` |
| [`toDecimalWord(n)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/words#todecimalwordnumber) | `toDecimalWord(1200000)` → `"१२ लाख"`, `toDecimalWord(25000000)` → `"२.५० करोड"` |

### Currency

| Function | Example |
|---|---|
| [`toNepaliCurrency(n, options?)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/currency#tonepalicurrencyamount-options) | `toNepaliCurrency(1234567.89)` → `"रू १२,३४,५६७.८९"` |
| [`toNepaliCurrencyWords(n)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/currency#tonepalicurrencywordsamount) | `toNepaliCurrencyWords(1234567.89)` → `"बाह्र लाख चौंतीस हजार पाँच सय सतसट्ठी रुपैयाँ उनान्नब्बे पैसा"` |

`toNepaliCurrency` options: `useNepaliDigits` (`true`), `showPaisa` (`true`),
`currencySymbol` (`"रू"`), `precision` (`2`).

```ts
toNepaliCurrency(1234567.89, { showPaisa: false })                          // → "रू १२,३४,५६८"
toNepaliCurrency(1234, { useNepaliDigits: false, currencySymbol: "Rs." })   // → "Rs. 1,234.00"
```

### Utilities

| Function | Example |
|---|---|
| [`normalize(str)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/utils#normalizeinput) | `normalize("  १२३  ४५६  ")` → `"१२३४५६"` |
| [`detectNumberSystem(str)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/utils#detectnumbersysteminput) | `"1234"` → `"english"`, `"१२३४"` → `"nepali"`, `"12३४"` → `"mixed"`, `"abcd"` → `NaN` |
| [`validateNepaliNumber(str)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/utils#validatenepalinumberinput) | `"१२३.४५"` → `true`, `"१२३.४५.६"` → `false` |
| [`isNepaliDigit(char)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/utils#isnepalidigitchar) | `"५"` → `true` |
| [`isEnglishDigit(char)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/utils#isenglishdigitchar) | `"5"` → `true` |
| [`isMixedNumber(str)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/utils#ismixednumberinput) | `"12३४"` → `true` |
| [`padZeros(n, length)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/utils#padzerosnumber-length) | `padZeros(42, 5)` → `"०००४२"` |
| [`roundNepali(n, decimals = 2)`](https://docs.nepal-dev.com/nepali-number/use/latest/api/utils#roundnepalinumber-decimals) | `roundNepali(3.14159)` → `"३.१४"` |

## Good to know

A few behaviours surprise people. The full list, with a workaround for each, is in
[**limitations**](https://docs.nepal-dev.com/nepali-number/use/latest/api/limitations).

- **Strip commas before formatting a string** — `formatNepaliNumber("1,234")` → `"१"`; use
  `formatNepaliNumber(removeFormatting("1,234"))` → `"१,२३४"`.
- **Words need integers** — `toNepaliWords(12.5)` → `""`. For money use
  `toNepaliCurrencyWords(12.5)` → `"बाह्र रुपैयाँ पचास पैसा"`.
- **Invalid input reads as zero** — `toNepaliWords("abc")` → `"शून्य"`. Validate first when the
  difference matters.
- **Option types aren't exported yet** — derive them:
  `type FormatOptions = NonNullable<Parameters<typeof formatNepaliNumber>[1]>`
  ([types](https://docs.nepal-dev.com/nepali-number/use/latest/api/types)).

## Documentation

| | |
|---|---|
| [Getting started](https://docs.nepal-dev.com/nepali-number/use/latest/getting-started) | Install and import in Node, Bun, Deno, bundlers, TypeScript, the browser |
| [Recipes](https://docs.nepal-dev.com/nepali-number/use/latest/guides/recipes) | Reading typed input, displaying amounts, cheques in words, React and Vue helpers |
| [API reference](https://docs.nepal-dev.com/nepali-number/use/latest/api) | Every export: signature, options, defaults, outputs |
| [Limitations](https://docs.nepal-dev.com/nepali-number/use/latest/api/limitations) | Edge cases and workarounds |
| [Migrating from v1](https://docs.nepal-dev.com/nepali-number/use/latest/guides/migration-v1-to-v2) | v1 function → v2 function |
| [Versioning](https://docs.nepal-dev.com/nepali-number/maintain/release/versioning) | What counts as a breaking change |
| [All documentation](https://docs.nepal-dev.com/nepali-number/maintain) | The map, including architecture, decisions and security |

## Contributing

Issues and pull requests are welcome. Read [**`AGENTS.md`**](AGENTS.md) first — it is the
working agreement for everyone, human or AI.

In short: **every feature and functional change starts with an ADR** in
[decision records](https://docs.nepal-dev.com/nepali-number/maintain/adr) that the owner approves before code is written. Any change a
consumer can observe — including a changed word or spelling — ships its
[API reference](https://docs.nepal-dev.com/nepali-number/use/latest/api) update and a semver decision with it. Tests are part of
every change. Unclear Nepali-language or rounding questions are asked, not guessed.

```bash
git clone https://github.com/puncoz-official/nepali-number-js.git
cd nepali-number-js
bun install

bun run type-check   # tsc --noEmit, strict
bun run test         # bun test, with coverage
bun run build        # tsdown → dist/ (ESM, CJS, UMD, IIFE, .d.ts)
bun run dev          # rebuild on change
```

Requires [Bun](https://bun.sh). CI runs the same three checks on Node.js 20, 22 and 24, then
packs and installs the tarball as a smoke test.

```
src/
├── nepali-number.ts   # public entry — re-exports every domain
├── constants.ts       # digits, words, ordinals, scales
├── conversion/        # toNepali, toEnglish, parseNepaliNumber, convert
├── formatting/        # formatNepaliNumber, addNepaliCommas, removeFormatting
├── words/             # toNepaliWords, toEnglishWords, toNepaliOrdinal, toDecimalWord
├── currency/          # toNepaliCurrency, toNepaliCurrencyWords
└── utils/             # normalize, detection, validation, padZeros, roundNepali
```

**Security issues:** please report privately to <info@puncoz.com> rather than in a public
issue ([security](https://docs.nepal-dev.com/nepali-number/maintain/security)).

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
