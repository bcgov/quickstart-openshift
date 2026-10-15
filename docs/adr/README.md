# Architecture Decision Records (ADR)

This folder holds the decision records for this repository. Each product team adds its records here.

An ADR captures one significant decision: the context, the choice made, and the consequences. Records are short and never deleted. A changed decision gets a new ADR that supersedes the old one.

## When to write an ADR

Write an ADR when a decision:

- Changes the architecture, platform, or runtime (for example, a new OpenShift resource type or a new backend framework).
- Affects more than one team or component.
- Is hard or costly to reverse.
- Sets a standard others must follow (security controls, data handling, naming).

Do not write an ADR for routine code changes, bug fixes, or small refactors. Use a pull request for those.

## How to create an ADR

1. Pick the next free number. Use four digits, starting at `0001`. Check the existing files in this folder first.
2. Copy [template.md](template.md) to `NNNN-short-title.md`. Use lowercase words joined by hyphens. Example: `0002-use-postgres-for-audit-log.md`.
3. Fill in every section. Set **Status** to `Proposed`.
4. Open a pull request. Ask the owning product team and any affected teams to review.
5. When the team agrees, change **Status** to `Accepted` and merge.

Include the owning product team in the **Product team** field of each record.

Teams work in parallel, so two pull requests can pick the same number. If another pull request merges first with your number, renumber your file and its index row before you merge.

## Status values

| Status | Meaning |
|---|---|
| Proposed | Under review. Not binding yet. |
| Accepted | Agreed and in effect. |
| Rejected | Reviewed and not adopted. Keep the file as a record. |
| Deprecated | No longer applies. Context changed, but no replacement exists. |
| Superseded by ADR MMMM | Replaced by a newer ADR. Link to the new record. |

## Rules

- Do not edit the decision of an `Accepted` ADR. Write a new ADR that supersedes it, then update the old status line to `Superseded by ADR MMMM` with a link.
- Small fixes to typos, links, or formatting are fine at any time.
- Write in plain English. Keep each ADR focused on one decision.
- Link related issues, pull requests, and other ADRs.

## Index

| ADR | Title | Status | Product team |
|---|---|---|---|
| _No records yet_ | | | |

Add a row for each new ADR. Keep the table sorted by number.
