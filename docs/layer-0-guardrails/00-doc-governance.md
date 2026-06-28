# Document Governance & Lifecycle

*Lifecycle rules, status transitions, review cadence, and the authoritative status dashboard for all AICatchy docs.*

*Revision basis: BLUEPRINT.md §4 (Governance & Status Conventions)*
*Owner: Scribe | Status: active*

---

## 1. Status Definitions & Transition Rules

### 1.1 Status Values

Every document carries exactly one status in its front-matter:

```
status: draft | active | review | deprecated | archived | deferred
```

| Status | Meaning | Can be read? | Can be cited? |
|--------|---------|--------------|---------------|
| `draft` | Under construction, not yet approved | By permission only | No |
| `active` | Current, approved, authoritative | Yes | Yes |
| `review` | Under active review; may become outdated | Yes | Yes, but check date |
| `deprecated` | Replaced by a newer doc | Yes (for reference) | No — cite the superseding doc |
| `archived` | No longer relevant, kept for history | Yes (for reference) | No |
| `deferred` | Complete but NOT the active baseline; reference for future evaluation | Yes | No — cite the active baseline doc |

### 1.2 Status Transition Rules

```
           owner initiates          review concludes
  draft ──────────────► active ──────────────► review ──────────► active (updated)
                          ▲                        │
                          │                        ├──► deprecated ──► archived
                          │                        │
                          └──── review decides ────┘    (superseded_by: ID)
                             nothing changed
```

- **draft → active**: Owner signals ready, required reviewers sign off, owner merges/publishes.
- **active → review**: Triggered by (a) scheduled review date, (b) revisit trigger event, or (c) owner or any reviewer requests a review. Review period is max 7 calendar days unless extended.
- **review → active**: Changes approved. Version bumps (minor for edits, major for structural changes).
- **review → deprecated**: A newer doc supersedes this one. The deprecated doc field `superseded_by` points to the new doc's ID.
- **deprecated → archived**: Superseding doc is stable for ≥1 review cycle. Archived docs are read-only.
- **deferred → active**: Post-MLP scale triggers are met (see BLUEPRINT §2.5). Owner initiates activation with Pathfinder sign-off.
- **deferred → deprecated**: The deferred architecture direction is abandoned. Owner marks deprecated with rationale.

### 1.3 Versioning Convention

- **Draft docs** use `0.x` versions (0.1, 0.2, ...). No semantic meaning — just iteration tracking.
- **Active docs** use `1.x` for minor changes, `2.x+` for structural rewrites.
- **Deferred docs** use `1.x` — they are complete deliverables even though not the active baseline.
- **Deprecated docs** retain their last active version.
- **Archived docs** freeze their version permanently.

---

## 2. Review Cadence

| Layer | Cadence | Revisit triggers (immediate review) |
|-------|---------|--------------------------------------|
| L0 Guardrails | Quarterly | Regulatory change, funding event, compliance incident |
| L1 Core Narrative | Monthly (pre-PMF), Quarterly (post-PMF) | Fundraising round, pivot, competitor move, thesis disproven |
| L2 Concierge/UX | Per sprint cycle (every ~25 loops) or at milestone gates | Validation threshold crossed/not crossed, major UX change |
| L3 Specs/Bridge | Per engineering sprint cycle | Architecture change, dependency deprecation, new platform integration |

### Review Procedure

1. **Review starts when** the trigger event fires or the scheduled date arrives.
2. **Owner has 7 calendar days** from trigger to complete the review unless extended by Pathfinder.
3. **Review outcome** is one of:
   - **No changes needed**: Status stays `active`, `last_reviewed` updated.
   - **Minor changes**: Owner edits, bumps minor version, status stays `active`.
   - **Major changes**: Owner edits, status → `review`, then → `active` after sign-off.
   - **Superseded**: Doc → `deprecated` with `superseded_by: NEW-ID`.
4. **Missed review**: After 7 days without action, the doc automatically enters `review` status. Owner has 7 more days. A second miss triggers ownership reassignment at Pathfinder's discretion.

---

## 3. Required Front-Matter Schema

Every doc MUST begin with the following YAML front-matter. Fields are listed in order.

```yaml
---
id: <LAYER-SEQ>          # e.g., L1-01
title: <Human-Readable Name>
status: draft | active | review | deprecated | archived | deferred
owner: <Role>
reviewers: [<Role>, ...]
version: <semver>
created: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
next_review: YYYY-MM-DD or "trigger: <event>"
supersedes: <ID>          # optional
superseded_by: <ID>       # optional
tags: [layer-<N>, aicatchy, ...]
references: [<ID>, ...]   # optional
---
```

### Field Rules

- `id` MUST match the doc's file prefix (e.g., `L3-01` for `03-*.md` — the file prefix is the last two digits). Rationale: file names sort numerically and the prefix is the human-recognizable sequence number within its layer.
- `owner` MUST be a single role. In early-stage teams, the role IS the individual; when the organization grows, replace the role with the individual's name.
- `references` MUST list every doc ID this doc depends on or cross-references substantively. This creates the cross-reference graph used for automatic review notifications.
- `status` MUST be one of the six values in §1.1. No custom statuses.

---

## 4. Cross-Reference Rules

1. **If doc A references doc B, A MUST list B's ID** in its `references:` front-matter field.
2. **When a decision in a Layer 1 doc changes**, all Layer 2 and Layer 3 docs that reference it MUST be flagged for review within one sprint.
3. **Cross-layer references** (e.g., L3 doc referencing L0 doc) are valid and encouraged for traceability.
4. **Self-references** (a doc referencing its own ID) are NOT allowed.
5. **Orphan detection**: Any doc not referenced by at least one other doc (or the BLUEPRINT) is flagged for review. The BLUEPRINT itself is the root reference.

---

## 5. Status Dashboard

| ID    | Title                         | Status   | Next Review                   | Owner      |
|-------|-------------------------------|----------|-------------------------------|------------|
| L0-00 | Doc Governance                | active   | 2026-09-24                    | Scribe     |
| L0-01 | PDP Compliance                | active   | 2026-09-24                    | Steward    |
| L0-02 | Affiliate Disclosure          | active   | 2026-09-24                    | Steward    |
| L0-03 | IP Ownership                  | active   | 2026-09-24                    | Steward    |
| L0-04 | Burn & Runway Tracker         | active   | 2026-09-24                    | Steward    |
| L0-05 | Privacy Policy                | active   | trigger: legal review before launch          | Steward    |
| L0-06 | Terms of Use                  | active   | trigger: MLP public launch OR regulatory change | Steward    |
| L0-07 | Launch Compliance Checklist | active   | trigger: MLP build initiation OR regulatory change | Steward    |
| L1-01 | Strategy Memo                 | active   | 2026-07-24 (monthly)          | Pathfinder |
| L1-02 | Executive Summary             | active   | 2026-07-24 (monthly)          | Pathfinder |
| L1-03 | Founder Pack                  | active   | 2026-07-24 (monthly)          | Pathfinder |
| L1-04 | Grilling Q&A                  | active   | 2026-07-24 (monthly)          | Pathfinder |
| L1-05 | GTM Pipeline                  | active   | 2026-07-24 (monthly)          | Hunter     |
| L2-01 | Concierge Playbook            | active   | trigger: sprint completion    | Pathfinder |
| L2-02 | Editorial Style Sheet         | active   | trigger: sprint completion    | Craftsman  |
| L2-03 | UX Identity                   | active   | trigger: sprint completion    | Craftsman  |
| L2-04 | Validation Framework          | active   | trigger: sprint completion    | Pathfinder |
| L3-01 | V1 Product Specification      | active   | trigger: next eng sprint    | Architect  |
| L3-02 | Outfit Formula Library        | active   | trigger: next eng sprint    | Architect  |
| L3-03 | Affiliate API Integration     | active   | trigger: next eng sprint    | Architect  |
| L3-04 | Post-MLP Roadmap              | active   | trigger: next eng sprint    | Architect  |
| L3-05 | Tech Stack Architecture Decision Record | active   | trigger: next eng sprint      | Architect  |
| L3-06 | LLM Integration Specification | active   | trigger: next eng sprint    | Architect  |
| L3-07 | Internal API Contract         | active   | trigger: next eng sprint    | Architect  |
| L3-08 | Analytics Event Schema        | active   | trigger: next eng sprint    | Architect  |
| L3-09 | Environment Configuration Specification | active   | trigger: next eng sprint    | Architect  |
| L3-10 | Outfit Generation Prompt Pack           | active   | trigger: next eng sprint      | Craftsman  |
| L3-11 | Technical Architecture — Deferred Reference | deferred | trigger: post-MLP scale  | Architect  |

---

## 6. Escalation Path

### When Docs Conflict
1. Both owners attempt resolution directly (within 48h).
2. If deadlocked, Pathfinder decides within 48h.
3. The decision and its rationale are recorded in the decision log.

### When an Owner Is Unreachable
1. After 24h with no response, the reviewer(s) may act in the owner's stead.
2. After 48h, escalate to Pathfinder, who may reassign ownership.

### When a Review Is Missed
1. If the `next_review` date passes without action, the doc's status automatically enters `review`.
2. The owner has 7 additional calendar days to complete the review.
3. If still missed, the doc is marked `review` (overdue) and the owner's reviewer is notified.
4. A second missed review triggers reassignment of ownership at Pathfinder's discretion.

### Status Decision Flow (Quick Reference)

```
New doc → write in draft → reviewers sign off → advance to active
Active → review trigger fires → owner initiates review within 7 days
Review → changes needed? → Yes: update, bump version, return to active
                           → No: doc replaced? → mark deprecated, point superseded_by
                                                → still current? → reaffirm active, log date
Deprecated → superseding doc stable ≥1 cycle → archive
Deferred → scale triggers met → activate (→ active) or abandon (→ deprecated)
```

---

## 7. Template for New Doc Creation (Optional)

```markdown
---
id: <LAYER-SEQ>
title: <Human-Readable Name>
status: draft
owner: <Role>
reviewers: [<Role>, ...]
version: 0.1
created: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
next_review: trigger: <event or YYYY-MM-DD>
tags: [layer-<N>, aicatchy]
---

# Title

*One-line subtitle or purpose.*

---

## 1. Section

Content.

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| YYYY-MM-DD | 0.1 | Initial draft | [name] |
```
---

## Changelog

| Date       | Version | Change                              | Author |
|------------|---------|-------------------------------------|--------|
| 2026-06-28 | 1.7     | Registered L3-11 as deferred reference architecture; added `deferred` status to governance | Scribe |
| 2026-06-25 | 1.6     | Activated L3-01 to L3-10 for MLP build, updated L3 dashboard | Architect |

| 2026-06-25 | 1.5     | Added L0-07 to status dashboard                    | Craftsman Compliance Checklist |
| 2026-06-25 | 1.4     | Added L3-09 to status dashboard                    | Craftsman |
| 2026-06-25 | 1.3     | Added L0-05, L0-06 to status dashboard             | Scribe |
| 2026-06-25 | 1.2     | Added L3-06, L3-07, L3-08 to status dashboard | Scribe |
| 2026-06-25 | 1.1     | Added L3-05 to status dashboard     | Scribe |
| 2026-06-24 | 1.0     | Initial active version              | Scribe |
