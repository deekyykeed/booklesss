"""TM Step 2.2 — Inventory Management, EOQ & Creditor Management (web step).

First step authored fully through the typed-block schema. Text ported from
build_tm_2_2_inventory-management.py; glossary, sources, and the interactive
EOQ lab written for the web.

Build:  python3 _dev/step-generator/generate_step.py "Schools/ZCAS/Treasury Management/02-working-capital/sources/content_tm_2_2.py"
"""

EOQ_LAB_HTML = """      <div class="lab" id="eoq-lab">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-calc"/></svg>Try it yourself &mdash; find the optimum order size</span>
        <div class="lab-grid">
          <div class="lab-row"><label for="eoq-dem">Monthly demand (units)</label><input type="range" id="eoq-dem" min="200" max="5000" step="100" value="1000"><output id="eoq-dem-out"></output></div>
          <div class="lab-row"><label for="eoq-ord">Cost per order</label><input type="range" id="eoq-ord" min="5" max="100" step="5" value="30"><output id="eoq-ord-out"></output></div>
          <div class="lab-row"><label for="eoq-hold">Holding cost / unit / year</label><input type="range" id="eoq-hold" min="0.5" max="10" step="0.01" value="2.88"><output id="eoq-hold-out"></output></div>
          <div class="lab-row"><label for="eoq-q">Your order size</label><input type="range" id="eoq-q" min="100" max="3000" step="50" value="500"><output id="eoq-q-out"></output></div>
        </div>
        <div class="lab-out">
          <div class="lab-bar"><span class="nm">Ordering cost / yr</span><span class="tr"><span class="fl" id="eoq-bar-oc"></span></span><output id="eoq-val-oc"></output></div>
          <div class="lab-bar"><span class="nm">Holding cost / yr</span><span class="tr"><span class="fl pay" id="eoq-bar-hc"></span></span><output id="eoq-val-hc"></output></div>
          <div class="lab-total">
            <span class="big"><span id="eoq-val"></span> <small>units EOQ</small></span>
            <span class="note"><b id="eoq-orders"></b> orders a year &middot; one every <b id="eoq-days"></b> days &middot; <span id="eoq-vs"></span></span>
          </div>
        </div>
      </div>"""

EOQ_LAB_JS = """  /* ── Interactive EOQ lab ── */
  (function () {
    var $ = function (id) { return document.getElementById(id); };
    var lab = $("eoq-lab");
    if (!lab) return;
    function fmtK(v) {
      return "K" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(v < 10 ? 2 : 0));
    }
    function calc() {
      var dm = +$("eoq-dem").value, c = +$("eoq-ord").value, h = +$("eoq-hold").value;
      var q = +$("eoq-q").value;
      var a = dm * 12;
      var eoq = Math.sqrt(2 * a * c / h);
      $("eoq-dem-out").textContent = dm.toLocaleString() + " u";
      $("eoq-ord-out").textContent = fmtK(c);
      $("eoq-hold-out").textContent = fmtK(h);
      $("eoq-q-out").textContent = q.toLocaleString() + " u";
      var oc = (a / q) * c;        // ordering cost per year at your Q
      var hc = (q / 2) * h;        // holding cost per year at your Q
      var totalQ = oc + hc;
      var totalOpt = (a / eoq) * c + (eoq / 2) * h;
      var MAX = Math.max(oc, hc) * 1.15;
      $("eoq-bar-oc").style.width = Math.min(100, oc / MAX * 100) + "%";
      $("eoq-bar-hc").style.width = Math.min(100, hc / MAX * 100) + "%";
      $("eoq-val-oc").textContent = fmtK(oc);
      $("eoq-val-hc").textContent = fmtK(hc);
      $("eoq-val").textContent = Math.round(eoq).toLocaleString();
      $("eoq-orders").textContent = (a / eoq).toFixed(1);
      $("eoq-days").textContent = (365 / (a / eoq)).toFixed(1);
      var waste = totalQ - totalOpt;
      $("eoq-vs").textContent = waste < 1
        ? "your order size is at the optimum \\u2014 the two costs balance"
        : "your order size wastes " + fmtK(waste) + " a year vs the optimum";
    }
    lab.addEventListener("input", calc);
    calc();
  })();
"""

STEP = {
    "slug": "tm-2-2",
    "course": "Treasury Management",
    "page_title": "Step 2.2 · Inventory Management, EOQ & Creditor Management — Booklesss",
    "course_chip": "BBF4302 · ZCAS",
    "eyebrow": "Treasury Management · Lesson 2 · Step 2.2",
    "title_html": "Inventory Management,\nEOQ &amp; Creditor Management",
    "standfirst_html": "Types of inventory, how to finance it, just-in-time purchasing, the order size that minimises total cost, and paying suppliers as late as wisdom allows.",
    "meta": {"minutes": 11, "sections": 5, "examples": 1},

    "sources": {
        "inv": {"domain": "investopedia.com", "label": "Investopedia", "mono": "I", "color": "#0E5F4C"},
        "acca": {"domain": "accaglobal.com", "label": "ACCA", "mono": "A", "color": "#C22032"},
    },

    "sections": [
        {"eyebrow": "Foundations", "title": "What is Inventory?", "blocks": [
            {"t": "p", "html": "Inventory is stock of raw materials, work in progress, finished goods, and supplies. These materials tie up large amounts of firm resources &mdash; cash that could otherwise be used for other investments. Treasury&rsquo;s goal is to hold the optimum level of inventory that maximises the benefits of holding stock less the costs of doing so."},
            {"t": "p", "html": "Hold more finished goods and you gain flexibility &mdash; you can fill customer orders without waiting for production &mdash; but you pay storage, capital, and obsolescence costs. Hold too little and you lose sales when you can&rsquo;t meet demand. Finding the right balance is a constant challenge."},
            {"t": "h3", "text": "Five Types of Inventory"},
            {"t": "table", "head": ["Type", "What it is"], "rows": [
                ["Raw materials", "Basic inputs to production. Separates the timing of supplier deliveries from production scheduling."],
                ["Work in progress", "Items actively in the manufacturing process."],
                ["Finished goods", "Completed items ready for sale &mdash; lets you fill orders without waiting for production."],
                ["Scrap &amp; obsolete items", "Stock made obsolete by product changes. Some can be reused (steel, aluminium) or sold to recyclers."],
                ["Stores &amp; supplies", "Indirect purchases that support production: lubricating oils, maintenance materials, consumables."],
            ]},
        ]},

        {"eyebrow": "Financing", "title": "Inventory Financing Alternatives", "blocks": [
            {"t": "p", "html": "Inventory must be financed. There are five main methods available, each with different costs and risk profiles."},
            {"t": "h3", "text": "1. Trade Credit (Accounts Payable)"},
            {"t": "p", "html": "The least expensive form of inventory financing. As you buy goods, the supplier allows you time to pay &mdash; typically 30&ndash;60 days. This credit is spontaneous: it rises and falls with your inventory levels. You don&rsquo;t apply for it; it happens automatically."},
            {"t": "h3", "text": "2. Supply Chain Financing"},
            {"t": "p", "html": "The seller arranges finance for the buyer based on purchase orders with large buyers. The buyer chooses it (not the supplier), and the seller gets a lower interest rate because the large buyer guarantees the order. The buyer avoids recording the debt on its balance sheet."},
            {"t": "h3", "text": "3. Collateralised Loans"},
            {"t": "p", "html": "Inventory serves as collateral for a bank loan. The bank lends a predetermined percentage of inventory value &mdash; typically 50&ndash;80%. The lien is perfected against the inventory."},
            {"t": "h3", "text": "4. Asset-Based Loans"},
            {"t": "p", "html": "The lender advances money based on inventory value, not the company&rsquo;s financial strength. If the company defaults, the lender takes physical possession of the inventory &mdash; either through a public warehouse or a field warehouse managed by the lender&rsquo;s representative."},
            {"t": "h3", "text": "5. Floor Planning"},
            {"t": "p", "html": "Common for high-value durables like cars, trucks, and heavy equipment. The lender grants loans against individual items by serial number. When the item is sold, the loan is repaid."},
        ]},

        {"eyebrow": "Operations", "title": "Just-In-Time (JIT) Purchasing", "blocks": [
            {"t": "p", "html": "JIT minimises inventory by reducing costs and uncertainties. The principle is simple: materials are received just in time to use, not weeks before {src:inv:https://www.investopedia.com/terms/j/jit.asp}."},
            {"t": "h3", "text": "JIT Purchasing Objectives"},
            {"t": "bullets", "items": [
                "Reduction of raw material stock",
                "Frequent deliveries of smaller orders from fewer suppliers",
                "Long-term supplier contracts to enable schedule predictability",
                "Quality assurance &mdash; the supplier is responsible for inspection, not the buyer",
            ]},
            {"t": "h3", "text": "JIT Production Objectives"},
            {"t": "p", "html": "JIT production aims for low-cost, high-quality, on-time production to order. This is achieved by minimising idle stock between processes."},
            {"t": "h3", "text": "Benefits of JIT"},
            {"t": "bullets", "items": [
                "Reduced inventory levels lower storage and capital costs",
                "Savings in storage space and handling",
                "Increased customer satisfaction &mdash; elimination of waste leads to better quality",
                "Weaknesses identified early &mdash; bottlenecks, supplier reliability, documentation gaps become visible",
                "Flexibility to supply small batches to meet demand variation",
            ]},
            {"t": "discuss", "html": "JIT was designed for Toyota&rsquo;s manufacturing environment. Think about a Zambian manufacturer you know of &mdash; what are the two biggest practical barriers to implementing JIT successfully in that context, and how would you address them?"},
        ]},

        {"eyebrow": "Optimization", "title": "Economic Order Quantity (EOQ)", "blocks": [
            {"t": "p", "html": "EOQ is the quantity to order each time that minimises total inventory cost {src:inv:https://www.investopedia.com/terms/e/economicorderquantity.asp}. Total cost is the sum of ordering costs and holding costs. Ordering costs fall as order size rises (fewer orders), but holding costs rise (more to store). EOQ is the point where the two balance."},
            {"t": "formula", "html": 'EOQ  <span class="op">=</span>  &radic;(2ac &divide; h)\n\nWhere:\n  a = annual demand in units\n  c = cost of ordering per order (fixed, regardless of quantity)\n  h = holding cost per unit per annum'},
            {"t": "h3", "text": "Worked Example — XYZ Ltd"},
            {"t": "p", "html": "XYZ Ltd requires 1,000 units of material X per month. Cost per order: K30 (regardless of order size). Holding cost: K2.88 per unit per annum."},
            {"t": "formula", "html": 'Step 1:  Annual demand  <span class="op">=</span>  1,000 &times; 12  <span class="op">=</span>  12,000 units\n\nStep 2:  EOQ  <span class="op">=</span>  &radic;(2 &times; 12,000 &times; 30 &divide; 2.88)\n              <span class="op">=</span>  &radic;(720,000 &divide; 2.88)\n              <span class="op">=</span>  &radic;250,000\n              <span class="op">=</span>  500 units\n\nStep 3:  Orders per year  <span class="op">=</span>  12,000 &divide; 500  <span class="op">=</span>  24 orders\n         Time between orders  <span class="op">=</span>  365 &divide; 24  <span class="op">=</span>  ~15.2 days'},
            {"t": "p", "html": "XYZ should order 500 units each time. That means 24 orders per year, roughly once every 15 days &mdash; the quantity that minimises the combined cost of placing orders and holding inventory."},
            {"t": "raw", "html": EOQ_LAB_HTML},
            {"t": "callout", "tag": "Exam tip", "icon": "medal", "html": "EOQ minimises the sum of ordering costs and holding costs. As order size increases, holding costs rise but ordering frequency (and cost) falls. EOQ is the crossover point &mdash; at the optimum, annual ordering cost equals annual holding cost. You may be asked to calculate EOQ, orders per year, or time between orders."},
        ]},

        {"eyebrow": "Payables", "title": "Creditor Management", "blocks": [
            {"t": "p", "html": "Trade credit is normally viewed as a free source of finance. The standard treasury policy is to pay suppliers as late as possible &mdash; while honouring your obligations and maintaining good relationships {src:acca:https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f9/technical-articles.html}. This maximises your use of the creditor as a source of working capital finance."},
            {"t": "p", "html": "But there&rsquo;s a risk: delay payment too long and cash-strapped suppliers may struggle and ultimately fail. That threatens your supply chain and your ability to source materials. Creditor management mirrors debtor management &mdash; the same metrics apply in reverse."},
            {"t": "formula", "html": 'Days Payables  <span class="op">=</span>  (Payables &divide; Cost of Goods Sold)  <span class="op">&times;</span>  365\n\nThis measures the average number of days you take to pay suppliers.'},
            {"t": "p", "html": "Extending payable days reduces the cash conversion cycle and reduces working capital requirements. But it must be balanced against supplier relationships and supply chain risk. Paying too late can damage relationships and threaten supply security."},
            {"t": "discuss", "html": "A company&rsquo;s finance director proposes stretching supplier payment terms from 30 days to 90 days across all suppliers to improve cash flow. The procurement director objects. Who has the stronger argument, and what would you recommend instead?"},
        ]},
    ],

    "outcomes": [
        "Define inventory and identify the five main types and their role in operations",
        "Describe the five methods of inventory financing and explain when each is appropriate",
        "Explain the objectives of JIT purchasing and identify practical barriers in a Zambian manufacturing context",
        "Calculate the Economic Order Quantity and determine the optimal order frequency",
        "Explain days payables and how creditor management affects the cash conversion cycle",
        "Balance the benefits of extending payment terms against supply chain relationship risk",
    ],

    "sources_list": [
        {"src": "inv", "href": "https://www.investopedia.com/terms/e/economicorderquantity.asp", "label": "Economic Order Quantity (EOQ)"},
        {"src": "inv", "href": "https://www.investopedia.com/terms/j/jit.asp", "label": "Just-in-Time (JIT) Inventory"},
        {"src": "acca", "href": "https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f9/technical-articles.html", "label": "ACCA FM Technical Articles — Working Capital"},
    ],

    "brand": {
        "investopedia.com":
            "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>"
            "<circle cx='12' cy='12' r='12' fill='#121212'/>"
            "<text x='12' y='17.8' font-family='Georgia,Times New Roman,serif' font-size='16' font-weight='700' fill='#FFFFFF' text-anchor='middle'>I</text></svg>",
        "accaglobal.com":
            "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>"
            "<circle cx='12' cy='12' r='12' fill='#C4122F'/>"
            "<text x='12' y='17.4' font-family='Arial,sans-serif' font-size='14' font-weight='800' fill='#FFFFFF' text-anchor='middle'>a</text></svg>",
    },

    "glossary": {
        "inventory": "Stock of raw materials, work in progress, finished goods, and supplies — cash tied up in physical form.",
        "raw materials": "Basic inputs to production; separates supplier delivery timing from production scheduling.",
        "work in progress": "Items actively in the manufacturing process.",
        "wip": "Work in progress — items actively in the manufacturing process.",
        "finished goods": "Completed items ready for sale; lets you fill orders without waiting for production.",
        "trade credit": "Spontaneous credit from suppliers — it rises and falls with your inventory levels, no application needed.",
        "supply chain financing": "Seller-arranged finance for buyers based on purchase orders guaranteed by a large buyer.",
        "collateralised loan": "A bank loan secured on inventory, typically 50–80% of its value.",
        "asset-based lending": "Lending against inventory value rather than financial strength; the lender takes the stock on default.",
        "floor planning": "Loans against high-value durables item by item, by serial number — repaid when each item sells.",
        "just-in-time": "Inventory system where materials arrive just in time to use, minimising stock levels.",
        "jit": "Just-in-time — materials arrive just in time to use, minimising stock held.",
        "economic order quantity": "The order size that minimises total inventory cost (ordering + holding). EOQ = √(2ac ÷ h).",
        "eoq": "Economic order quantity — the order size where annual ordering cost equals annual holding cost. EOQ = √(2ac ÷ h).",
        "ordering costs": "Fixed costs incurred each time an order is placed, regardless of quantity.",
        "holding costs": "Costs of storing inventory: capital tied up, storage, obsolescence, insurance.",
        "days payables": "(Payables ÷ COGS) × 365 — the average number of days taken to pay suppliers.",
        "creditor management": "Managing supplier relationships and payment timing to optimise working capital.",
        "spontaneous credit": "Finance that appears automatically as you trade — like trade credit growing with purchases.",
        "obsolescence": "Stock losing its value because the product or its market has moved on.",
    },

    "closer_html": "The JIT question is worth arguing about in the channel — Zambian supply chains make it a genuinely hard call, and there&rsquo;s no textbook answer. Once you can find EOQ with the sliders above, you&rsquo;re ready for where the cash itself gets managed day to day.",
    "next_line": "NEXT: 2.3 — CASH MANAGEMENT &amp; CASH FLOW FORECASTING",

    "calculator_js": EOQ_LAB_JS,
    "voice_agent_id": None,
}
