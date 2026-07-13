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
        <p class="rm-lead">Read it top to bottom: set what each tier <b>charges</b>, how many students you <b>have</b>, and what the month <b>costs</b> you. The bars and the big number underneath update as you drag.</p>
        <span class="rm-cap first">1 &middot; Prices &mdash; what each tier charges / month</span>
        <p class="rm-sub">The monthly fee for each plan. These same two prices also drive the twelve-month funnel further down.</p>
        <div class="lab-grid">
          <div class="lab-row"><label for="rm-pn">Notes price / month</label><input type="range" id="rm-pn" min="100" max="1000" step="20" value="360"><output id="rm-pn-out"></output></div>
          <div class="lab-row"><label for="rm-pc">Community price / month</label><input type="range" id="rm-pc" min="200" max="1600" step="50" value="600"><output id="rm-pc-out"></output></div>
        </div>
        <span class="rm-cap">2 &middot; Students you have today</span>
        <p class="rm-sub">Set your full (Community) members first &mdash; each one lets you host up to <b>5</b> Notes students, and your own seat covers 5 more. So the Notes slider stops at that limit and can&rsquo;t be dragged past it.</p>
        <div class="lab-grid">
          <div class="lab-row"><label for="rm-nc">On Community (full members)</label><input type="range" id="rm-nc" min="0" max="50" step="1" value="4"><output id="rm-nc-out"></output></div>
          <div class="lab-row"><label for="rm-nn">On Notes (single course)</label><input type="range" id="rm-nn" min="0" max="255" step="1" value="10"><output id="rm-nn-out"></output></div>
        </div>
        <p class="rm-capline" id="rm-capline"></p>
        <span class="rm-cap">3 &middot; What the month costs you</span>
        <p class="rm-sub">Your fixed bills &mdash; they don&rsquo;t grow per student. Hosting is billed in US dollars, so the exchange rate turns it into kwacha. All three are <b>per month</b>.</p>
        <div class="lab-grid">
          <div class="lab-row"><label for="rm-host">Hosting / month (USD)</label><input type="range" id="rm-host" min="0" max="100" step="5" value="20"><output id="rm-host-out"></output></div>
          <div class="lab-row"><label for="rm-fx">Exchange rate (K per $)</label><input type="range" id="rm-fx" min="20" max="35" step="0.5" value="25"><output id="rm-fx-out"></output></div>
          <div class="lab-row"><label for="rm-mkt">Marketing / month</label><input type="range" id="rm-mkt" min="0" max="2000" step="50" value="300"><output id="rm-mkt-out"></output></div>
        </div>
        <div class="lab-out">
          <div class="lab-bar"><span class="nm">Notes revenue</span><span class="tr"><span class="fl" id="rm-bar-n"></span></span><output id="rm-val-n"></output></div>
          <div class="lab-bar"><span class="nm">Community revenue</span><span class="tr"><span class="fl" id="rm-bar-c"></span></span><output id="rm-val-c"></output></div>
          <div class="lab-bar"><span class="nm">Total costs</span><span class="tr"><span class="fl pay" id="rm-bar-k"></span></span><output id="rm-val-k"></output></div>
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
      var host = +$("rm-host").value, fx = +$("rm-fx").value, mkt = +$("rm-mkt").value;

      /* Slack guest ratio: 5 single-channel guests per paid member, and your
         own seat is a paid member too, so Notes capacity = 5 x (Community + 1).
         Hard cap: drive the Notes slider's max so its thumb can't pass the limit. */
      var notes = $("rm-nn");
      var cap = 5 * (nc + 1);
      notes.max = cap;
      if (+notes.value > cap) notes.value = cap;
      var nn = +notes.value;
      notes.style.setProperty("--fill", (cap ? nn / cap * 100 : 0) + "%");

      $("rm-pn-out").textContent = "K" + pn;
      $("rm-pc-out").textContent = "K" + pc;
      $("rm-nn-out").textContent = nn;
      $("rm-nc-out").textContent = nc;
      $("rm-host-out").textContent = "$" + host;
      $("rm-fx-out").textContent = "K" + fx + "/$";
      $("rm-mkt-out").textContent = fmtK(mkt);
      $("rm-capline").innerHTML = "Notes room: <b>5 &times; (" + nc + " Community + your seat) = "
        + cap + "</b> &middot; " + (nn >= cap ? "at capacity" : "using " + nn);

      var revN = pn * nn, revC = pc * nc;
      var rev = revN + revC;
      var costs = host * fx + mkt;
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
            {"t": "callout", "tag": "Why there is no Slack bill in this model", "icon": "bulb", "html": "The old economics priced Community against a paid Slack seat (K339/month on Business+). The 2026-07-12 decision (Linear BOO-7) moved paid access off Slack and onto the platform &mdash; reselling Slack seats breached the Slack MSA. The cost base is now platform hosting: Vercel plus Supabase, roughly $0&ndash;45 a month total, and it does not grow per student."},
        ]},

        {"eyebrow": "Variables", "title": "The Levers You Can Pull", "blocks": [
            {"t": "p", "html": "Eleven numbers drive this model. Two prices and two headcounts set revenue; hosting, the exchange rate, and marketing set cost; trials, conversion, the tier mix, and churn decide how the paying base grows &mdash; and where it stops growing. None of them acts alone, which is exactly why they belong on sliders side by side."},
            {"t": "table", "head": ["Lever", "What it moves", "Where it lives"], "rows": [
                ["Tier prices", "Revenue per student", "Operations/pricing-strategy.md"],
                ["Paying students per tier", "Revenue volume &amp; mix", "Operations/revenue-log.md"],
                ["New trials / month", "Top of the funnel", "Operations/groups.md &amp; leads.md"],
                ["Trial &rarr; paid conversion", "How fast the base fills", "Day-25 follow-ups in leads.md"],
                ["Monthly churn", "The ceiling of the base", "Cancellations in revenue-log.md"],
                ["Hosting &amp; exchange rate", "The fixed cost base", "Vercel &amp; Supabase dashboards"],
                ["Marketing spend", "Cost per trial", "Operations/groups.md"],
            ]},
        ]},

        {"eyebrow": "Price points", "title": "Monthly Snapshot — Price It, Fill It, Cost It", "blocks": [
            {"t": "p", "html": "This is the business frozen at one month. Set the two prices, decide how many students sit on each tier, and set the cost base &mdash; hosting is billed in dollars, so the exchange rate is a real lever here, not a footnote. The bars split revenue by tier against total costs, and the headline figure is what lands in your pocket."},
            {"t": "raw", "html": MODEL_LAB_HTML},
            {"t": "callout", "tag": "The 5-per-member rule", "icon": "bulb", "html": "Notes students are hosted as free single-channel guests, and Slack allows 5 guests per paid member. Your own seat is a paid member, and every Community student is another &mdash; so the room for Notes is 5 &times; (Community + you). That is why the Notes slider stops where it does: to add more Notes students, add a Community member first. Set Community to 0 and you can still hold 5 Notes on your own seat; set it to 4 and the ceiling is 25."},
            {"t": "callout", "tag": "How to read it", "icon": "medal", "html": "Because the cost base is fixed, margin climbs with every student &mdash; there is no per-seat cost eating the next sale. That cuts both ways: net profit moves almost one-for-one with revenue, so a K60 price change across ten students is a K600 swing. Try Notes at K300 and K420 before touching anything else &mdash; price is the cheapest experiment you can run."},
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
                "The cost base is roughly K500&ndash;K1,100 a month at realistic hosting and marketing &mdash; two or three Notes students clear it. Everything after that is margin.",
                "Steady state ignores launch spikes. Trials &times; conversion &divide; churn is the whole ceiling &mdash; a big first month just gets you there sooner.",
                "Community does the heavy lifting per head; Notes does volume. The mix slider often moves month-12 MRR more than either price does.",
                "Churn is the only lever where small numbers are violent: 5% versus 15% churn is a threefold difference in ceiling at identical marketing.",
                "Marketing is the one cost that should scale &mdash; and it only earns its keep as cost per converted trial. Log every group post in groups.md or that number stays invisible.",
            ]},
            {"t": "callout", "tag": "Decision to make", "icon": "check", "html": "Find the slider settings you actually believe &mdash; honest conversion, honest churn, prices you can defend on WhatsApp &mdash; and read what they pay. If the answer disappoints, the model shows which lever is cheapest to move first. When a setting becomes the plan, write it into Operations/pricing-strategy.md and hold the monthly logs to it."},
        ]},
    ],

    "outcomes": [
        "Price the two tiers and read net profit and margin at any headcount",
        "State the monthly cost base in kwacha for any hosting bill and exchange rate",
        "Project the paying base and MRR twelve months out from trials, conversion, and churn",
        "Locate the steady-state ceiling and name which lever raises it fastest",
        "Say in which month the business passes K1,000, K3,000, and K5,000 net at current settings",
    ],

    "brand": {},

    "glossary": {
        "mrr": "Monthly recurring revenue — what all active subscriptions pay in one month, before costs.",
        "net profit": "Revenue minus total costs — what the business actually keeps in a month.",
        "margin": "Net profit as a share of revenue. High here because the cost base is fixed, not per-student.",
        "cost base": "The fixed monthly bills — platform hosting (in dollars) plus marketing spend.",
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
