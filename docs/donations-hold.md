# Donations hold — re-enable checklist

The donation ask was withdrawn from the site on **1 August 2026** because the organisation had no
bank account able to receive money, and the site was publishing placeholder bank details.

This document is the inverse of that change. Work top to bottom to switch donations back on.

Charted on [Hold the donation ask until the bank account is confirmed](https://github.com/jose-digiweb/ong-dimipabos/issues/1).

---

## While the hold is live — the one thing to watch

`/como-ajudar/doar` and `/en/como-ajudar/doar` were kept at **HTTP 200** rather than redirected or
removed, because no source documents how long a de-indexed URL takes to come back, and this URL has
to come back. Keeping it live means there is no de-indexing event to recover from.

The cost of that choice is a **`Soft 404`** risk: Google may decide the page is an error page served
with a 200. Mitigation is already in place — the page was rebuilt to be genuinely about supporting
the organisation, which is Google's own documented remedy ("adding more information on the page").

**What to check.** Search Console → Page Indexing, for both donate URLs. Look specifically for a
`Soft 404` verdict.

- The outcome is **binary**, not a ranking gradient: the page is either dropped or ranks normally.
  There is no slow bleed to catch early, so infrequent checks are enough.
- There is **no documented safe duration** for a soft-404 exposure, so there is no deadline at which
  it becomes safe to stop looking. Check occasionally for as long as the hold lasts.
- Detection is reported to be per-device, with Search Console surfacing the mobile verdict, so a
  desktop-side classification may never appear in the report.
- **If it does tip:** the fallback is a `307` from the donate URL to a support page. That option is no
  worse then than it would have been at any earlier point, which is why it was not taken up front.

PostHog `$pageview` already covers this route (`components/analytics/PostHogProvider.tsx`), so the
traffic effect is measurable there without waiting on Search Console.

> A pre-change Search Console baseline was never captured — the hold shipped first, so that window
> has closed. It is not needed: the check above is a verdict lookup, not a comparison against
> previous numbers.

---

## Do not re-enable until both of these are true

Both conditions, not either.

1. **A confirmed IBAN, BIC and bank name** for an account held in the name of ONG DI MI PA BÔS.
2. **A confirmed working inbox that receives proof of transfer.** Either `donativos@ongdimipabos.org`
   routing correctly, or a substitute address. If the _site itself_ is to send mail there, add it to
   `send_email.allowed_destination_addresses` in `wrangler.jsonc`.

Condition 2 is a trigger, not an afterthought: the restored page asks people to send a receipt
somewhere, and that instruction is only honest if someone receives it.

> **Never re-add placeholder values.** The reason this hold exists is that
> `PT50 0000 0000 0000 0000 0000 0`, `XXXXPTPL` and "Banco a definir" shipped to production with
> copy-to-clipboard buttons attached. The restored component takes **real values only**. If the real
> values are not to hand, the component does not go back.

---

## 1. Restore the bank-transfer component

Removed in commit **`03628b15da53b1409b1398b0b73c8923f6304e0a`**, deliberately isolated so this diff
contains nothing else.

```bash
git show 03628b15da53b1409b1398b0b73c8923f6304e0a:components/bank-transfer-section.tsx > components/bank-transfer-section.tsx
```

Then re-import it in `app/[locale]/como-ajudar/doar/page.tsx`:

```tsx
import { BankTransferSection } from '@/components/bank-transfer-section'
```

```tsx
<section className='py-16'>
  <BankTransferSection />
</section>
```

## 2. Restore the `bankTransfer` i18n namespace

20 keys per locale, in `messages/pt.json` and `messages/en.json`. Recover both from the same commit:

```bash
git show 03628b15da53b1409b1398b0b73c8923f6304e0a:messages/pt.json
git show 03628b15da53b1409b1398b0b73c8923f6304e0a:messages/en.json
```

Two keys carry the placeholders and **must** be replaced with real values, not restored verbatim:
`rowBankValue` (was "Banco a definir") and the IBAN/BIC values inside the component. Also re-check
`instructionsBody`, which names `donativos@ongdimipabos.org` — it must match the inbox confirmed in
the trigger above.

## 3. Revert the copy

Original values below. `metaTitle`, `breadcrumbDonate` and `cardBody` were never changed, so they
need nothing.

| Key                          | Currently                        | Restore to (pt)                                                                                                                                   | Restore to (en)                                                                                                                                    |
| ---------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cta.defaultButton`          | Como Apoiar / How to Help        | `Doe Agora`                                                                                                                                       | `Donate Now`                                                                                                                                       |
| `cta.description`            | support-framed                   | `Sua contribuição é fundamental para concluirmos a construção do centro e começarmos a transformar vidas. Cada tijolo conta, cada ajuda importa.` | `Your contribution is essential to finishing the centre and starting to transform lives. Every brick counts, every bit of help matters.`           |
| `nav.donate.label`           | Apoiar / Support                 | `Doe`                                                                                                                                             | `Donate`                                                                                                                                           |
| `nav.donate.description`     | forms-of-support wording         | `Contribua financeiramente com a construção do centro.`                                                                                           | `Support the construction of the centre financially.`                                                                                              |
| `footer.linkDonate`          | Apoiar / Support                 | `Doe`                                                                                                                                             | `Donate`                                                                                                                                           |
| `donatePage.metaDescription` | volunteering + partnerships only | `Apoie a construção do Centro de Tratamento e Reabilitação da DI MI PA BÔS através de uma doação por transferência bancária.`                     | `Support the construction of the DI MI PA BÔS Treatment and Rehabilitation Centre with a bank transfer donation.`                                  |
| `donatePage.heroTop`         | Como Ajudar / Apoiar             | `Como Ajudar / Doe`                                                                                                                               | `How to Help / Donate`                                                                                                                             |
| `donatePage.heroTitle`       | O Seu Apoio Constrói Esperança   | `Sua Doação Constrói Esperança`                                                                                                                   | `Your Donation Builds Hope`                                                                                                                        |
| `donatePage.heroSubtitle`    | Cada Ajuda Importa               | `Cada Euro Importa`                                                                                                                               | `Every Euro Counts`                                                                                                                                |
| `donatePage.heroDescription` | "O seu apoio…"                   | `Sua contribuição é fundamental para concluirmos a construção do centro e começarmos a transformar vidas. Cada tijolo conta, cada ajuda importa.` | `Your contribution is essential for us to finish building the centre and start transforming lives. Every brick counts, every bit of help matters.` |
| `donatePage.cardTitle`       | Por que Apoiar / Why Support Us  | `Por que Doar`                                                                                                                                    | `Why Donate`                                                                                                                                       |

## 4. Restore the sitemap priority

`app/sitemap.ts` — `/como-ajudar/doar` priority `0.7` → `0.9`. `changeFrequency` stays `monthly`.
The entry was never removed from the sitemap and the URL never stopped serving 200, so there is no
de-indexing to recover from.

## 5. Reverse the Terms edit

Three edits in `messages/pt.json` and `messages/en.json`, both locales in lockstep. `app/[locale]/termos/page.tsx`
renders `t.raw('sections')` generically, so no component change is needed.

1. **Delete** the leading paragraph added to `terms.sections[2]` (§3 Doações) — the one beginning
   _"As doações através deste website não se encontram, no presente, disponíveis"_ /
   _"Donations through this website are not currently available"_. `§3` goes back to 2 paragraphs.
2. **Restore** `terms.sections[1].paragraphs[0]` (§2 Objeto) to its original wording, which ends
   _"…propor parcerias e contribuir através de doações."_ / _"…propose partnerships and contribute
   through donations."_ — dropping the forward reference to clause 3.
3. **Bump** `terms.lastUpdatedValue` again, in both locales, each in its own format
   (`1 de Agosto de 2026` / `1 August 2026` today). This is not cosmetic: §3's scoping paragraph
   names this date as the effective date, so a stale value makes the clause self-contradicting.

`terms.sections[3..5]` (§§4–6) were never edited and need nothing. Section ids must stay unchanged.
**The privacy policy was never touched** — every donation reference in it was already conditional —
so `privacyPolicy.lastUpdatedValue` stays as it is.

> **You are accepting an obligation when you do this.** Terms §4 binds the organisation to
> _"analisar e responder a cada pedido em tempo útil"_ — to review and respond to every refund
> request in good time — for requests sent to `donativos@ongdimipabos.org`, within a 14-day window.
> That clause is dormant only because no payments exist. The day donations switch on it becomes a
> real commitment, against an inbox that currently carries no reply commitment at all. Decide who
> answers it **before** flipping the switch.
>
> Also unresolved: whether that 14-day window binds EU-resident donors. The terms elect
> Guinea-Bissau law and Bissau courts while addressing Portuguese tax treatment. This was flagged
> during the hold and never assessed by a lawyer. It predates the hold and is not blocking, but it
> should not evaporate.

## 6. Decide what happens to the support page

The hold did not just remove things — `components/support-options-section.tsx` and the
`supportOptions` namespace were **added**, so the donate route stayed a substantive page rather than
becoming a thin "unavailable" notice. That was deliberate soft-404 mitigation.

On re-enable:

- `supportOptions.statusTitle` becomes **false** and must be removed. It is the single-line
  "Donativos bancários em breve" / "Bank donations opening soon" note, rendered from the status box
  at the top of `components/support-options-section.tsx` — delete both the key and that box.
- `donatePage.metaDescription` is search-result copy rather than on-page copy, so it is easy to miss.
  It now says the centre is supported "através de voluntariado e parcerias" / "through volunteering
  and partnerships", which stops being the whole truth once bank donations reopen. Restore it along
  with the rest of section 3.
- The three option cards do not become false. Volunteering, partnerships and contact all still work,
  and keeping them alongside the bank details is probably better than deleting them. This is a
  judgement call, not a reversal — decide it deliberately.

---

## Verify before pushing

```bash
bun run typecheck && bun run lint && bun run format:check && bun run build
```

Then:

1. `grep -rn "PT50 0000\|XXXXPTPL\|Banco a definir" app components messages lib scripts` → must be
   empty. If it matches, you have restored a placeholder. Stop.
2. `/como-ajudar/doar` and `/en/como-ajudar/doar` both serve **200** with the real bank details.
3. Sitemap: both donate URLs present at `0.9`, `alternates.languages` intact (pt + en + x-default).
4. `terms.lastUpdatedValue` bumped in both locales and in each locale's own date format;
   `privacyPolicy.lastUpdatedValue` unchanged; `terms.sections` still 10 entries with unchanged ids
   in both locales.

Pushing to `main` auto-deploys to Cloudflare production. The donate page is statically prerendered
and cached by OpenNext ISR, so **stale edge entries may briefly serve the previous version** after
deploy — re-check the live URL until it is clear.
