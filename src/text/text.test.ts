import { describe, expect, test } from "bun:test"
import { compareNumbers, extractNumbers, findNumbers, replaceNumbers, sortNumbers, spellOutNumbers } from "."

const NEPALI_SENTENCE = "मसँग ३ वटा किताब र 1,200 रुपैयाँ छ"

describe("Text Functions", () => {
  describe("findNumbers", () => {
    test("finds numbers of either script with their offsets", () => {
      expect(findNumbers(NEPALI_SENTENCE)).toEqual([
        { match: "३", value: 3, index: 5, system: "nepali" },
        { match: "1,200", value: 1200, index: 19, system: "english" },
      ])
    })

    test("treats a hyphen as a separator, never as a sign", () => {
      expect(findNumbers("Call 9841-123456 at 5pm")).toEqual([
        { match: "9841", value: 9841, index: 5, system: "english" },
        { match: "123456", value: 123456, index: 10, system: "english" },
        { match: "5", value: 5, index: 20, system: "english" },
      ])
    })

    test("reads mixed-script and decimal numbers as one match", () => {
      expect(findNumbers("दर 12३.५ छ")).toEqual([{ match: "12३.५", value: 123.5, index: 3, system: "mixed" }])
    })

    test("returns an empty list when there is nothing to find", () => {
      expect(findNumbers("no numbers here")).toEqual([])
      expect(findNumbers("")).toEqual([])
      expect(findNumbers(null as unknown as string)).toEqual([])
      expect(findNumbers(undefined as unknown as string)).toEqual([])
    })

    test("takes a comma or a dot only between two digits", () => {
      expect(findNumbers("5.").map((m) => m.match)).toEqual(["5"])
      expect(findNumbers(",5").map((m) => m.match)).toEqual(["5"])
      expect(findNumbers(".5").map((m) => m.match)).toEqual(["5"])
      expect(findNumbers("5,").map((m) => m.match)).toEqual(["5"])
      expect(findNumbers("1,2,3")).toEqual([{ match: "1,2,3", value: 123, index: 0, system: "english" }])
      expect(findNumbers("1.2.3").map((m) => [m.match, m.value, m.index])).toEqual([["1.2", 1.2, 0], ["3", 3, 4]])
      expect(findNumbers("1.2,3").map((m) => m.match)).toEqual(["1.2", "3"])
      expect(findNumbers("1,,2").map((m) => m.match)).toEqual(["1", "2"])
      expect(findNumbers("1..2").map((m) => m.match)).toEqual(["1", "2"])
      expect(findNumbers("1,200.50").map((m) => m.value)).toEqual([1200.5])
    })

    test("keeps the digits as written above 2^53", () => {
      const [match] = findNumbers("id 9007199254740993")
      expect(match?.match).toBe("9007199254740993")
      expect(match?.value).toBe(9007199254740992)
    })
  })

  describe("extractNumbers", () => {
    test("lists the values", () => {
      expect(extractNumbers(NEPALI_SENTENCE)).toEqual([3, 1200])
      expect(extractNumbers("Call 9841-123456 at 5pm")).toEqual([9841, 123456, 5])
      expect(extractNumbers("तापक्रम -5 डिग्री")).toEqual([5])
      expect(extractNumbers("abc")).toEqual([])
      expect(extractNumbers("")).toEqual([])
      expect(extractNumbers(null as unknown as string)).toEqual([])
    })
  })

  describe("replaceNumbers", () => {
    test("replaces each number and leaves the rest untouched", () => {
      expect(replaceNumbers("Total 1234567 people", (m) => `<${m.value}>`)).toBe("Total <1234567> people")
      expect(replaceNumbers("३ वटा", (m) => `[${m.value}]`)).toBe("[3] वटा")
      expect(replaceNumbers("a1b22c333", (m) => String(m.match.length))).toBe("a1b2c3")
      expect(replaceNumbers("no numbers", () => "x")).toBe("no numbers")
      expect(replaceNumbers("", () => "x")).toBe("")
    })

    test("returns an empty string for a non-string and lets a replacer error through", () => {
      expect(replaceNumbers(null as unknown as string, () => "x")).toBe("")
      expect(() => replaceNumbers("5", () => {
        throw new Error("boom")
      })).toThrow("boom")
    })
  })

  describe("spellOutNumbers", () => {
    test("writes numbers as Nepali words by default", () => {
      expect(spellOutNumbers(NEPALI_SENTENCE)).toBe("मसँग तीन वटा किताब र एक हजार दुई सय रुपैयाँ छ")
      expect(spellOutNumbers("२.५ किलो")).toBe("दुई दशमलव पाँच किलो")
      expect(spellOutNumbers("2082")).toBe("दुई हजार बयासी")
      expect(spellOutNumbers("no numbers")).toBe("no numbers")
    })

    test("writes English words on request", () => {
      expect(spellOutNumbers("I have 21 books", { words: "english" })).toBe("I have twenty one books")
    })

    test("handles empty and non-string input", () => {
      expect(spellOutNumbers("")).toBe("")
      expect(spellOutNumbers(null as unknown as string)).toBe("")
    })
  })

  describe("compareNumbers", () => {
    test("compares across scripts and forms", () => {
      expect(compareNumbers("१२३", 123)).toBe(0)
      expect(compareNumbers("१,२३४", 999)).toBe(1)
      expect(compareNumbers(-5, "३")).toBe(-1)
      expect(compareNumbers("१.५", "1.50")).toBe(0)
      expect(compareNumbers(-2, -3)).toBe(1)
      expect(compareNumbers("0.1", "0.09")).toBe(1)
      expect(compareNumbers("-0", 0)).toBe(0)
    })

    test("is exact above 2^53", () => {
      expect(compareNumbers(9007199254740993n, "9007199254740992")).toBe(1)
      expect(compareNumbers("9007199254740992", 9007199254740993n)).toBe(-1)
    })

    test("returns NaN when either value is not a number", () => {
      expect(compareNumbers("abc", 1)).toBeNaN()
      expect(compareNumbers(1, "")).toBeNaN()
      expect(compareNumbers(NaN, 1)).toBeNaN()
      expect(compareNumbers(null as unknown as string, 1)).toBeNaN()
    })
  })

  describe("sortNumbers", () => {
    test("sorts by value and keeps the elements as given", () => {
      expect(sortNumbers(["१०", 9, "1,000", "२.५"])).toEqual(["२.५", 9, "१०", "1,000"])
      expect(sortNumbers(["१०", 9, "1,000", "२.५"], "desc")).toEqual(["1,000", "१०", 9, "२.५"])
      expect(sortNumbers([3n, -1, "२"])).toEqual([-1, "२", 3n])
      expect(sortNumbers([])).toEqual([])
    })

    test("puts values that are not numbers last, in their original order", () => {
      expect(sortNumbers(["५", "abc", 1])).toEqual([1, "५", "abc"])
      expect(sortNumbers(["x", 2, "y", 1], "desc")).toEqual([2, 1, "x", "y"])
    })

    test("is stable in both directions and does not change its argument", () => {
      const values = ["1.0", "१", 1, "0"]
      expect(sortNumbers(values)).toEqual(["0", "1.0", "१", 1])
      expect(sortNumbers(values, "desc")).toEqual(["1.0", "१", 1, "0"])
      expect(values).toEqual(["1.0", "१", 1, "0"])
      expect(sortNumbers(values)).not.toBe(values)
    })

    test("returns an empty list for a non-array", () => {
      expect(sortNumbers(null as unknown as string[])).toEqual([])
    })
  })

  describe("hostile input", () => {
    test("scans 100 000 characters in linear time", () => {
      const digitsAndCommas = "1,".repeat(50000)
      const digitsAndDots = "1.".repeat(50000)
      const started = performance.now()

      expect(findNumbers(digitsAndCommas).length).toBe(1)
      expect(findNumbers(digitsAndDots).length).toBe(25000)
      expect(extractNumbers(",".repeat(100000))).toEqual([])
      expect(replaceNumbers(digitsAndDots, () => "").length).toBe(25000)
      expect(spellOutNumbers("9 ".repeat(50000)).length).toBeGreaterThan(100000)
      expect(performance.now() - started).toBeLessThan(2000)
    })
  })
})
