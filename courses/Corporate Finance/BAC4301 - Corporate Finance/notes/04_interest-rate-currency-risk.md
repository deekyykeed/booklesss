# Gamma Slide Deck — Module 4: Interest Rate & Currency Risk Management
**Gamma URL:** <!-- ADD AFTER CREATION -->
**Notes:** No images, full bleed cards. Manually created in Chrome.
**Last updated:** 2026-03-09

---

## Slide Content (to be entered manually in Gamma)

---

### Slide 1 — Title
**Title:** Module 4 — Interest Rate & Currency Risk Management
**Subtitle:** BAC4301 Corporate Finance
**Body:** Real firms operate across borders and borrow at variable rates. This module covers how to identify, measure, and hedge two of the most significant financial risks a company faces — currency risk and interest rate risk.

---

### Slide 2 — Types of Currency Risk
**Title:** Three Types of Currency (FX) Exposure
**Body:** A firm with international operations faces exchange rate risk in three forms:

**1. Transaction exposure**
The risk that a specific, already-committed cash flow (e.g. a receivable or payable in foreign currency) will be adversely affected by exchange rate movements before settlement. This is the most directly manageable form.

**2. Translation exposure**
An accounting risk arising when consolidating the financial statements of foreign subsidiaries into the parent's home currency. Assets, liabilities, and profits denominated in foreign currencies must be restated — rate movements create reported gains or losses.

**3. Economic exposure**
The long-run impact of exchange rate changes on the firm's competitive position, future revenues, and costs. Less visible than the other two — affects the present value of all future cash flows.

---

### Slide 3 — Exchange Rate Theory: IRP and PPP
**Title:** Interest Rate Parity & Purchasing Power Parity
**Body:** Two theoretical relationships determine how exchange rates move over time:

**Interest Rate Parity (IRP)**
Forward rates are determined by the interest rate differential between two currencies. A currency offering a higher interest rate will trade at a forward discount.

**Forward Rate = Spot Rate × [(1 + Home Rate) / (1 + Foreign Rate)]^n**

**Purchasing Power Parity (PPP)**
Exchange rates adjust over time to reflect inflation differentials. A currency in a higher-inflation country will depreciate relative to a lower-inflation currency.

**Expected Future Spot = Current Spot × [(1 + Home Inflation) / (1 + Foreign Inflation)]^n**

Both relationships are fundamental to evaluating hedging strategies and to valuing cross-border projects (Module 1 — International NPV).

Note: In both formulas, the "home" country is the country whose currency is the **denominator** in the exchange rate quote. Always identify the quoting convention first.

---

### Slide 4 — Forward Contracts (FX Hedging)
**Title:** Hedging with Forward Contracts
**Body:** A forward contract is an agreement to buy or sell a specified amount of foreign currency at an agreed rate on a specified future date. It **locks in** the exchange rate, eliminating uncertainty.

**For an importer (payables — future FX payment required):**
Buy foreign currency forward — fix the rate at which you will pay.

**For an exporter (receivables — future FX receipt expected):**
Sell foreign currency forward — fix the rate at which you will receive.

**Advantages:**
- Simple and widely available from banks
- Eliminates all currency risk (no upside or downside)
- Customised to exact amount and date

**Disadvantages:**
- Inflexible — must be executed at maturity regardless of spot rate movement
- No benefit if the exchange rate moves favourably
- Counterparty risk (OTC instrument, not exchange-traded)

---

### Slide 5 — Money Market Hedge: Receipts
**Title:** Money Market Hedge — Hedging a Foreign Currency Receipt
**Body:** A money market hedge (MMH) replicates the outcome of a forward contract using the money market (borrowing and lending). It is used when forward contracts are unavailable or to compare with the forward rate.

**Steps — Hedging a foreign currency RECEIPT (exporter):**

1. Borrow the present value of the expected foreign receipt today (in the foreign currency)
   - PV = Foreign receipt / (1 + Foreign borrowing rate × days/365)
2. Convert the borrowed amount to home currency at today's spot rate
3. Invest the home currency proceeds at the home deposit rate
4. At maturity: use the foreign receipt to repay the foreign loan; the home currency investment matures — this is your hedged receipt

**Result:** A certain home currency amount, known today — equivalent to a synthetic forward sale.

---

### Slide 6 — Money Market Hedge: Payments
**Title:** Money Market Hedge — Hedging a Foreign Currency Payment
**Body:** **Steps — Hedging a foreign currency PAYMENT (importer):**

1. Borrow the required amount in home currency today
2. Convert to foreign currency at today's spot rate
3. Invest the foreign currency at the foreign deposit rate
4. At maturity: use the foreign currency investment to make the payment; repay the home currency loan

**The key formula — PV of the foreign currency needed today:**
PV = Foreign payment / (1 + Foreign deposit rate × days/365)

**Comparison rule:**
Choose the money market hedge if it produces a **better** outcome than the forward contract (more home currency received for exports; less home currency paid for imports).

[VISUAL INSTRUCTION: Create a two-column comparison layout in Gamma — left column: "Hedging a Receipt (Exporter)" with 4 numbered steps; right column: "Hedging a Payment (Importer)" with 4 numbered steps. Use arrows to indicate flow of currencies (foreign → spot → home). Label the two columns clearly with different background colours.]

---

### Slide 7 — Currency Futures and Options
**Title:** Currency Futures and Options
**Body:** **Currency Futures**
Exchange-traded contracts to buy or sell a standardised amount of foreign currency at a specified future date and price. Settlement is typically via a cash margin, not physical delivery.

- Traded on exchanges (e.g. CME) — standardised contract sizes
- Daily marked-to-market via margin account
- Used to hedge by taking an **opposite position** to the underlying exposure
- **Basis risk:** the difference between the futures price and spot price does not always move 1:1

**Currency Options**
Give the holder the **right but not the obligation** to buy (call) or sell (put) foreign currency at a fixed exchange rate (the strike price) on or before a specified date.

- **Call option** — right to buy foreign currency (used by importers)
- **Put option** — right to sell foreign currency (used by exporters)
- **Premium** — upfront cost paid by the buyer regardless of whether the option is exercised
- Unlike forwards/futures, options allow the holder to **benefit from favourable rate moves** while being protected from adverse moves

**Decision rule:** Exercise the option only if the market rate is worse than the strike price. If the market rate is more favourable, let the option lapse and transact at spot.

---

### Slide 8 — Interest Rate Risk
**Title:** Interest Rate Risk — Overview
**Body:** Interest rate risk is the risk that changes in market interest rates will adversely affect a firm's borrowing costs or the value of its interest-bearing assets and liabilities.

**Two main exposures:**

**1. Borrowers (variable rate debt)**
If market rates rise, interest payments increase — cash flow risk.

**2. Investors and bondholders**
Rising rates reduce the market value of fixed-rate bonds (inverse price-yield relationship from Module 3).

**Yield curve (term structure of interest rates)**
Plots the yield (interest rate) against maturity for bonds of the same credit quality.

**Three theories explaining the yield curve shape:**
- **Expectations theory** — long rates reflect expected future short rates; an upward-sloping curve implies rates are expected to rise
- **Liquidity preference theory** — investors demand a premium for longer maturities (uncertainty); curve slopes upward even with stable rate expectations
- **Market segmentation theory** — supply and demand in each maturity segment determines yields independently; different investors prefer different maturities

[VISUAL INSTRUCTION: Create three small side-by-side yield curve sketches in Gamma — each showing maturity (x-axis) vs. yield (y-axis). Label them: "Normal (upward)", "Inverted (downward)", "Flat". Add a brief 1-line note under each. Use a clean chart style with a single coloured line each.]

---

### Slide 9 — Forward Rate Agreements (FRAs)
**Title:** Forward Rate Agreements (FRAs)
**Body:** A Forward Rate Agreement (FRA) is an OTC contract that fixes the interest rate on a notional loan or deposit for a specified future period. The FRA does not involve any exchange of principal — only the interest rate differential is settled.

**Notation:** An FRA quoted as "3v9" covers the period from month 3 to month 9 (a 6-month rate, starting in 3 months).

**How it works:**
- If a firm expects to borrow in 3 months and fears rates will rise — buy (go long) an FRA at today's rate
- At settlement, if market rates have risen above the FRA rate, the firm receives a compensation payment
- If market rates have fallen, the firm makes a payment — but benefits from borrowing more cheaply in the market

**Settlement formula:**
Settlement = [Notional × (Market rate − FRA rate) × (Days/365)] / [1 + Market rate × (Days/365)]

The denominator discounts the settlement to the start of the FRA period (since settlement is paid at the start, not the end).

**Interest Rate Guarantee (IRG):** An option on an FRA — gives the right but not the obligation to borrow at the FRA rate. Protects against rate rises while retaining the benefit if rates fall. Costs a premium.

---

### Slide 10 — Interest Rate Swaps
**Title:** Interest Rate Swaps
**Body:** An interest rate swap is an agreement between two parties to exchange interest payment streams on a notional principal amount — typically exchanging fixed-rate payments for floating-rate payments (or vice versa).

**Plain vanilla swap:**
Party A pays a fixed rate → receives floating (SOFR/LIBOR + spread)
Party B pays floating → receives fixed

**Why firms use swaps:**
- A company with floating-rate debt that fears rising rates can **pay fixed / receive floating** to lock in a known cost
- A firm with fixed-rate debt that expects rates to fall can **pay floating / receive fixed**
- Banks may have a comparative advantage in one market — swaps allow both parties to achieve cheaper financing

**Comparative advantage:**
If Firm A has a relative advantage in the fixed-rate market and Firm B in the floating market, both can borrow in their comparative advantage market and swap — resulting in lower net cost for both.

**Key features:**
- No exchange of principal — only net interest difference is paid
- OTC instrument — terms are negotiated, not standardised
- Typically arranged through a bank acting as intermediary
- Credit risk: if counterparty defaults, you still owe your underlying lender

[VISUAL INSTRUCTION: Create a simple flow diagram in Gamma showing a plain vanilla swap. Three boxes: "Company A" (left), "Bank / Swap dealer" (centre), "Company B" (right). Arrows between A and Bank: "Pays fixed" going right, "Receives floating" going left. Arrows between Bank and B: "Pays floating" going right, "Receives fixed" going left. Below each outer box, show the underlying borrowing: A borrows fixed from market; B borrows floating from market.]

---

### Slide 11 — Key Formulas
**Title:** Key Formulas — Module 4
**Body:**

| Concept | Formula |
|---|---|
| Forward exchange rate (IRP) | F = S × [(1 + r_home) / (1 + r_foreign)]^n |
| PPP (expected future spot) | E(S) = S × [(1 + inflation_home) / (1 + inflation_foreign)]^n |
| MMH — PV of foreign currency needed | PV = Foreign amount / (1 + foreign rate × days/365) |
| FRA settlement | = [N × (r_market − r_FRA) × days/365] / [1 + r_market × days/365] |
| Bond duration (interest rate risk) | Duration = Σ(PV of CF × t) / Bond price |
| Effective interest rate (borrower) | = Loan rate +/− FRA/futures gain or loss / Notional |

---

### Slide 12 — Summary
**Title:** What You Should Now Be Able to Do
**Body:** By the end of this module, you should be able to:

1. Distinguish between transaction, translation, and economic currency exposure
2. Calculate forward exchange rates using Interest Rate Parity (IRP)
3. Use expected future spot rates using Purchasing Power Parity (PPP)
4. Hedge a foreign currency receipt or payment using a forward contract
5. Construct a money market hedge for both receipts and payments and compare it to the forward rate
6. Explain how currency futures and options work as hedging instruments, including the role of basis risk and option premiums
7. Describe the three theories of the yield curve and interpret its shape
8. Use a Forward Rate Agreement (FRA) to hedge interest rate risk and calculate the FRA settlement
9. Explain how an interest rate swap works and why firms use them (including comparative advantage)

**Next:** Module 5 — Dividend Policy
