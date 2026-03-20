# Gamma Slide Deck — Module 1: Investment Appraisal
**Gamma URL:** https://gamma.app/generations/9DeBzPdWN7SXPV83glNgV
**Notes:** No images, full bleed cards. Manually created in Chrome.
**Last updated:** 2026-03-09

---

## Slide Content (to be entered manually in Gamma)

---

### Slide 1 — Title
**Title:** Module 1 — Investment Appraisal
**Subtitle:** BAC4301 Corporate Finance
**Body:** How does a firm decide which projects are worth investing in? This module builds the analytical toolkit — from measuring cash flows to evaluating projects across borders.

---

### Slide 2 — What is Investment Appraisal?
**Title:** What is Investment Appraisal?
**Body:** Investment appraisal is the process of evaluating whether a capital project is worth undertaking. It answers the first fundamental question of corporate finance: where should the firm invest?

A good appraisal framework must:
- Capture all economically relevant cash flows
- Account for the time value of money
- Apply a discount rate that reflects project risk
- Produce a clear, comparable decision metric

All methods in this module serve this purpose — some are better than others.

---

### Slide 3 — Free Cash Flow (FCF)
**Title:** Free Cash Flow (FCF)
**Body:** FCF is the cash a project generates that is available to all capital providers — after operating costs, taxes, and investment in working capital and fixed assets. It is not accounting profit.

**FCF = EBIT × (1 − Tax Rate) + Depreciation − Capital Expenditure − Change in Net Working Capital**

Key adjustments:
- Use **incremental** cash flows only — costs and revenues that change because of the project
- **Ignore sunk costs** — already spent, irrelevant to the decision
- **Include opportunity costs** — the value of resources diverted from other uses
- **Exclude financing costs** — interest is captured in the discount rate, not the cash flows

---

### Slide 4 — Net Present Value (NPV)
**Title:** Net Present Value (NPV)
**Body:** NPV is the gold standard investment decision rule. It calculates the value a project adds to the firm by discounting all future free cash flows back to today.

**NPV = Σ [FCFt / (1 + r)^t] − Initial Investment**

Decision rule:
- **NPV > 0** → Accept the project (it creates value)
- **NPV < 0** → Reject the project (it destroys value)
- **NPV = 0** → Indifferent (project earns exactly the required return)

Why NPV is preferred:
- Uses cash flows, not accounting profits
- Accounts for the time value of money
- Directly measures value creation in monetary terms
- Additive — NPVs of different projects can be summed

---

### Slide 5 — Modified Internal Rate of Return (MIRR)
**Title:** Modified Internal Rate of Return (MIRR)
**Body:** The Internal Rate of Return (IRR) is the discount rate that makes NPV equal to zero. It is widely used but has well-known flaws — it assumes interim cash flows are reinvested at the IRR itself, which is often unrealistic.

MIRR corrects this by assuming reinvestment at the cost of capital.

**MIRR = [FV of cash inflows / PV of cash outflows]^(1/n) − 1**

Where:
- FV of inflows = future value of all cash inflows compounded at the cost of capital
- PV of outflows = present value of all cash outflows discounted at the cost of capital

MIRR is a more reliable percentage-based metric than IRR, but NPV remains the primary decision rule.

---

### Slide 6 — Adjusted Present Value (APV)
**Title:** Adjusted Present Value (APV)
**Body:** APV separates the value of a project into two components: what it would be worth if financed entirely by equity, and the additional value created by the financing structure (primarily the debt tax shield).

**APV = Base-case NPV + PV of Financing Side Effects**

Where:
- **Base-case NPV** = NPV assuming all-equity financing (discount at unlevered cost of equity, Ku)
- **PV of Tax Shield** = PV of the interest tax savings from debt financing

When to use APV instead of WACC-based NPV:
- The firm's capital structure changes over the life of the project
- Debt is fixed in amount (not a fixed percentage of project value)
- Financing has complex side effects (subsidised loans, issue costs, etc.)

---

### Slide 7 — Capital Rationing
**Title:** Capital Rationing
**Body:** Capital rationing occurs when a firm has more positive-NPV projects than it has capital to fund. It must choose the combination of projects that maximises total NPV within its budget constraint.

**Single-period rationing — use the Profitability Index (PI):**

**PI = NPV / Initial Investment**

Rank projects by PI and fund in descending order until the budget is exhausted. This maximises NPV per pound invested.

**Multi-period rationing** requires linear programming to find the optimal combination of projects across multiple constrained periods.

Note: If projects are divisible, PI ranking gives the exact optimum. If projects are indivisible, trial combinations may be needed.

---

### Slide 8 — NPV for International Projects
**Title:** NPV for International Projects
**Body:** When a firm invests abroad, it faces an additional layer of complexity: foreign currency cash flows and exchange rate risk.

Two equivalent approaches:

**Approach 1 — Discount in foreign currency, then convert:**
1. Forecast FCFs in foreign currency
2. Discount at the foreign cost of capital
3. Convert NPV to home currency at the spot rate

**Approach 2 — Convert cash flows, then discount:**
1. Convert each year's FCF to home currency using forward rates
2. Discount at the home currency cost of capital

Both give the same result if Interest Rate Parity (IRP) holds. Forward rates are derived from IRP:

**Forward Rate = Spot Rate × [(1 + Home Rate) / (1 + Foreign Rate)]^n**

Additional considerations: political risk, remittance restrictions, tax treaties.

---

### Slide 9 — Key Formulas
**Title:** Key Formulas — Module 1
**Body:**

| Concept | Formula |
|---|---|
| Free Cash Flow | FCF = EBIT(1−T) + Dep − CapEx − ΔNWC |
| NPV | NPV = Σ [FCFt / (1+r)^t] − I₀ |
| MIRR | MIRR = [FV of inflows / PV of outflows]^(1/n) − 1 |
| APV | APV = Base-case NPV + PV of Tax Shield |
| Profitability Index | PI = NPV / Initial Investment |
| Forward Rate (IRP) | F = S × [(1 + r_d) / (1 + r_f)]^n |

---

### Slide 10 — Summary
**Title:** What You Should Now Be Able to Do
**Body:** By the end of this module, you should be able to:

1. Calculate Free Cash Flow from a project's operating data
2. Compute NPV and apply the accept/reject decision rule
3. Calculate MIRR and explain why it improves on IRR
4. Use APV to value a project with a changing or fixed debt structure
5. Rank projects under capital rationing using the Profitability Index
6. Appraise a foreign investment project using both international NPV approaches

**Next:** Module 2 — Cost of Capital & Capital Structure
