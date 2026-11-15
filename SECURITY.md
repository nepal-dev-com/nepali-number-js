# Security policy

## Report privately

**Never open a public issue, discussion or pull request for a security problem.**

Report it through GitHub's private vulnerability reporting:
**[Report a vulnerability](https://github.com/nepal-dev-com/nepali-number-js/security/advisories/new)**
(the repository's *Security* tab, then *Report a vulnerability*). Only the maintainers see the
report.

If that page is not available to you, email <info@puncoz.com>.

## What to report

- Input that makes a function hang, run for a very long time, or throw.
- A published version of `nepali-number` on npm that does not match this repository, or a sign
  that a release, a dependency or a workflow has been tampered with.
- A secret committed to this repository.

A function that returns a wrong word or number is a bug, not a vulnerability. Open an
[issue](https://github.com/nepal-dev-com/nepali-number-js/issues/new/choose) for it.

## What to include

- What it is, and where: the function, file, version or commit.
- How it could be used. The smallest input that shows it helps most.
- A fix, if you have one.

Do not include a secret itself. Point to where it is.

## What happens next

The maintainer acknowledges the report, confirms it, fixes it, and credits you if you wish. A fix
ships as a new version on npm. Findings stay out of the public documentation until they are fixed.

This project is maintained by volunteers and makes no promise of response times.

## Supported versions

Only the latest version published on [npm](https://www.npmjs.com/package/nepali-number) is
supported. Fixes are not ported to older versions.

## More

The threat model, the secrets inventory and the release audit are in the
[security documentation](https://docs.nepal-dev.com/nepali-number/maintainer-guide/security).
