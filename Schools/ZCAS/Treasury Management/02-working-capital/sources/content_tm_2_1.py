"""TM Step 2.1 — Working Capital & Liquidity Management (web step content).

Ported from the hand-built page; sections are carried as raw markup.
New steps should prefer typed blocks — see _dev/step-generator/README.md.

Build:  python3 _dev/step-generator/generate_step.py "Schools/ZCAS/Treasury Management/02-working-capital/sources/content_tm_2_1.py"
"""

STEP = {
    "slug": "tm-2-1",
    "course": "Treasury Management",
    "page_title": """Step 2.1 · Working Capital &amp; Liquidity Management — Booklesss""",
    "course_chip": """BBF4302 · ZCAS""",
    "eyebrow": """Treasury Management · Lesson 2 · Step 2.1""",
    "title_html": """Working Capital &amp; Liquidity Management""",
    "standfirst_html": """The cash cycle, working capital policy, debtor management, and factoring — the machinery that keeps a business solvent between the day it pays for inputs and the day customers pay it back.""",
    "meta": {"minutes": 12, "sections": 5, "examples": 2},

    # Raw port of the hand-built sections (incl. Outcomes + Sources).
    "raw_sections": """    <section>
      <span class="eyebrow">Foundations</span>
      <h2>What is Working Capital?</h2>
      <p>Working capital is current assets minus current liabilities. That&rsquo;s the technical definition <a class="src" href="https://www.investopedia.com/terms/w/workingcapital.asp" target="_blank" rel="noopener" data-dom="investopedia.com" data-mono="I" data-color="#0E5F4C"><span class="ico"></span>Investopedia</a>. In practice, it&rsquo;s the pool of cash and near-cash resources a business has available to keep running day-to-day.</p>
      <p>If current assets exceed current liabilities, the company has a surplus — usually sitting in bank deposits or short-term investments. If liabilities exceed assets, there&rsquo;s a deficit, and the company is typically running on an overdraft or short-term loan.</p>
      <p>Treasury&rsquo;s job is to manage this pool as efficiently as possible. Too little working capital and the business can&rsquo;t pay its suppliers. Too much and money sits idle earning nothing when it could be in productive assets.</p>
      <div class="callout">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-bulb"/></svg>Worth remembering</span>
        Even a profitable business can fail without adequate working capital. Cash is king — not profit. A company can be profitable on paper and still collapse if it can&rsquo;t meet its near-term obligations.
      </div>
    </section>

    <section>
      <span class="eyebrow">Strategy</span>
      <h2>Working Capital Policy</h2>
      <p>Every company makes two decisions that together define its working capital policy <a class="src" href="https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f9/technical-articles.html" target="_blank" rel="noopener" data-dom="accaglobal.com" data-mono="A" data-color="#C22032"><span class="ico"></span>ACCA</a>.</p>

      <h3>1. The Investment Decision — how much to hold</h3>
      <p>Companies must hold minimum levels of cash and inventory to keep operations running. The question is: how much safety stock on top of that minimum?</p>
      <div class="tbl-wrap"><table>
        <thead><tr><th>Policy</th><th>What it means</th><th>Return</th><th>Risk</th></tr></thead>
        <tbody>
          <tr><td>Aggressive</td><td>Minimal safety stock. Lean inventory, tight cash buffers.</td><td>Higher — less idle capital</td><td>Higher — can&rsquo;t respond to demand spikes</td></tr>
          <tr><td>Conservative</td><td>Large safety stocks. Generous cash buffers.</td><td>Lower — more capital tied up</td><td>Lower — rarely caught short</td></tr>
          <tr><td>Moderate</td><td>Balanced approach between the two extremes.</td><td>Middle ground</td><td>Middle ground</td></tr>
        </tbody>
      </table></div>

      <h3>2. The Financing Decision — how to fund it</h3>
      <p>This is about the mix of short-term vs long-term debt used to finance the asset base.</p>
      <div class="tbl-wrap"><table>
        <thead><tr><th>Policy</th><th>How it works</th><th>Return</th><th>Risk</th></tr></thead>
        <tbody>
          <tr><td>Aggressive</td><td>Part of the permanent asset base funded by short-term debt.</td><td>Highest — short-term debt costs less</td><td>Highest — must be rolled over</td></tr>
          <tr><td>Conservative</td><td>Permanent assets funded by long-term debt only.</td><td>Lowest</td><td>Lowest</td></tr>
          <tr><td>Maturity matching</td><td>Match funding maturity to asset life.</td><td>Middle</td><td>Middle</td></tr>
        </tbody>
      </table></div>
      <div class="callout">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-medal"/></svg>Exam tip</span>
        In both decisions, aggressive = higher return AND higher risk. Conservative = lower return AND lower risk. Always state both sides when the exam asks you to evaluate a policy.
      </div>
    </section>

    <section>
      <span class="eyebrow">Measurement</span>
      <h2>The Cash Conversion Cycle</h2>
      <p>The operating cycle is the time between paying cash for inputs and receiving cash from sales. The cash conversion cycle (CCC) measures this precisely <a class="src" href="https://corporatefinanceinstitute.com/resources/accounting/cash-conversion-cycle/" target="_blank" rel="noopener" data-dom="corporatefinanceinstitute.com" data-mono="C" data-color="#1B2A4A"><span class="ico"></span>CFI</a>:</p>
      <div class="formula-wrap"><div class="formula"><pre>CCC  <span class="op">=</span>  Days Inventory  <span class="op">+</span>  Days Receivables  <span class="op">&minus;</span>  Days Payables

Days Inventory    <span class="op">=</span>  (Inventory &divide; Cost of Goods Sold)  <span class="op">&times;</span>  365
Days Receivables  <span class="op">=</span>  (Accounts Receivable &divide; Revenue)   <span class="op">&times;</span>  365
Days Payables     <span class="op">=</span>  (Accounts Payable &divide; COGS)         <span class="op">&times;</span>  365</pre></div></div>
      <p>The longer the CCC, the more working capital the business needs to fund. A company with a 90-day CCC has to finance 90 days of operations before cash comes in <a class="src" href="https://www.investopedia.com/terms/c/cashconversioncycle.asp" target="_blank" rel="noopener" data-dom="investopedia.com" data-mono="I" data-color="#0E5F4C"><span class="ico"></span>Investopedia</a>.</p>

      <div class="ccc-viz" role="img" aria-label="The cash conversion cycle equals Days Inventory plus Days Receivables minus Days Payables, leaving the number of days a business's cash is tied up.">
        <style>
          .ccc-viz { margin: 1.5rem 0 1.7rem; }
          .ccc-cap { font-family:"Satoshi","Onest",system-ui,sans-serif; font-size:0.6875rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--steel); margin:0 0 0.9rem; }
          .ccc-flow { display:flex; align-items:stretch; gap:0.5rem; }
          .ccc-node { flex:1 1 0; min-width:0; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.45rem; padding:1.05rem 0.7rem; background:#ffffff; border:1px solid var(--border); border-radius:18px; box-shadow:var(--shadow); }
          .ccc-ic { width:54px; height:54px; flex:none; }
          .ccc-term { font-family:"Satoshi","Onest",system-ui,sans-serif; font-weight:650; font-size:0.85rem; color:var(--ink); line-height:1.2; }
          .ccc-sub { font-size:0.72rem; line-height:1.3; color:var(--steel); }
          .ccc-op { flex:0 0 auto; align-self:center; font-family:"Geist Mono","JetBrains Mono",ui-monospace,monospace; font-size:1.5rem; font-weight:700; color:var(--amber); }
          .ccc-eq { display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:0.4rem; margin-top:0.7rem; padding:0.7rem 1rem; background:var(--amber-soft); border:1px solid var(--amber-line); border-radius:14px; font-family:"Satoshi","Onest",system-ui,sans-serif; font-weight:600; font-size:0.875rem; color:var(--steel); text-align:center; }
          .ccc-eq b { color:var(--ink); font-weight:700; }
          .ccc-eq .eqs { color:var(--amber); font-weight:700; }
          @media (max-width:560px) {
            .ccc-flow { flex-direction:column; gap:0.35rem; }
            .ccc-op { font-size:1.35rem; margin:0.05rem 0; }
          }
        </style>
        <p class="ccc-cap">How the three drivers combine</p>
        <div class="ccc-flow">
          <div class="ccc-node">
            <svg class="ccc-ic" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path d="M32 8 56 20 32 32 8 20 Z" fill="#c5613f" fill-opacity="0.16"/>
              <path d="M8 20 32 32 56 20 32 8 Z" stroke="#18181B" stroke-width="3" stroke-linejoin="round"/>
              <path d="M8 20 V44 L32 56 V32" stroke="#18181B" stroke-width="3" stroke-linejoin="round"/>
              <path d="M56 20 V44 L32 56" stroke="#18181B" stroke-width="3" stroke-linejoin="round"/>
              <path d="M20 14 44 26" stroke="#c5613f" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <span class="ccc-term">Days Inventory</span>
            <span class="ccc-sub">cash stuck in stock</span>
          </div>
          <span class="ccc-op" aria-hidden="true">+</span>
          <div class="ccc-node">
            <svg class="ccc-ic" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <rect x="15" y="8" width="34" height="48" rx="5" fill="#c5613f" fill-opacity="0.16" stroke="#18181B" stroke-width="3"/>
              <path d="M23 20 H41" stroke="#18181B" stroke-width="3" stroke-linecap="round"/>
              <path d="M23 28 H41" stroke="#18181B" stroke-width="3" stroke-linecap="round"/>
              <path d="M23 36 H34" stroke="#18181B" stroke-width="3" stroke-linecap="round"/>
              <path d="M23 45 H41" stroke="#c5613f" stroke-width="3.5" stroke-linecap="round"/>
            </svg>
            <span class="ccc-term">Days Receivables</span>
            <span class="ccc-sub">waiting to be paid</span>
          </div>
          <span class="ccc-op" aria-hidden="true">&minus;</span>
          <div class="ccc-node">
            <svg class="ccc-ic" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <rect x="8" y="18" width="40" height="26" rx="5" fill="#c5613f" fill-opacity="0.16" stroke="#18181B" stroke-width="3"/>
              <circle cx="26" cy="31" r="6" stroke="#18181B" stroke-width="3"/>
              <path d="M14 24 h2.5 M37 38 h2.5" stroke="#18181B" stroke-width="3" stroke-linecap="round"/>
              <circle cx="47" cy="44" r="11" fill="#c5613f" stroke="#18181B" stroke-width="3"/>
              <circle cx="47" cy="44" r="5.5" stroke="#ffffff" stroke-width="2.2"/>
            </svg>
            <span class="ccc-term">Days Payables</span>
            <span class="ccc-sub">time before you pay</span>
          </div>
        </div>
        <div class="ccc-eq"><span class="eqs">=</span>&nbsp;<b>Cash Conversion Cycle</b> — the days your cash is tied up</div>
      </div>

      <h3>Worked Example — Zanaco Distributors Ltd</h3>
      <div class="tbl-wrap"><table>
        <thead><tr><th>Item</th><th>Value (ZMW)</th></tr></thead>
        <tbody>
          <tr><td>Inventory</td><td class="num">K2,600,000</td></tr>
          <tr><td>Accounts Receivable</td><td class="num">K1,700,000</td></tr>
          <tr><td>Accounts Payable</td><td class="num">K1,600,000</td></tr>
          <tr><td>Annual Revenue</td><td class="num">K15,000,000</td></tr>
          <tr><td>Cost of Goods Sold</td><td class="num">K9,200,000</td></tr>
        </tbody>
      </table></div>
      <div class="formula-wrap"><div class="formula"><pre>Step 1:  Days Inventory    <span class="op">=</span> (K2,600,000 &divide; K9,200,000)  <span class="op">&times;</span> 365 <span class="op">=</span> 103.15 days
Step 2:  Days Receivables  <span class="op">=</span> (K1,700,000 &divide; K15,000,000) <span class="op">&times;</span> 365 <span class="op">=</span>  41.37 days
Step 3:  Days Payables     <span class="op">=</span> (K1,600,000 &divide; K9,200,000)  <span class="op">&times;</span> 365 <span class="op">=</span>  63.48 days

CCC  <span class="op">=</span>  103.15 <span class="op">+</span> 41.37 <span class="op">&minus;</span> 63.48  <span class="op">=</span>  81.04 days
Cash Turnover  <span class="op">=</span>  365 &divide; 81.04  <span class="op">=</span>  4.5 times per year</pre></div></div>
      <p>Zanaco Distributors takes just over 81 days from paying for goods to collecting cash. Cash turns over 4.5 times a year. Shortening any component — collecting faster, turning inventory quicker, paying suppliers later — directly reduces funding requirements.</p>


      <div class="lab" id="ccc-lab">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-calc"/></svg>Try it yourself — move the sliders</span>
        <div class="lab-grid">
          <div class="lab-row"><label for="in-inv">Inventory</label><input type="range" id="in-inv" min="500000" max="6000000" step="100000" value="2600000"><output id="out-inv"></output></div>
          <div class="lab-row"><label for="in-rec">Accounts Receivable</label><input type="range" id="in-rec" min="500000" max="5000000" step="100000" value="1700000"><output id="out-rec"></output></div>
          <div class="lab-row"><label for="in-pay">Accounts Payable</label><input type="range" id="in-pay" min="500000" max="5000000" step="100000" value="1600000"><output id="out-pay"></output></div>
          <div class="lab-row"><label for="in-rev">Annual Revenue</label><input type="range" id="in-rev" min="5000000" max="30000000" step="500000" value="15000000"><output id="out-rev"></output></div>
          <div class="lab-row"><label for="in-cogs">Cost of Goods Sold</label><input type="range" id="in-cogs" min="3000000" max="20000000" step="200000" value="9200000"><output id="out-cogs"></output></div>
        </div>
        <div class="lab-out">
          <div class="lab-bar"><span class="nm">Days Inventory</span><span class="tr"><span class="fl" id="bar-di"></span></span><output id="val-di"></output></div>
          <div class="lab-bar"><span class="nm">Days Receivables</span><span class="tr"><span class="fl" id="bar-dr"></span></span><output id="val-dr"></output></div>
          <div class="lab-bar"><span class="nm">&minus; Days Payables</span><span class="tr"><span class="fl pay" id="bar-dp"></span></span><output id="val-dp"></output></div>
          <div class="lab-total">
            <span class="big"><span id="val-ccc"></span> <small>days CCC</small></span>
            <span class="note">Cash turns over <b id="val-turn"></b>&times; a year · <span id="val-vs"></span></span>
          </div>
        </div>
      </div>
      <div class="discuss">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-chat"/></svg>Discuss in the channel</span>
        <p>Something worth sitting with: if Zanaco ran this same calculation next year and the CCC jumped from 81 days to 120 days — what&rsquo;s the most likely cause, and which number would you look at first to diagnose it?</p>
      </div>

      <h3>Steps to Shorten the CCC</h3>
      <ul class="tick">
        <li>Collect debts faster — reduce debtor days through tighter credit terms or discounts</li>
        <li>Turn inventory faster — reduce stock holding periods and production time</li>
        <li>Reduce raw material inventory — order more frequently in smaller quantities</li>
        <li>Negotiate longer supplier credit — extend payable days without damaging relationships</li>
      </ul>
    </section>

    <section>
      <span class="eyebrow">Debtors</span>
      <h2>Debtor Management &amp; Credit Control</h2>
      <p>Extending credit to customers ties up cash. The goal is to find the level of credit and discount terms that maximises profit — not just minimises days outstanding.</p>

      <h3>Assessing a Customer&rsquo;s Creditworthiness</h3>
      <ul class="tick">
        <li>Bank references — Zambian banks provide references on their customers</li>
        <li>Trade references — existing suppliers can confirm payment history</li>
        <li>Published accounts — annual reports indicate general financial health</li>
        <li>Credit Reference Bureau — Zambia&rsquo;s credit registry holds borrowing data across banks</li>
        <li>Own sales records — for existing customers, the sales ledger shows payment patterns</li>
      </ul>

      <h3>Cash Discounts — Cost to the Buyer</h3>
      <p>Credit terms like &lsquo;2/10 net 30&rsquo; mean: take a 2% discount if you pay within 10 days, or pay the full amount by day 30. The buyer has to decide whether the discount is worth it.</p>
      <div class="formula-wrap"><div class="formula"><pre>Annual cost of NOT taking the discount:

Cost  <span class="op">=</span>  [D &divide; (100 &minus; D)]  <span class="op">&times;</span>  [365 &divide; (N &minus; T)]

Where:  D = discount %,  N = net period,  T = discount period</pre></div></div>

      <h3>Worked Example — 2/10 net 30</h3>
      <p>A buyer is offered terms 2/10 net 30. Short-term borrowing rate is 8%. Should they take the discount?</p>
      <div class="formula-wrap"><div class="formula"><pre>Cost  <span class="op">=</span>  [2 &divide; (100 &minus; 2)]  <span class="op">&times;</span>  [365 &divide; (30 &minus; 10)]
      <span class="op">=</span>  0.0204  <span class="op">&times;</span>  18.25
      <span class="op">=</span>  37.23% per annum

Borrowing cost: 8% p.a.
Decision: borrow at 8% and take the discount — forgoing it costs 37.23%.</pre></div></div>
      <div class="callout">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-check"/></svg>Decision rule</span>
        Always compare the annual cost of forgoing the discount against the cost of short-term borrowing. If borrowing is cheaper, take the discount. 37.23% vs 8% makes this a straightforward call.
      </div>
    </section>

    <section>
      <span class="eyebrow">Outsourcing</span>
      <h2>Factoring vs Invoice Discounting</h2>
      <p>Rather than managing receivables in-house, companies can outsource them. Two options: factoring and invoice discounting <a class="src" href="https://www.investopedia.com/terms/f/factor.asp" target="_blank" rel="noopener" data-dom="investopedia.com" data-mono="I" data-color="#0E5F4C"><span class="ico"></span>Investopedia</a>.</p>

      <h3>Factoring</h3>
      <p>A factoring company takes on your sales ledger. It advances a percentage of invoice value immediately (typically 80&ndash;85%), then pays the remainder — less its fees — when the customer settles. Full-service factors also assess customer credit and chase overdue accounts.</p>
      <p>Non-recourse factoring means the factor absorbs credit risk. Recourse factoring means the risk stays with you.</p>

      <h3>Worked Example — Mutengo Plc</h3>
      <p>Mutengo Plc imports commodities sold to reliable customers. Monthly invoices: K300,000. Average credit period: 2.5 months.</p>
      <ul class="tick">
        <li>Service fee: 2.5% of total invoices</li>
        <li>Advance: 85% of invoiced amounts at 13% p.a. interest</li>
        <li>Admin cost savings: K95,000 per year avoided</li>
      </ul>
      <div class="formula-wrap"><div class="formula"><pre>Annual sales:  K300,000 <span class="op">&times;</span> 12  <span class="op">=</span>  K3,600,000

Factoring fee:  2.5% <span class="op">&times;</span> K3,600,000                    <span class="op">=</span>  K90,000
Interest:  (2.5/12) <span class="op">&times;</span> K3,600,000 <span class="op">&times;</span> 85% <span class="op">&times;</span> 13%       <span class="op">=</span>  K82,875
Total factoring cost:                                  K172,875
Less: admin cost savings:                            <span class="op">&minus;</span> K95,000
Net cost of factoring:                                 K77,875

Alternative — bank overdraft on K637,500 at 12.5%   <span class="op">=</span>  K79,688
Factoring saving:                                     ~K1,800</pre></div></div>
      <p>Factoring saves Mutengo about K1,800 per year versus the overdraft — and eliminates the burden of running the sales ledger. For a company that doesn&rsquo;t want credit management as a core function, the numbers make sense.</p>

      <h3>Invoice Discounting</h3>
      <p>Invoice discounting provides the same finance without handing over your sales ledger. Customers don&rsquo;t know a third party is involved. It&rsquo;s cheaper than factoring and keeps the customer relationship entirely in your hands.</p>
      <div class="tbl-wrap"><table>
        <thead><tr><th></th><th>Factoring</th><th>Invoice Discounting</th></tr></thead>
        <tbody>
          <tr><td>Sales ledger</td><td>Factor manages it</td><td>Company manages it</td></tr>
          <tr><td>Customer awareness</td><td>Customers know</td><td>Customers don&rsquo;t know</td></tr>
          <tr><td>Cost</td><td>Higher</td><td>Lower</td></tr>
          <tr><td>Best for</td><td>Full outsourcing</td><td>Finance only</td></tr>
          <tr><td>Credit risk (non-recourse)</td><td>Factor absorbs</td><td>Company retains</td></tr>
        </tbody>
      </table></div>

      <div class="discuss">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-chat"/></svg>Discuss in the channel</span>
        <p>One that exam questions like to test: under what circumstances would you recommend factoring over invoice discounting even if factoring costs more? Think about what else the company gains beyond the finance itself.</p>
      </div>
    </section>

    <section>
      <span class="eyebrow">Outcomes</span>
      <h2>What You Should Now Be Able To Do</h2>
      <ul class="outcomes">
        <li><svg class="ic" aria-hidden="true"><use href="#ic-check"/></svg><span>Define working capital and explain why a profitable business can still fail without adequate liquidity</span></li>
        <li><svg class="ic" aria-hidden="true"><use href="#ic-check"/></svg><span>Distinguish between aggressive, conservative, and moderate working capital policies for both investment and financing decisions</span></li>
        <li><svg class="ic" aria-hidden="true"><use href="#ic-check"/></svg><span>Calculate the cash conversion cycle and identify which components to target to shorten it</span></li>
        <li><svg class="ic" aria-hidden="true"><use href="#ic-check"/></svg><span>Assess whether a buyer should take a trade discount using the annual cost formula</span></li>
        <li><svg class="ic" aria-hidden="true"><use href="#ic-check"/></svg><span>Explain how factoring works and calculate the net cost of a factoring arrangement</span></li>
        <li><svg class="ic" aria-hidden="true"><use href="#ic-check"/></svg><span>Compare factoring and invoice discounting and explain when each is more appropriate</span></li>
      </ul>
    </section>

    <section>
      <span class="eyebrow">Sources</span>
      <h2>Where This Step Draws From</h2>
      <p>Inline citations above link to the exact pages. Full list:</p>
      <ul class="sources-list">
        <li><a href="https://www.investopedia.com/terms/w/workingcapital.asp" target="_blank" rel="noopener" data-dom="investopedia.com" data-mono="I" data-color="#0E5F4C"><span class="ico"></span><span class="src-title">Working Capital — Definition &amp; Formula</span><svg class="ic open-ic" aria-hidden="true"><use href="#ic-open"/></svg></a></li>
        <li><a href="https://www.investopedia.com/terms/c/cashconversioncycle.asp" target="_blank" rel="noopener" data-dom="investopedia.com" data-mono="I" data-color="#0E5F4C"><span class="ico"></span><span class="src-title">Cash Conversion Cycle (CCC)</span><svg class="ic open-ic" aria-hidden="true"><use href="#ic-open"/></svg></a></li>
        <li><a href="https://corporatefinanceinstitute.com/resources/accounting/cash-conversion-cycle/" target="_blank" rel="noopener" data-dom="corporatefinanceinstitute.com" data-mono="C" data-color="#1B2A4A"><span class="ico"></span><span class="src-title">Cash Conversion Cycle — CFI Resources</span><svg class="ic open-ic" aria-hidden="true"><use href="#ic-open"/></svg></a></li>
        <li><a href="https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f9/technical-articles.html" target="_blank" rel="noopener" data-dom="accaglobal.com" data-mono="A" data-color="#C22032"><span class="ico"></span><span class="src-title">ACCA FM Technical Articles — Working Capital</span><svg class="ic open-ic" aria-hidden="true"><use href="#ic-open"/></svg></a></li>
        <li><a href="https://www.investopedia.com/terms/f/factor.asp" target="_blank" rel="noopener" data-dom="investopedia.com" data-mono="I" data-color="#0E5F4C"><span class="ico"></span><span class="src-title">Factoring — How It Works</span><svg class="ic open-ic" aria-hidden="true"><use href="#ic-open"/></svg></a></li>
      </ul>
    </section>""",

    # JS object literals carried verbatim (dicts also accepted).
    "brand": """{
    "investopedia.com":
      "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>" +
      "<circle cx='12' cy='12' r='12' fill='#121212'/>" +
      "<text x='12' y='17.8' font-family='Georgia,Times New Roman,serif' font-size='16' font-weight='700' fill='#FFFFFF' text-anchor='middle'>I</text></svg>",
    "corporatefinanceinstitute.com":
      "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>" +
      "<circle cx='12' cy='12' r='12' fill='#04323F'/>" +
      "<text x='12' y='15.6' font-family='Arial,sans-serif' font-size='7.5' font-weight='800' fill='#86BC25' text-anchor='middle'>CFI</text></svg>",
    "accaglobal.com":
      "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>" +
      "<circle cx='12' cy='12' r='12' fill='#C4122F'/>" +
      "<text x='12' y='17.4' font-family='Arial,sans-serif' font-size='14' font-weight='800' fill='#FFFFFF' text-anchor='middle'>a</text></svg>"
  }""",
    "glossary": """{
    "working capital": "Current assets minus current liabilities — the short-term funding available to run operations day-to-day.",
    "cash conversion cycle": "Days inventory + days receivables − days payables: the time from cash going out to cash coming back in.",
    "ccc": "The cash conversion cycle — days inventory + days receivables − days payables. The longer it is, the more working capital the business must fund.",
    "operating cycle": "The time between paying cash for inputs and receiving cash from sales.",
    "days inventory": "(Inventory ÷ COGS) × 365 — the average number of days inventory is held before being sold.",
    "days receivables": "(Receivables ÷ Revenue) × 365 — the average number of days it takes to collect payment from customers.",
    "days payables": "(Payables ÷ COGS) × 365 — the average number of days taken to pay suppliers.",
    "aggressive": "In working capital policy: minimal safety stocks and/or short-term financing — higher return, higher risk.",
    "conservative": "In working capital policy: large safety stocks and long-term financing — lower return, lower risk.",
    "maturity matching": "Financing policy that matches the maturity of funding to the life of the asset it funds.",
    "factoring": "Outsourcing the sales ledger to a finance company that advances cash against invoices (typically 80–85% up front).",
    "invoice discounting": "Finance advanced against invoices while the company keeps running its own sales ledger — customers never know.",
    "non-recourse": "The factor absorbs credit risk — if the customer doesn't pay, the factor covers it.",
    "recourse": "Credit risk stays with the seller — if the customer defaults, the company repays the factor's advance.",
    "trade discount": "A reduction offered for early payment, e.g. 2/10 net 30: 2% off if paid within 10 days, full amount by day 30.",
    "2/10 net 30": "Credit terms: take a 2% discount if you pay within 10 days, or pay in full by day 30.",
    "overdraft": "A short-term bank facility letting the account go negative up to a limit — flexible but usually expensive.",
    "liquidity": "How quickly assets can be turned into cash to meet obligations as they fall due.",
    "safety stock": "Inventory held above the operating minimum as a buffer against demand spikes or supply delays.",
    "sales ledger": "The record of all credit sales and customer balances — who owes what, and for how long.",
    "creditworthiness": "A customer's ability and track record of paying debts — assessed via bank/trade references, accounts, and credit bureau data.",
    "cogs": "Cost of goods sold — the direct cost of producing or buying what the company sells.",
    "current assets": "Assets expected to convert to cash within a year: inventory, receivables, cash and near-cash.",
    "current liabilities": "Obligations due within a year: payables, overdrafts, short-term loans.",
    "receivables": "Money owed to the business by customers who bought on credit.",
    "payables": "Money the business owes its suppliers for purchases made on credit.",
    "cash turnover": "365 ÷ CCC — how many times per year the cash cycle completes."
  }""",

    "closer_html": """That question about factoring vs invoice discounting is exactly the kind of thing the channel is for — drop your take and see how others reasoned it. When you&rsquo;re comfortable with the cash cycle, the inventory side of it is where the real savings hide.""",
    "next_line": """NEXT: 2.2 — INVENTORY MANAGEMENT, EOQ &amp; CREDITOR MANAGEMENT""",

    "calculator_js": """  /* ── Interactive CCC calculator ── */
  (function () {
    var $ = function (id) { return document.getElementById(id); };
    var lab = $("ccc-lab");
    if (!lab) return;
    var BASE = 81.0;
    function fmtK(v) {
      return "K" + (v >= 1000000 ? (v / 1000000).toFixed(1) + "m" : Math.round(v / 1000) + "k");
    }
    function calc() {
      var inv = +$("in-inv").value, rec = +$("in-rec").value, pay = +$("in-pay").value;
      var rev = +$("in-rev").value, cogs = +$("in-cogs").value;
      $("out-inv").textContent = fmtK(inv);
      $("out-rec").textContent = fmtK(rec);
      $("out-pay").textContent = fmtK(pay);
      $("out-rev").textContent = fmtK(rev);
      $("out-cogs").textContent = fmtK(cogs);
      var di = inv / cogs * 365, dr = rec / rev * 365, dp = pay / cogs * 365;
      var ccc = di + dr - dp;
      var MAX = 240;
      $("bar-di").style.width = Math.min(100, di / MAX * 100) + "%";
      $("bar-dr").style.width = Math.min(100, dr / MAX * 100) + "%";
      $("bar-dp").style.width = Math.min(100, dp / MAX * 100) + "%";
      $("val-di").textContent = di.toFixed(1) + " d";
      $("val-dr").textContent = dr.toFixed(1) + " d";
      $("val-dp").textContent = dp.toFixed(1) + " d";
      $("val-ccc").textContent = ccc.toFixed(1);
      $("val-turn").textContent = ccc > 0 ? (365 / ccc).toFixed(1) : "\\u221E";
      var diff = ccc - BASE;
      $("val-vs").textContent = Math.abs(diff) < 0.5 ? "same as Zanaco\\u2019s baseline"
        : (diff < 0 ? Math.abs(diff).toFixed(0) + " days shorter than Zanaco \\u2014 less funding needed"
                    : diff.toFixed(0) + " days longer than Zanaco \\u2014 more funding needed");
    }
    lab.addEventListener("input", calc);
    calc();
  })();


""",

    # Set to the public agent id from ElevenLabs to enable the voice tutor.
    "voice_agent_id": None,
}
