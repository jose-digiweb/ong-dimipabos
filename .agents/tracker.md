# Issue tracker

**Linear is the tracker for this repo.** New issues, maps and tickets go there, not into GitHub Issues.

GitHub Issues stays **enabled** — see [The GitHub archive](#the-github-archive) for why that is deliberate and must not be changed.

---

## Wayfinding operations

How the [wayfinder](skills/wayfinder/SKILL.md) skill's concepts map onto Linear.

| Wayfinder concept | Linear expression |
| --- | --- |
| The map | A Linear issue labelled `wayfinder:map` |
| Tickets | **Sub-issues** of the map issue |
| Ticket type | A label on each ticket: `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, `wayfinder:task` |
| Claiming a ticket | Assign it to the dev driving the map, before any work |
| Blocking | The native **Blocked by** relation on the blocked ticket |
| Unblocked | The ticket has no remaining **Blocked by** relations (see [Relations decay](#relations-decay)) |
| The frontier | Open, unassigned sub-issues of the map with no **Blocked by** relations |
| Resolving a ticket | Post the resolution as a comment, move the ticket to **Done**, append a one-line pointer to the map's Decisions-so-far |

Blocking must use the native relation rather than a body convention: Linear renders **Blocked by** in the issue sidebar with an orange flag and **Blocks** with a red one, which is the whole point — the frontier is visible in Linear's own UI without opening the map.

---

## Set this up before charting the first map

Three Linear defaults will break wayfinding if left alone. All three are one-time.

### 1. Turn off both parent/sub-issue auto-close automations

Settings → Team → Workflow. Two separate automations exist:

- **"When the parent issue is marked as done, all remaining sub-issues will also be marked as done."**
  **Must be off.** Closing a completed map would silently mark every still-open ticket as done, destroying the record of what was actually resolved versus abandoned.
- **"When all sub-issues are marked as done, the parent issue will also be marked as done."**
  **Should be off.** Closing the map is a deliberate act — the last session writes the completion note and clears the fog. Auto-closing skips that.

### 2. Leave the map issue unassigned

Linear transfers the assignee to a new sub-issue when you are assigned to the parent. If the map is assigned to you, **every ticket created under it is born assigned** — and since the assignee *is* the claim, the whole frontier reads as already claimed and concurrent sessions will skip everything.

The map has no assignee. Ever.

### 3. Set the type label on every ticket explicitly

Sub-issues inherit their parent's **team, priority and project** — but *not* labels. So `wayfinder:<type>` has to be set on each ticket as it is created; it will not arrive from the map. Corollary: create tickets *from* the map so they land in the right team and project automatically.

---

## Relations decay

Linear's docs are explicit: *"Once the blocking issue has been resolved, the relationship moves under Related."*

Two consequences, and they pull in opposite directions:

- **The frontier query gets simpler.** A ticket is unblocked when it has no **Blocked by** relations left — no need to fetch each blocker and check its state, because Linear moves resolved ones out of that bucket on its own. On GitHub the blocked-by list retained closed blockers and every check had to filter them by state.
- **The dependency history is destroyed.** Once resolved, a former blocker is indistinguishable from a merely "Related" issue. You cannot reconstruct the route from the relation graph after the fact.

So on Linear the map's **Decisions so far** is the *only* durable record of the order the route was actually walked. Keep appending to it on every resolution; it is not a convenience index here, it is the archive.

---

## The GitHub archive

GitHub Issues `#1`–`#9` on this repo hold the completed **"Hold the donation ask until the bank account is confirmed"** wayfinder map: the destination, the surface inventory, seven decision resolutions, and the scope boundaries. [`docs/donations-hold.md`](../docs/donations-hold.md) links to it, and the re-enable recipe depends on that context.

That history was **not** migrated to Linear. Its value is in its cross-references — issue-to-issue links and commit SHAs — which an importer renumbers and breaks.

> **Do not disable GitHub Issues on this repo.** Verified on 1 August 2026: with `has_issues=false` the entire archive returns **HTTP 410 Gone** — `gh issue view`, `gh issue list` and the REST API all refuse, and the link from `docs/donations-hold.md` dies with them. Nothing is deleted (re-enabling restored all 9 issues, 8 sub-issue links and every comment intact), but while it is off the record is unreachable.
>
> This repo is **private**, so there are no outside contributors to gate and nothing is gained by turning it off. Drift is prevented by this document, not by a repo setting.

---

## Unverified

Written before the Linear MCP server was authorized, so two things need confirming on first real use:

- **The MCP tool surface** — exact tool names and whether sub-issue creation, relation creation and label assignment are all exposed. If any operation is missing, that part of the workflow needs the Linear API directly.
- **Whether a saved view can express "no Blocked by relation."** Linear's relations documentation does not cover filtering by relation state. If it cannot, the frontier is computed by the agent from each ticket's relations rather than read off a view, which still works but is not visible in the UI at a glance.
