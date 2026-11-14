import { describe, expect, test } from "bun:test"
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

// The split between AGENTS.md and the package's own skills is decided in ADR-0011.
const SKILLS_DIR = "docs/agent-skills"
const LINK_DIRS = [".claude/skills", ".agents/skills"]
const SECTION_COUNT = 12
const MAX_SKILL_LINES = 500

const repositoryRoot = resolve(import.meta.dir, "..")

const routerSkills = (agents: string): string[] => {
  const start = agents.indexOf("\n## 11. ")
  const end = agents.indexOf("\n## 12. ")
  const rows = agents
    .slice(start, end)
    .split("\n")
    .filter((line) => line.startsWith("|"))
  const names = rows.flatMap((row) => row.match(/`nepali-number-[a-z-]+`/g) ?? [])

  return [...new Set(names.map((name) => name.slice(1, -1)))]
}

const frontmatterField = (skill: string, field: string): string => {
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(skill)?.[1] ?? ""
  const value = new RegExp(`^${field}:[ \\t]*(.*)$`, "m").exec(frontmatter)?.[1] ?? ""

  return value.replace(/^"|"$/g, "").trim()
}

const checkAgentDocs = (root: string): string[] => {
  const problems: string[] = []
  const agents = readFileSync(join(root, "AGENTS.md"), "utf8")

  for (let section = 1; section <= SECTION_COUNT; section++) {
    if (!agents.includes(`\n## ${section}. `)) {
      problems.push(`AGENTS.md has no section ${section}`)
    }
  }

  const routed = routerSkills(agents)
  const skillsPath = join(root, SKILLS_DIR)
  const folders = existsSync(skillsPath)
    ? readdirSync(skillsPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : []

  for (const name of routed) {
    if (!existsSync(join(skillsPath, name, "SKILL.md"))) {
      problems.push(`${name} is named in AGENTS.md §11 but has no SKILL.md`)
    }
  }

  for (const folder of folders) {
    const skillFile = join(skillsPath, folder, "SKILL.md")

    if (!routed.includes(folder)) {
      problems.push(`${folder} is not named in AGENTS.md §11`)
    }

    if (!existsSync(skillFile)) {
      problems.push(`${folder} has no SKILL.md`)
      continue
    }

    const skill = readFileSync(skillFile, "utf8")

    if (frontmatterField(skill, "name") !== folder) {
      problems.push(`${folder}: frontmatter name does not match the folder`)
    }

    if (frontmatterField(skill, "description") === "") {
      problems.push(`${folder}: description is empty`)
    }

    if (skill.split("\n").length > MAX_SKILL_LINES) {
      problems.push(`${folder}: SKILL.md is over ${MAX_SKILL_LINES} lines`)
    }

    for (const linkDir of LINK_DIRS) {
      const link = join(root, linkDir, folder)
      const isLink = lstatSync(link, { throwIfNoEntry: false })?.isSymbolicLink() ?? false

      if (!isLink || !existsSync(link)) {
        problems.push(`${linkDir}/${folder} is not a working link`)
        continue
      }

      if (realpathSync(link) !== realpathSync(join(skillsPath, folder))) {
        problems.push(`${linkDir}/${folder} points outside ${SKILLS_DIR}/${folder}`)
      }
    }
  }

  return problems
}

const SKILL_NAME = "nepali-number-sample"

const skillText = (name: string, description: string): string =>
  `---\nname: ${name}\ndescription: "${description}"\n---\n\n# ${name}\n`

const makeFixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), "agent-docs-"))
  const sections = Array.from(
    { length: SECTION_COUNT },
    (_, index) => `## ${index + 1}. Section\n`,
  )
  sections[10] += `\n| Before you… | Read |\n|---|---|\n| do it | \`${SKILL_NAME}\` |\n`

  writeFileSync(join(root, "AGENTS.md"), `# Agreement\n\n${sections.join("\n")}`)
  mkdirSync(join(root, SKILLS_DIR, SKILL_NAME), { recursive: true })
  writeFileSync(
    join(root, SKILLS_DIR, SKILL_NAME, "SKILL.md"),
    skillText(SKILL_NAME, "Read before doing it."),
  )

  for (const linkDir of LINK_DIRS) {
    mkdirSync(join(root, linkDir), { recursive: true })
    symlinkSync(join("..", "..", SKILLS_DIR, SKILL_NAME), join(root, linkDir, SKILL_NAME))
  }

  return root
}

const withFixture = (breakIt: (root: string) => void): string[] => {
  const root = makeFixture()

  try {
    breakIt(root)

    return checkAgentDocs(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

describe("AGENTS.md and the package's own skills (ADR-0011)", () => {
  test("the repository passes every check", () => {
    expect(checkAgentDocs(repositoryRoot)).toEqual([])
  })

  test("AGENTS.md routes to at least one skill", () => {
    const agents = readFileSync(join(repositoryRoot, "AGENTS.md"), "utf8")

    expect(routerSkills(agents).length).toBeGreaterThan(0)
  })

  test("a valid fixture passes", () => {
    expect(withFixture(() => {})).toEqual([])
  })

  test("a missing section is reported", () => {
    const problems = withFixture((root) => {
      const file = join(root, "AGENTS.md")
      writeFileSync(file, readFileSync(file, "utf8").replace("## 7. Section\n", ""))
    })

    expect(problems).toEqual(["AGENTS.md has no section 7"])
  })

  test("a routed skill without a file is reported", () => {
    const problems = withFixture((root) => {
      const file = join(root, "AGENTS.md")
      const row = "| do more | `nepali-number-missing` |\n"
      writeFileSync(file, readFileSync(file, "utf8").replace("\n## 12. ", `${row}\n## 12. `))
    })

    expect(problems).toEqual(["nepali-number-missing is named in AGENTS.md §11 but has no SKILL.md"])
  })

  test("a name that does not match its folder is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(
        join(root, SKILLS_DIR, SKILL_NAME, "SKILL.md"),
        skillText("nepali-number-other", "Read before doing it."),
      )
    })

    expect(problems).toEqual([`${SKILL_NAME}: frontmatter name does not match the folder`])
  })

  test("an empty description is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, SKILLS_DIR, SKILL_NAME, "SKILL.md"), skillText(SKILL_NAME, ""))
    })

    expect(problems).toEqual([`${SKILL_NAME}: description is empty`])
  })

  test("a skill over the line limit is reported", () => {
    const problems = withFixture((root) => {
      const file = join(root, SKILLS_DIR, SKILL_NAME, "SKILL.md")
      writeFileSync(file, readFileSync(file, "utf8") + "line\n".repeat(MAX_SKILL_LINES))
    })

    expect(problems).toEqual([`${SKILL_NAME}: SKILL.md is over ${MAX_SKILL_LINES} lines`])
  })

  test("a missing link is reported", () => {
    const problems = withFixture((root) => {
      rmSync(join(root, ".claude/skills", SKILL_NAME))
    })

    expect(problems).toEqual([`.claude/skills/${SKILL_NAME} is not a working link`])
  })

  test("a real folder in place of a link is reported", () => {
    const problems = withFixture((root) => {
      rmSync(join(root, ".agents/skills", SKILL_NAME))
      mkdirSync(join(root, ".agents/skills", SKILL_NAME))
    })

    expect(problems).toEqual([`.agents/skills/${SKILL_NAME} is not a working link`])
  })

  test("a link that points elsewhere is reported", () => {
    const problems = withFixture((root) => {
      mkdirSync(join(root, "elsewhere"))
      rmSync(join(root, ".claude/skills", SKILL_NAME))
      symlinkSync(join("..", "..", "elsewhere"), join(root, ".claude/skills", SKILL_NAME))
    })

    expect(problems).toEqual([
      `.claude/skills/${SKILL_NAME} points outside ${SKILLS_DIR}/${SKILL_NAME}`,
    ])
  })

  test("a skill the table does not name is reported", () => {
    const problems = withFixture((root) => {
      const name = "nepali-number-unrouted"
      mkdirSync(join(root, SKILLS_DIR, name))
      writeFileSync(join(root, SKILLS_DIR, name, "SKILL.md"), skillText(name, "Unrouted."))

      for (const linkDir of LINK_DIRS) {
        symlinkSync(join("..", "..", SKILLS_DIR, name), join(root, linkDir, name))
      }
    })

    expect(problems).toEqual(["nepali-number-unrouted is not named in AGENTS.md §11"])
  })

  test("a folder without a SKILL.md is reported", () => {
    const problems = withFixture((root) => {
      rmSync(join(root, SKILLS_DIR, SKILL_NAME, "SKILL.md"))
    })

    expect(problems).toEqual([
      `${SKILL_NAME} is named in AGENTS.md §11 but has no SKILL.md`,
      `${SKILL_NAME} has no SKILL.md`,
    ])
  })
})
