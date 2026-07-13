"""Booklesss HQ — Revenue Model (internal web step).

Every lever of the money machine on sliders: tier prices, paying students,
cost base, then the funnel (trials, conversion, churn) projected twelve
months out. Defaults mirror Operations/pricing-strategy.md after the
2026-07-12 platform decision (BOO-7): revenue tiers unchanged, cost base is
platform hosting, not Slack seats.

Lives under Operations/ because it is a business document, not course
content — generate_step.py --all only scans Schools/, so rebuild this one
explicitly:

Build:  python3 _dev/step-generator/generate_step.py "Operations/sources/content_revenue-model.py"
"""

MODEL_LAB_HTML = """      <div class="lab" id="rm-lab">
        <style>
          .rm-cap { display:block; font-family:"Satoshi","Onest",system-ui,sans-serif; font-size:0.6875rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--steel); margin:1.35rem 0 0.15rem; }
          .rm-cap.first { margin-top:0; }
          .rm-sub { font-family:"Onest",system-ui,sans-serif; font-size:0.8rem; color:var(--steel); line-height:1.5; margin:0 0 0.7rem; }
          .rm-lead { font-family:"Onest",system-ui,sans-serif; font-size:0.85rem; color:var(--steel); line-height:1.55; margin:0.55rem 0 0.2rem; }
          .rm-capline { font-family:"Geist Mono",ui-monospace,monospace; font-size:0.74rem; line-height:1.4; color:var(--steel); margin:0.7rem 0 0.1rem; padding:0.6rem 0.75rem; background:var(--amber-soft); border:1px solid var(--amber-line); border-radius:12px; }
          .rm-capline b { color:var(--ink); font-weight:700; }
          .rm-months .lab-bar { grid-template-columns:3.4rem 1fr 5.2rem; }
        </style>
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-calc"/></svg>Move the levers &mdash; the business recalculates</span>
        <p class="rm-lead">Read it top to bottom: set what each tier <b>charges</b> and how many <b>full members</b> you have &mdash; Notes fills in at 5 seats per member, and running costs are fixed. The bars and the big number underneath update as you drag.</p>
        <span class="rm-cap first">1 &middot; Prices &mdash; what each tier charges / month</span>
        <p class="rm-sub">The monthly fee for each plan. These same two prices also drive the twelve-month funnel further down.</p>
        <div class="lab-grid">
          <div class="lab-row"><label for="rm-pn">Notes price / month</label><input type="range" id="rm-pn" min="100" max="1000" step="20" value="360"><output id="rm-pn-out"></output></div>
          <div class="lab-row"><label for="rm-pc">Community price / month</label><input type="range" id="rm-pc" min="200" max="1600" step="50" value="600"><output id="rm-pc-out"></output></div>
        </div>
        <span class="rm-cap">2 &middot; How many full members</span>
        <p class="rm-sub">You only set your full (Community) members. Each one fills <b>5</b> Notes seats and your own seat fills 5 more &mdash; the model assumes those seats are full, so Notes follows from Community with no separate slider.</p>
        <div class="lab-grid">
          <div class="lab-row"><label for="rm-nc">On Community (full members)</label><input type="range" id="rm-nc" min="0" max="50" step="1" value="4"><output id="rm-nc-out"></output></div>
        </div>
        <p class="rm-capline" id="rm-capline"></p>
        <span class="rm-cap">3 &middot; What the month costs you</span>
        <p class="rm-sub">Your fixed monthly tools, in US dollars: Framer <b>$40</b>, Claude <b>$100</b>, Vercel <b>$20</b>, Supabase <b>$25</b> = <b>$185 / month</b> (&asymp;K4,625 at K25/$). Taken straight off revenue below; it doesn&rsquo;t grow per student, so there&rsquo;s nothing to drag.</p>
        <div class="lab-out">
          <div class="lab-bar"><span class="nm">Notes revenue</span><span class="tr"><span class="fl" id="rm-bar-n"></span></span><output id="rm-val-n"></output></div>
          <div class="lab-bar"><span class="nm">Community revenue</span><span class="tr"><span class="fl" id="rm-bar-c"></span></span><output id="rm-val-c"></output></div>
          <div class="lab-bar"><span class="nm">Running cost (fixed)</span><span class="tr"><span class="fl pay" id="rm-bar-k"></span></span><output id="rm-val-k"></output></div>
          <div class="lab-total">
            <span class="big"><span id="rm-net"></span> <small>net / month</small></span>
            <span class="note" id="rm-note"></span>
          </div>
        </div>
      </div>"""

FUNNEL_LAB_HTML = """      <div class="lab" id="rm-funnel">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-calc"/></svg>The funnel, twelve months out &mdash; prices and costs carry over from the snapshot above</span>
        <div class="lab-grid">
          <div class="lab-row"><label for="rm-tr">New free trials / month</label><input type="range" id="rm-tr" min="0" max="60" step="1" value="12"><output id="rm-tr-out"></output></div>
          <div class="lab-row"><label for="rm-cv">Trial &rarr; paid conversion</label><input type="range" id="rm-cv" min="0" max="80" step="5" value="25"><output id="rm-cv-out"></output></div>
          <div class="lab-row"><label for="rm-cs">Share choosing Community</label><input type="range" id="rm-cs" min="0" max="100" step="5" value="30"><output id="rm-cs-out"></output></div>
          <div class="lab-row"><label for="rm-ch">Monthly churn</label><input type="range" id="rm-ch" min="0" max="30" step="1" value="10"><output id="rm-ch-out"></output></div>
        </div>
        <div class="lab-out rm-months">
          <div class="lab-bar"><span class="nm">M1</span><span class="tr"><span class="fl" id="rm-mb-1"></span></span><output id="rm-mv-1"></output></div>
          <div class="lab-bar"><span class="nm">M2</span><span class="tr"><span class="fl" id="rm-mb-2"></span></span><output id="rm-mv-2"></output></div>
          <div class="lab-bar"><span class="nm">M3</span><span class="tr"><span class="fl" id="rm-mb-3"></span></span><output id="rm-mv-3"></output></div>
          <div class="lab-bar"><span class="nm">M4</span><span class="tr"><span class="fl" id="rm-mb-4"></span></span><output id="rm-mv-4"></output></div>
          <div class="lab-bar"><span class="nm">M5</span><span class="tr"><span class="fl" id="rm-mb-5"></span></span><output id="rm-mv-5"></output></div>
          <div class="lab-bar"><span class="nm">M6</span><span class="tr"><span class="fl" id="rm-mb-6"></span></span><output id="rm-mv-6"></output></div>
          <div class="lab-bar"><span class="nm">M7</span><span class="tr"><span class="fl" id="rm-mb-7"></span></span><output id="rm-mv-7"></output></div>
          <div class="lab-bar"><span class="nm">M8</span><span class="tr"><span class="fl" id="rm-mb-8"></span></span><output id="rm-mv-8"></output></div>
          <div class="lab-bar"><span class="nm">M9</span><span class="tr"><span class="fl" id="rm-mb-9"></span></span><output id="rm-mv-9"></output></div>
          <div class="lab-bar"><span class="nm">M10</span><span class="tr"><span class="fl" id="rm-mb-10"></span></span><output id="rm-mv-10"></output></div>
          <div class="lab-bar"><span class="nm">M11</span><span class="tr"><span class="fl" id="rm-mb-11"></span></span><output id="rm-mv-11"></output></div>
          <div class="lab-bar"><span class="nm">M12</span><span class="tr"><span class="fl" id="rm-mb-12"></span></span><output id="rm-mv-12"></output></div>
          <div class="lab-total">
            <span class="big"><span id="rm-mrr12"></span> <small>MRR at month 12</small></span>
            <span class="note" id="rm-fnote"></span>
          </div>
        </div>
      </div>"""

MODEL_LAB_JS = """  /* ── Revenue model: snapshot + funnel (shared inputs) ── */
  (function () {
    var $ = function (id) { return document.getElementById(id); };
    var lab = $("rm-lab"), funnel = $("rm-funnel");
    if (!lab || !funnel) return;
    function fmtK(v) { return "K" + Math.round(v).toLocaleString(); }
    function calc() {
      var pn = +$("rm-pn").value, pc = +$("rm-pc").value;
      var nc = +$("rm-nc").value;

      /* Slack guest ratio: 5 free single-channel guests per paid member, and
         your own seat is a paid member too. We assume every Notes seat is
         filled, so Notes = 5 x (Community + 1) — derived, no slider. */
      var nn = 5 * (nc + 1);

      $("rm-pn-out").textContent = "K" + pn;
      $("rm-pc-out").textContent = "K" + pc;
      $("rm-nc-out").textContent = nc;
      $("rm-capline").innerHTML = "Each full member fills 5 Notes seats &mdash; <b>Notes = 5 &times; ("
        + nc + " Community + your seat) = " + nn + "</b> (assumed full)";

      var revN = pn * nn, revC = pc * nc;
      var rev = revN + revC;
      var costs = 185 * 25;  // $185/mo fixed tools (Framer 40 + Claude 100 + Vercel 20 + Supabase 25) at K25/$
      var net = rev - costs;
      var MAX = Math.max(revN, revC, costs, 1) * 1.1;
      $("rm-bar-n").style.width = (revN / MAX * 100) + "%";
      $("rm-bar-c").style.width = (revC / MAX * 100) + "%";
      $("rm-bar-k").style.width = (costs / MAX * 100) + "%";
      $("rm-val-n").textContent = fmtK(revN);
      $("rm-val-c").textContent = fmtK(revC);
      $("rm-val-k").textContent = fmtK(costs);
      $("rm-net").textContent = fmtK(net);
      var margin = rev > 0 ? Math.round(net / rev * 100) : 0;
      var stone;
      if (net < 0)          stone = fmtK(-net) + " short of covering costs";
      else if (net >= 5000) stone = "past the K5,000 net/month target";
      else if (net >= 3000) stone = "past K3,000 net \\u2014 next stop K5,000";
      else if (net >= 1000) stone = "past K1,000 net \\u2014 next stop K3,000";
      else                  stone = "covers the cost base \\u2014 next stop K1,000 net";
      $("rm-note").textContent = margin + "% margin \\u00b7 " + fmtK(costs) + " costs \\u00b7 " + stone;

      /* funnel simulation — twelve months from a standing start */
      var tr = +$("rm-tr").value, cv = +$("rm-cv").value / 100;
      var cs = +$("rm-cs").value / 100, ch = +$("rm-ch").value / 100;
      $("rm-tr-out").textContent = tr;
      $("rm-cv-out").textContent = Math.round(cv * 100) + "%";
      $("rm-cs-out").textContent = Math.round(cs * 100) + "%";
      $("rm-ch-out").textContent = Math.round(ch * 100) + "%";

      var newPaid = tr * cv, newC = newPaid * cs, newN = newPaid * (1 - cs);
      var baseN = 0, baseC = 0, mrr = [], m;
      for (m = 0; m < 12; m++) {
        baseN = baseN * (1 - ch) + newN;
        baseC = baseC * (1 - ch) + newC;
        mrr.push(baseN * pn + baseC * pc);
      }
      var MMAX = Math.max.apply(null, mrr.concat([1])) * 1.1;
      var pass3 = 0;
      for (m = 0; m < 12; m++) {
        $("rm-mb-" + (m + 1)).style.width = (mrr[m] / MMAX * 100) + "%";
        $("rm-mv-" + (m + 1)).textContent = fmtK(mrr[m]);
        if (!pass3 && mrr[m] - costs >= 3000) pass3 = m + 1;
      }
      $("rm-mrr12").textContent = fmtK(mrr[11]);
      var students12 = Math.round(baseN + baseC);
      var net12 = mrr[11] - costs;
      var notesCap12 = 5 * (Math.round(baseC) + 1);
      var over = Math.round(baseN) > notesCap12
        ? " \\u00b7 heads up: that projects " + Math.round(baseN) + " Notes but only room for "
          + notesCap12 + " at " + Math.round(baseC) + " Community (5 per member) \\u2014 lift the Community share"
        : "";
      var ss;
      if (newPaid === 0)  ss = "no conversions at these settings \\u2014 the base stays empty";
      else if (ch === 0)  ss = "no churn set \\u2014 the base compounds with no ceiling";
      else ss = "steady state \\u2248 " + Math.round(newPaid / ch) + " students / "
              + fmtK((newN / ch) * pn + (newC / ch) * pc) + " MRR";
      var hit3 = pass3 ? "passes K3,000 net in month " + pass3
                       : "K3,000 net not reached within 12 months";
      $("rm-fnote").textContent = students12 + " paying students by month 12 \\u00b7 "
        + fmtK(net12) + " net/month \\u00b7 " + ss + " \\u00b7 " + hit3 + over;
    }
    lab.addEventListener("input", calc);
    funnel.addEventListener("input", calc);
    calc();
  })();
"""

STEP = {
    "slug": "revenue-model",
    "course": "Booklesss HQ",
    "page_title": "Revenue Model — Booklesss HQ",
    "course_chip": "INTERNAL · OPS",
    "eyebrow": "Booklesss HQ · Operations · Revenue Model",
    "title_html": "The Booklesss\nRevenue Model",
    "standfirst_html": "Every lever of the money machine on sliders &mdash; the two tier prices, paying students, the cost base, then the funnel projected twelve months out. Move a lever and watch what the business pays you.",
    "meta": {"minutes": 8, "sections": 5, "examples": 2},

    "sources": {},

    "sections": [
        {"eyebrow": "The machine", "title": "How Booklesss Makes Money", "blocks": [
            {"t": "p", "html": "Booklesss sells access to the gated study platform. Every student starts on a free trial &mdash; one month, one course, no card &mdash; and at day 25 gets a WhatsApp follow-up asking them to pick a paid tier. Two subscription tiers carry the model. A Custom tier sits on top for students who want 1-on-1 attention, but it is negotiated per student and has no set price yet &mdash; so it stays out of the sliders below and enters the books as logged revenue when it happens."},
            {"t": "table", "head": ["Tier", "Default price", "What they get"], "rows": [
                ["Free trial", "K0 (1 month)", "One course, full step access &mdash; no card required"],
                ["Notes", "K360 / month", "One course &mdash; steps, discussion, past papers"],
                ["Community", "K600 / month", "Every course, quizzes, the whole platform"],
                ["Custom", "Negotiated", "1-on-1 tutoring, dedicated support, custom study plan"],
            ]},
            {"t": "callout", "tag": "Why there is no Slack bill in this model", "icon": "bulb", "html": "The old economics priced Community against a paid Slack seat (K339/month on Business+). The 2026-07-12 decision (Linear BOO-7) moved paid access off Slack and onto the platform &mdash; reselling Slack seats breached the Slack MSA. The cost base is now your platform tools &mdash; Framer, Claude, Vercel, Supabase &mdash; about $185 a month total, and it does not grow per student."},
        ]},

        {"eyebrow": "Variables", "title": "The Levers You Can Pull", "blocks": [
            {"t": "p", "html": "A handful of numbers drive this model. Two prices and one headcount &mdash; your full members &mdash; set revenue, with Notes following at 5 seats per member; trials, conversion, the tier mix, and churn decide how the paying base grows over time. Running costs stay a fixed monthly figure, not a lever, so they aren&rsquo;t on a slider. The rest belong side by side because none of them acts alone."},
            {"t": "table", "head": ["Lever", "What it moves", "Where it lives"], "rows": [
                ["Tier prices", "Revenue per student", "Operations/pricing-strategy.md"],
                ["Full members (Community)", "Revenue &mdash; and the Notes seats they fill", "Operations/revenue-log.md"],
                ["New trials / month", "Top of the funnel", "Operations/groups.md &amp; leads.md"],
                ["Trial &rarr; paid conversion", "How fast the base fills", "Day-25 follow-ups in leads.md"],
                ["Monthly churn", "The ceiling of the base", "Cancellations in revenue-log.md"],
                ["Running cost (fixed, not a lever)", "A flat monthly floor", "Framer / Claude / Vercel / Supabase"],
            ]},
        ]},

        {"eyebrow": "Price points", "title": "Monthly Snapshot — Price It, Fill It, Cost It", "blocks": [
            {"t": "p", "html": "This is the business frozen at one month. Set the two prices and your Community headcount; Notes fills in at 5 seats per member, and running costs are a fixed monthly figure. The bars split revenue by tier against that cost, and the headline figure is what lands in your pocket."},
            {"t": "raw", "html": MODEL_LAB_HTML},
            {"t": "callout", "tag": "The 5-per-member rule", "icon": "bulb", "html": "Notes students are hosted as free single-channel guests, and Slack allows 5 guests per paid member. Your own seat is a paid member, and every Community student is another &mdash; so the model assumes each full member fills 5 Notes seats: Notes = 5 &times; (Community + you). That is why there is no Notes slider &mdash; it follows from Community. At 0 Community you fill 5 Notes on your own seat; at 4 Community, 25."},
            {"t": "callout", "tag": "How to read it", "icon": "medal", "html": "Because the cost base is fixed, margin climbs with every member &mdash; there is no per-seat cost eating the next sale. That cuts both ways: net profit moves almost one-for-one with revenue, so a K60 price change across your students is a real swing. And each Community member brings 5 Notes seats with it, so adding one full member lifts revenue on both tiers at once."},
        ]},

        {"eyebrow": "Growth", "title": "The Funnel Over Twelve Months", "blocks": [
            {"t": "p", "html": "The snapshot says nothing about time. The funnel does: every month some trials arrive, a share of them convert after their free month, and a share of the existing base cancels. The base a leaky bucket can hold is fixed by the flow in and the leak &mdash; not by how long you pour."},
            {"t": "formula", "html": 'Steady state  <span class="op">=</span>  (trials &times; conversion) &divide; churn\n\nAt 12 trials, 25% conversion, 10% churn:\n  (12 &times; 0.25) &divide; 0.10  <span class="op">=</span>  30 paying students &mdash; the ceiling'},
            {"t": "p", "html": "The lab below runs that arithmetic month by month from a standing start of zero students. It reads prices and costs from the snapshot above, so the two labs are one model &mdash; reprice Notes up there and month 12 changes down here."},
            {"t": "raw", "html": FUNNEL_LAB_HTML},
            {"t": "callout", "tag": "The lever hierarchy", "icon": "bulb", "html": "Doubling trials and halving churn produce the same ceiling &mdash; but halving churn is usually cheaper, because retention is posting cadence and quiz nights, while trials cost flyers, data bundles, and time in WhatsApp groups. Check the steady-state line before spending on reach: if the ceiling at current churn is 30 students, more marketing buys speed toward 30, not a bigger number."},
        ]},

        {"eyebrow": "Reading it", "title": "What the Model Keeps Telling You", "blocks": [
            {"t": "bullets", "items": [
                "The running cost is a flat ~K4,625 a month &mdash; your $185 of tools (Framer, Claude, Vercel, Supabase) at K25/$. It doesn&rsquo;t grow per student, so once revenue clears it, the rest is margin.",
                "One full member is worth more than it looks: K600 from them, plus 5 Notes seats at K360 &mdash; up to K2,400 of Notes revenue riding on that single membership.",
                "Steady state ignores launch spikes. Trials &times; conversion &divide; churn is the whole ceiling &mdash; a big first month just gets you there sooner.",
                "Community does the heavy lifting per head; Notes does volume. The tier-mix slider often moves month-12 MRR more than either price does.",
                "Churn is the only lever where small numbers are violent: 5% versus 15% churn is a threefold difference in the ceiling.",
            ]},
            {"t": "callout", "tag": "Decision to make", "icon": "check", "html": "Find the slider settings you actually believe &mdash; honest conversion, honest churn, prices you can defend on WhatsApp &mdash; and read what they pay. If the answer disappoints, the model shows which lever is cheapest to move first. When a setting becomes the plan, write it into Operations/pricing-strategy.md and hold the monthly logs to it."},
        ]},
    ],

    "outcomes": [
        "Price the two tiers and read net profit and margin at any headcount",
        "Apply the Slack guest ratio: 5 Notes students per paid member, capped by your Community count",
        "Project the paying base and MRR twelve months out from trials, conversion, and churn",
        "Locate the steady-state ceiling and name which lever raises it fastest",
        "Say in which month the business passes K1,000, K3,000, and K5,000 net at current settings",
    ],

    "brand": {},

    "glossary": {
        "mrr": "Monthly recurring revenue — what all active subscriptions pay in one month, before costs.",
        "net profit": "Revenue minus total costs — what the business actually keeps in a month.",
        "margin": "Net profit as a share of revenue. High here because the cost base is fixed, not per-student.",
        "cost base": "The fixed monthly tools bill — Framer, Claude, Vercel, Supabase — about $185 (≈K4,625 at K25/$). Flat; it doesn't grow per student.",
        "churn": "The share of paying students who cancel in a month. Sets the ceiling of the base.",
        "conversion": "The share of free trials that become paying students after their free month.",
        "conversion rate": "The share of free trials that become paying students after their free month.",
        "steady state": "Where the base stops growing: new paid students per month equals students lost to churn. Equals trials × conversion ÷ churn.",
        "funnel": "The path from stranger to payer: WhatsApp group → free trial → day-25 follow-up → paid tier.",
        "top of the funnel": "New free trials arriving each month — fed by group posts, flyers, and status updates.",
        "tier": "A price level: Notes (one course), Community (everything), Custom (negotiated 1-on-1).",
        "exchange rate": "Kwacha per US dollar. Hosting is billed in dollars, so a weaker kwacha raises the cost base.",
        "cohort": "The students who converted in the same month — they churn together at the same rate.",
        "break-even": "The point where revenue covers the cost base — net profit of exactly zero.",
        "ceiling": "The steady-state size of the paying base at current trials, conversion, and churn.",
        "arpu": "Average revenue per user — total MRR divided by paying students; moves with the tier mix.",
        "single-channel guest": "A free Slack guest with access to one channel — how Notes students are hosted. Slack allows 5 per paid member.",
        "guest ratio": "Slack's rule: 5 free single-channel guests per paid member. Your seat plus each Community member sets how many Notes you can hold.",
        "guest access": "Slack lets each paid member bring 5 free single-channel guests — the ceiling on Notes students in this model.",
    },

    "closer_html": "When a set of slider positions starts to look like the plan rather than the wish, write those numbers into Operations/pricing-strategy.md and hold the funnel to them &mdash; leads.md, groups.md, and revenue-log.md are where this model meets reality.",
    "next_line": "NEXT: FILL THE FUNNEL — THE LOGS IN OPERATIONS/ ARE THE MODEL'S INPUTS",

    "calculator_js": MODEL_LAB_JS,
    "voice_agent_id": None,
}
