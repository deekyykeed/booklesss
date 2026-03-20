# Gamma Slide Deck — Module 2: Cost of Capital & Capital Structure
**Gamma URL:** https://gamma.app/generations/z5NgJ6KegVWl41WiX1VKa
**Notes:** No images, full bleed cards. Manually created in Chrome.
**Last updated:** 2026-03-09

---

## Slide Content (to be entered manually in Gamma)

---

### Slide 1 — Title
**Title:** Module 2 — Cost of Capital & Capital Structure
**Subtitle:** BAC4301 Corporate Finance
**Body:** Once you know how to evaluate a project, you need to know what rate to discount it at. This module answers that question — and then asks: does the way a firm is financed actually matter?

---

### Slide 2 — Understanding Cost of Capital
**Title:** Understanding Cost of Capital
**Body:** The cost of capital is the return demanded by investors who provide the firm with funds. Each source of finance has its own cost:

- **Cost of equity (Ke)** — the return shareholders expect on their shares
- **Cost of debt (Kd)** — the interest paid on borrowings (after tax, because interest is tax-deductible)
- **Cost of preference shares (Kp)** — yield on preference shares

The overall cost is the **Weighted Average Cost of Capital (WACC)** — the weighted blend of all funding sources.

---

### Slide 3 — WACC Formula
**Title:** Weighted Average Cost of Capital (WACC)
**Body:** WACC combines the cost of each source of finance in proportion to its share of the total capital structure:

**WACC = (Ve / V) × Re + (Vd / V) × Rd × (1 − Tax)**

Where:
- Ve = Market value of equity
- Vd = Market value of debt
- V = Ve + Vd (total capital)
- Re = Cost of equity
- Rd = Pre-tax cost of debt
- (1 − Tax) = Tax shield on interest

**Worked example:** Equity proportion 80%, Re = 15%, Debt proportion 20%, Rd = 10%, Tax = 35%
WACC = (15% × 0.80) + (10% × 0.65 × 0.20) = **13.3%**

---

### Slide 4 — Cost of Equity: CAPM
**Title:** Cost of Equity — Capital Asset Pricing Model (CAPM)
**Body:** CAPM calculates the return an investor requires based on the systematic (market) risk of the investment:

**Re = Rf + β × (Rm − Rf)**

Where:
- Rf = Risk-free rate (yield on government bonds)
- Rm = Expected market return
- β = Beta coefficient — measures sensitivity of the asset's returns to market movements
- (Rm − Rf) = Market risk premium

**Example:** Rf = 4%, Rm = 10%, β = 1.20
Re = 4% + 1.20 × (10% − 4%) = **11.2%**

A β > 1 means the asset is more volatile than the market; β < 1 means less volatile.

---

### Slide 5 — Cost of Equity: Dividend Valuation Model (DVM)
**Title:** Cost of Equity — Dividend Valuation Model
**Body:** The DVM equates the current share price with the present value of all future dividends. It is an alternative to CAPM when market data is limited.

**Constant dividend:**
Re = D / P₀ (ex-div)

**Constant dividend growth:**
Re = [D₀ × (1 + g) / P₀] + g

Where:
- D₀ = Dividend just paid
- P₀ = Current ex-div share price
- g = Constant growth rate (estimated from historic dividend data)

**Estimating g:** g = (Latest dividend / Earliest dividend)^(1/n) − 1

---

### Slide 6 — Cost of Debt
**Title:** Cost of Debt
**Body:** The cost of debt depends on the type of instrument:

| Instrument | Cost |
|---|---|
| Irredeemable bonds | Kd = [Coupon × (1 − T)] / P₀ |
| Redeemable bonds | Kd = YTM (IRR) on after-tax cash flows |
| Convertible debt | Kd = YTM using conversion value at maturity |
| Bank loan | Kd = Interest rate × (1 − Tax) |
| Debt with known beta | Kd = Rf + βd × (Rm − Rf), then × (1 − T) |

**YTM formula:** IRR = A + [a / (a − b)] × (B − A)

Where A and B are the two trial rates and a and b are the respective NPVs.

Interest is tax-deductible — always use the **after-tax cost** in WACC calculations.

---

### Slide 7 — Credit Risk and the Cost of Debt
**Title:** Credit Risk & Credit Spreads
**Body:** The cost of debt is not fixed — it depends on the borrower's creditworthiness. Lenders charge a **credit spread** on top of the risk-free rate to compensate for default risk.

**Yield on corporate bond = Risk-free rate + Credit spread**

Credit ratings (from AAA to CCC) determine the spread. Lower credit quality → higher spread → higher cost of debt.

**Cost of debt (using credit spread):**
Kd (after tax) = (1 − T) × (Risk-free rate + Credit spread)

[VISUAL INSTRUCTION: Create a simple table in Gamma showing credit spreads by rating and maturity — columns: Rating / 1yr / 5yr / 10yr / 30yr. Use rows for AAA, AA, A, BBB, BB, B. Key data: AA 10yr = 52 bps; BBB 10yr = 122 bps; B 10yr = 350 bps. Keep it clean with alternating row shading.]

---

### Slide 8 — Capital Structure: Operating & Financial Gearing
**Title:** Gearing — Operating & Financial Risk
**Body:** Gearing measures how much of a firm's cost structure or capital structure is fixed.

**Operating gearing** — fixed costs as a proportion of total costs:
- High fixed costs amplify changes in revenue into larger changes in EBIT
- Operating gearing = Fixed costs / Total costs (or % change in EBIT / % change in revenue)

**Financial gearing** — proportion of debt in the capital structure:
- Debt-to-equity ratio = (Long-term debt + Preference shares) / Shareholders' funds × 100%
- Debt-to-capital ratio = Long-term debt / Capital employed × 100%
- Interest cover = EBIT / Interest (ideal: at least 3×; safer: 7×)

A highly geared firm amplifies both gains and losses — interest is a fixed charge regardless of performance.

---

### Slide 9 — Capital Structure Theories
**Title:** Does Capital Structure Matter?
**Body:** Three competing theories address whether the mix of debt and equity affects firm value:

**1. Traditional view (Relevance theory)**
Increasing debt reduces WACC up to an optimal point. Beyond that, financial distress costs cause WACC to rise. There is an optimal capital structure that maximises firm value.

**2. Modigliani-Miller (without tax)**
In a perfect capital market, capital structure is irrelevant. The benefit of cheap debt is exactly offset by a rise in the cost of equity (increased financial risk). WACC is constant; firm value is unchanged.

**3. Modigliani-Miller (with tax)**
Interest is tax-deductible → interest tax shield adds value. Use as much debt as possible. Value (geared) = Value (ungeared) + PV of tax shield.

**4. M&M with financial distress costs**
At extreme debt levels, costs of financial distress erode the tax shield benefit. Optimal structure = maximum tax benefit just before distress sets in. (Consistent with the traditional view.)

[VISUAL INSTRUCTION: Create three side-by-side mini charts as a visual — labeled "Traditional," "M&M No Tax," and "M&M With Tax." Each shows a simple WACC curve against gearing level: Traditional = U-shaped curve with a minimum; No Tax = flat horizontal line; With Tax = downward sloping line. Use icons or simple shapes. This is one of the most important conceptual visuals in the course.]

---

### Slide 10 — Pecking Order Theory
**Title:** Pecking Order Theory
**Body:** Rather than seeking an optimal structure, the Pecking Order Theory (Myers & Majluf) argues that firms follow a hierarchy of least-cost financing:

1. **Retained earnings** — first choice; no issuance costs, no dilution
2. **Straight debt** — lower risk to investors
3. **Convertible debt** — hybrid, slightly riskier
4. **Preference shares** — ahead of equity but below debt
5. **Ordinary shares (equity)** — last resort; highest cost and most dilutive

Firms avoid external equity as long as possible due to information asymmetry — managers know more than the market, and a new equity issue signals the shares may be overvalued.

[VISUAL INSTRUCTION: Create a vertical "ladder" or stepped arrow in Gamma. Each step is a box labeled with the financing source in order: Retained Earnings → Straight Debt → Convertible Debt → Preference Shares → Ordinary Shares. Add a label on the side: "Increasing cost & risk of issuance" with an upward arrow.]

---

### Slide 11 — Key Formulas
**Title:** Key Formulas — Module 2
**Body:**

| Concept | Formula |
|---|---|
| WACC | WACC = (Ve/V) × Re + (Vd/V) × Rd × (1−T) |
| CAPM (Cost of Equity) | Re = Rf + β × (Rm − Rf) |
| DVM (constant growth) | Re = [D₀(1+g) / P₀] + g |
| Growth rate (historic) | g = (Latest div / Earliest div)^(1/n) − 1 |
| Irredeemable bond Kd | Kd = [C × (1−T)] / P₀ |
| YTM (IRR formula) | IRR = A + [a/(a−b)] × (B−A) |
| Cost of debt (credit spread) | Kd = (1−T) × (Rf + Spread) |
| Value (geared firm) | V_g = V_u + PV of Tax Shield |
| Interest cover | IC = EBIT / Interest |
| D/E ratio | = (LT Debt + Pref Shares) / Shareholders' Funds |

---

### Slide 12 — Summary
**Title:** What You Should Now Be Able to Do
**Body:** By the end of this module, you should be able to:

1. Calculate WACC for a firm financed by equity, debt, and preference shares
2. Apply CAPM to find the cost of equity given beta, market return, and risk-free rate
3. Use the DVM to find cost of equity with constant or growing dividends
4. Calculate the after-tax cost of debt for bank loans, irredeemable bonds, and redeemable bonds (YTM)
5. Use credit spreads to determine the cost of corporate debt
6. Measure operating and financial gearing and interpret the results
7. Explain the Traditional view, M&M (with and without tax), and pecking order theory
8. Use the APV framework (introduced in Module 1) with the correct discount rates from this module

**Next:** Module 3 — Mergers & Acquisitions
