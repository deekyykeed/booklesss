# Money Buckets

The owner's cash keeps going from "a lot at once" to "almost nothing two days
later". The fix is to give each kwacha a job **the moment it arrives**, then
spend out of the right bucket. Nothing physically moves: it all stays on MoMo,
and the buckets are kept for you on a page.

**The page:** https://claude.ai/artifact/5Y489LeCoovEbVJhU8CEWR (private, only
the owner can open it). Its source is `money-buckets.html` in this folder.
**No transaction data lives in git.** It is all in the page's database.

## The buckets (default split, editable on the page)

| Bucket | % of money in | Locked? | For |
|---|---|---|---|
| Business running (`ops`) | 40 | no | stock, data, transport, suppliers, MoMo fees |
| My pay (`pay`) | 25 | no | food, rent, personal spending |
| Tax (`tax`) | 5 | yes | ZRA turnover tax |
| Emergency (`buffer`) | 10 | yes | a real emergency or a dry week |
| Growth (`growth`) | 10 | no | ads, equipment, new projects (plan before spending) |
| Savings (`profit`) | 10 | yes | never spent, moved to savings at month end |

"Locked" buckets are left out of **safe to spend today**, which is each
spendable bucket's balance divided by the days left in the month, minus what
has already gone out of it today.

## Daily routine

1. Owner sends the day's MoMo history to Claude in chat (CSV, PDF or screenshots).
2. Claude reads it and writes one document per transaction into the page's `tx`
   collection with `ArtifactData` (`batch`, up to 50 at a time).
3. Claude reports in a few lines: what came in, what went out, anything unsorted,
   and any bucket that is overspent.

## How Claude writes a transaction

Collection `tx`, **doc id = the MoMo transaction ID** (e.g. `momo-1234567890`),
so sending the same statement twice changes nothing.

```jsonc
// money in: split now, using the current percentages in settings/buckets
{ "kind": "income", "amount": 1500, "date": "2026-10-12", "time": "14:32",
  "who": "Client name", "source": "Booklesss", "note": "",
  "alloc": { "ops": 600, "pay": 375, "tax": 75, "buffer": 150, "growth": 150, "profit": 150 },
  "origin": "statement", "ref": "1234567890" }

// money out: one bucket; MoMo charges go in "fee", counted in the same bucket
{ "kind": "spend", "amount": 250, "fee": 2.5, "date": "2026-10-12",
  "who": "Shoprite", "bucket": "pay", "origin": "statement", "ref": "1234567891" }

// move between buckets (covering an overspend, say)
{ "kind": "move", "amount": 200, "bucket": "buffer", "to": "pay", "date": "2026-10-12" }
```

Rules:

- **`alloc` is fixed when the money arrives.** Changing the split later must not
  rewrite history. Round each share to the ngwee and give the remainder to the
  last bucket so the shares add up to the amount.
- **Sending money to your own bank account or another of your own wallets is
  not spending.** Leave it out, or ask the owner.
- **Not sure which bucket?** Write `"bucket": "unsorted"`. The page lists it
  and the owner picks one. Guessing wrong is worse than asking.
- `source` on income is which business it came from, so the page can show
  where this month's money came from.
- Money already on MoMo on the first day goes in as one `income` entry,
  `"who": "Opening balance"`, so it is split like everything else.
