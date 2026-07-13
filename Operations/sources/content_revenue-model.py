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
        <p class="rm-sub">The founder&rsquo;s tools are fixed: Framer <b>$40</b>, Claude <b>$100</b>, Vercel <b>$20</b>, Supabase <b>$25</b> = <b>$185 / month</b>. But every person writing content needs their own Claude seat at <b>$100 / month</b> &mdash; so the bill climbs in phases as the writing team grows. Set how many writers hold a seat:</p>
        <div class="lab-grid">
          <div class="lab-row"><label for="rm-wr">Writers with a Claude seat</label><input type="range" id="rm-wr" min="0" max="4" step="1" value="0"><output id="rm-wr-out"></output></div>
        </div>
        <p class="rm-capline" id="rm-phline"></p>
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

SPLIT_LAB_HTML = """      <div class="lab" id="rm-split">
        <style>
          #rm-split .lab-bar { grid-template-columns: 10rem 1fr 9.5rem; }
          @media (max-width: 560px) {
            #rm-split .lab-bar { grid-template-columns: 1fr 9.5rem; }
            #rm-split .lab-bar .nm { grid-column: 1 / -1; }
          }
        </style>
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-calc"/></svg>Where every kwacha goes &mdash; monthly, with the same money seen per week</span>
        <div class="lab-out" style="margin-top:0.4rem; border-top:none; padding-top:0.4rem;">
          <div class="lab-bar"><span class="nm">Founder &amp; platform &middot; 41%</span><span class="tr"><span class="fl" id="rm-sb-f"></span></span><output id="rm-sv-f"></output></div>
          <div class="lab-bar"><span class="nm">Course Author &middot; 16%</span><span class="tr"><span class="fl" id="rm-sb-a"></span></span><output id="rm-sv-a"></output></div>
          <div class="lab-bar"><span class="nm">Community Host &middot; 10%</span><span class="tr"><span class="fl" id="rm-sb-h"></span></span><output id="rm-sv-h"></output></div>
          <div class="lab-bar"><span class="nm">Growth Lead &middot; 8%</span><span class="tr"><span class="fl" id="rm-sb-g"></span></span><output id="rm-sv-g"></output></div>
          <div class="lab-bar"><span class="nm">Campus Rep &middot; 7%</span><span class="tr"><span class="fl" id="rm-sb-r"></span></span><output id="rm-sv-r"></output></div>
          <div class="lab-bar"><span class="nm">Ops Lead &middot; 5%</span><span class="tr"><span class="fl" id="rm-sb-o"></span></span><output id="rm-sv-o"></output></div>
          <div class="lab-bar"><span class="nm">Marketing fund &middot; 8%</span><span class="tr"><span class="fl pay" id="rm-sb-m"></span></span><output id="rm-sv-m"></output></div>
          <div class="lab-bar"><span class="nm">Team welfare &middot; 5%</span><span class="tr"><span class="fl pay" id="rm-sb-w"></span></span><output id="rm-sv-w"></output></div>
          <div class="lab-total">
            <span class="big"><span id="rm-sf-net"></span> <small>founder, after tools</small></span>
            <span class="note" id="rm-snote"></span>
          </div>
        </div>
      </div>"""

FUNNEL_LAB_HTML = """      <div class="lab" id="rm-funnel">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-calc"/></svg>The next twelve months &mdash; continues from the snapshot: your members, your prices, your costs</span>
        <p class="rm-lead" id="rm-fstart"></p>
        <div class="lab-grid">
          <div class="lab-row"><label for="rm-tr">New free trials / month</label><input type="range" id="rm-tr" min="0" max="60" step="1" value="12"><output id="rm-tr-out"></output></div>
          <div class="lab-row"><label for="rm-cv">Trial &rarr; full member</label><input type="range" id="rm-cv" min="0" max="80" step="5" value="25"><output id="rm-cv-out"></output></div>
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
      /* Cost phases: $185 founder tools + $100 Claude seat per content
         writer, at K25/$. Phase = writers + 1, matching the phase table. */
      var wr = +$("rm-wr").value;
      var usd = 185 + wr * 100;
      var costs = usd * 25;
      $("rm-wr-out").textContent = wr;
      var PHASES = ["1 \\u2014 Launch (founder solo)", "2 \\u2014 First writer", "3 \\u2014 Second writer",
                    "4 \\u2014 Third writer", "5 \\u2014 Fourth writer"];
      $("rm-phline").innerHTML = "Phase <b>" + PHASES[wr] + "</b> \\u00b7 $" + usd
        + "/month = <b>" + fmtK(costs) + "</b>";
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

      /* revenue distribution — percentage shares of gross, so every share
         scales with price. Founder's 41% bears the whole tools bill,
         including each writer's Claude seat. Author gets 16% for writing
         the course AND teaching its live classes. Weekly = monthly / 4.33
         (paid monthly; the weekly figure is the same money seen per week). */
      var SPLITS = [["f", 41], ["a", 16], ["h", 10], ["g", 8], ["r", 7], ["o", 5], ["m", 8], ["w", 5]];
      var topShare = rev * 0.41;
      for (var s = 0; s < SPLITS.length; s++) {
        var amt = rev * SPLITS[s][1] / 100;
        $("rm-sb-" + SPLITS[s][0]).style.width = (topShare ? amt / (topShare * 1.1) * 100 : 0) + "%";
        $("rm-sv-" + SPLITS[s][0]).textContent = fmtK(amt) + " \\u00b7 " + fmtK(amt / 4.33) + "/wk";
      }
      var fNet = rev * 0.41 - costs;
      $("rm-sf-net").textContent = fmtK(fNet);
      $("rm-snote").textContent = "41% of " + fmtK(rev) + " = " + fmtK(rev * 0.41)
        + ", minus " + fmtK(costs) + " tools (phase " + (wr + 1) + ") \\u00b7 "
        + (fNet >= 0 ? "the split pays everyone and still covers the bills"
                     : "your share doesn\\u2019t cover the tools yet \\u2014 add full members before the next seat");

      /* forecast — continues from the snapshot. Only full members are
         simulated (trials x conversion in, churn out, starting from the
         Community slider's value); Notes refill each month by the same
         5-per-member rule, at the same prices, against the same costs. */
      var tr = +$("rm-tr").value, cv = +$("rm-cv").value / 100, ch = +$("rm-ch").value / 100;
      $("rm-tr-out").textContent = tr;
      $("rm-cv-out").textContent = Math.round(cv * 100) + "%";
      $("rm-ch-out").textContent = Math.round(ch * 100) + "%";
      $("rm-fstart").innerHTML = "Month 0 is the snapshot above: <b>" + nc + " full members</b> paying K"
        + pc + " and <b>" + nn + " Notes</b> at K" + pn + " \\u2014 " + fmtK(rev) + " MRR.";

      var newM = tr * cv;
      var mem = nc, mrr = [], mems = [], m;
      for (m = 0; m < 12; m++) {
        mem = mem * (1 - ch) + newM;
        mems.push(mem);
        mrr.push(mem * pc + 5 * (mem + 1) * pn);
      }
      var MMAX = Math.max.apply(null, mrr.concat([1])) * 1.1;
      var pass3 = 0;
      for (m = 0; m < 12; m++) {
        $("rm-mb-" + (m + 1)).style.width = (mrr[m] / MMAX * 100) + "%";
        $("rm-mv-" + (m + 1)).textContent = fmtK(mrr[m]);
        if (!pass3 && mrr[m] - costs >= 3000) pass3 = m + 1;
      }
      $("rm-mrr12").textContent = fmtK(mrr[11]);
      var mem12 = Math.round(mems[11]), notes12 = 5 * (mem12 + 1);
      var founder12 = mrr[11] * 0.41 - costs;
      var ss;
      if (newM === 0 && nc === 0) ss = "no conversions and no members \\u2014 the base stays empty";
      else if (ch === 0) ss = "no churn set \\u2014 members compound with no ceiling";
      else {
        var memSS = newM / ch;
        ss = "steady state \\u2248 " + Math.round(memSS) + " members + "
           + Math.round(5 * (memSS + 1)) + " Notes / " + fmtK(memSS * pc + 5 * (memSS + 1) * pn) + " MRR";
      }
      var hit3 = pass3 ? "passes K3,000 net in month " + pass3
                       : "K3,000 net not reached within 12 months";
      $("rm-fnote").textContent = "Month 12: " + mem12 + " members + " + notes12 + " Notes \\u00b7 "
        + fmtK(mrr[11] - costs) + " net \\u00b7 your 41% keeps " + fmtK(founder12)
        + " after tools \\u00b7 " + ss + " \\u00b7 " + hit3;
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
    "meta": {"minutes": 9, "sections": 6, "examples": 3},

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
            {"t": "callout", "tag": "Why there is no Slack bill in this model", "icon": "bulb", "html": "The old economics priced Community against a paid Slack seat (K339/month on Business+). The 2026-07-12 decision (Linear BOO-7) moved paid access off Slack and onto the platform &mdash; reselling Slack seats breached the Slack MSA. The cost base is now your platform tools &mdash; Framer, Claude, Vercel, Supabase, $185 a month for the founder &mdash; plus a $100 Claude seat for each content writer (the cost phases below). It never grows per student."},
        ]},

        {"eyebrow": "Variables", "title": "The Levers You Can Pull", "blocks": [
            {"t": "p", "html": "A handful of numbers drive this model. Two prices and one headcount &mdash; your full members &mdash; set revenue, with Notes following at 5 seats per member; trials, conversion, and churn decide how the paying base grows over time. Costs step in phases with the writing team: the one cost input is how many writers hold a Claude seat."},
            {"t": "table", "head": ["Lever", "What it moves", "Where it lives"], "rows": [
                ["Tier prices", "Revenue per student", "Operations/pricing-strategy.md"],
                ["Full members (Community)", "Revenue &mdash; and the Notes seats they fill", "Operations/revenue-log.md"],
                ["New trials / month", "Top of the funnel", "Operations/groups.md &amp; leads.md"],
                ["Trial &rarr; paid conversion", "How fast the base fills", "Day-25 follow-ups in leads.md"],
                ["Monthly churn", "The ceiling of the base", "Cancellations in revenue-log.md"],
                ["Writers on Claude (cost phases)", "The tools bill: $185 + $100 per writer", "The phase table below"],
            ]},
        ]},

        {"eyebrow": "Price points", "title": "Monthly Snapshot — Price It, Fill It, Cost It", "blocks": [
            {"t": "p", "html": "This is the business frozen at one month. Set the two prices and your Community headcount; Notes fills in at 5 seats per member, and running costs are a fixed monthly figure. The bars split revenue by tier against that cost, and the headline figure is what lands in your pocket."},
            {"t": "raw", "html": MODEL_LAB_HTML},
            {"t": "h3", "text": "The Cost Phases"},
            {"t": "p", "html": "The bill doesn&rsquo;t creep &mdash; it steps. Each phase is one more person writing content with their own Claude seat. A new writer can start on Claude Pro at $20 during their tryout; the phase assumes the full $100 seat once their course is in real production, which is what the writers slider charges."},
            {"t": "table", "head": ["Phase", "Team", "Tools bill (USD)", "In kwacha (K25/$)"], "rows": [
                ["1 &mdash; Launch", "Founder solo", "$185", "K4,625"],
                ["2 &mdash; First writer", "Founder + 1 writer", "$285", "K7,125"],
                ["3 &mdash; Second writer", "Founder + 2 writers", "$385", "K9,625"],
                ["4 &mdash; Third writer", "Founder + 3 writers", "$485", "K12,125"],
                ["5 &mdash; Fourth writer", "Founder + 4 writers", "$585", "K14,625"],
            ]},
            {"t": "callout", "tag": "The 5-per-member rule", "icon": "bulb", "html": "Notes students are hosted as free single-channel guests, and Slack allows 5 guests per paid member. Your own seat is a paid member, and every Community student is another &mdash; so the model assumes each full member fills 5 Notes seats: Notes = 5 &times; (Community + you). That is why there is no Notes slider &mdash; it follows from Community. At 0 Community you fill 5 Notes on your own seat; at 4 Community, 25."},
            {"t": "callout", "tag": "How to read it", "icon": "medal", "html": "Costs never grow per student &mdash; margin climbs with every member, and the bill only steps up when you add a writer. That gives each phase a clear entry test: move up only when the founder&rsquo;s share at current revenue covers the next seat. The split lab below does that arithmetic for you and warns when it doesn&rsquo;t."},
        ]},

        {"eyebrow": "Distribution", "title": "Who Gets Paid, and For What", "blocks": [
            {"t": "p", "html": "Every kwacha of monthly revenue is divided by fixed percentages &mdash; nobody is on a flat salary. That is deliberate: shares scale with the business, so raising a price or adding a member raises everyone&rsquo;s pay at the same time, and if the platform doesn&rsquo;t earn, nobody earns. The founder&rsquo;s share is the largest because it carries every fixed cost: the whole tools bill &mdash; $185 plus $100 for each writer&rsquo;s Claude seat &mdash; comes out of the 41%, never out of the team&rsquo;s. Everyone is paid monthly; the per-week figure next to each share is the same money seen week by week, not a separate payment."},
            {"t": "table", "head": ["Who", "Share", "What they&rsquo;re paid for"], "rows": [
                ["Founder &amp; platform", "41%", "Runs the platform, builds content, bears all tool costs &mdash; including every writer&rsquo;s Claude seat"],
                ["Course Author", "16%", "Writes the lesson steps <b>and teaches the live classes</b> for their course &mdash; the bigger share pays for the classroom hours"],
                ["Community Host", "10%", "Owns the course channels: daily activity, replies, weekly quiz, leaderboard"],
                ["Growth Lead", "8%", "Drives free-trial sign-ups and converts them to paid within 30 days"],
                ["Campus Rep", "7%", "On-campus referrals at UNZA / CBU &mdash; flyers, WhatsApp groups, walk-up sign-ups"],
                ["Ops &amp; Collections Lead", "5%", "Tracks MoMo payments, keeps the revenue log, monthly financial summary"],
                ["Marketing fund", "8%", "Not a person &mdash; buys flyers, data bundles, and boosts; growth funds itself"],
                ["Team welfare", "5%", "Data, meals, and transport for whoever worked that month"],
            ]},
            {"t": "raw", "html": SPLIT_LAB_HTML},
            {"t": "callout", "tag": "Roles are filled as revenue allows", "icon": "bulb", "html": "Until a role is hired, its share stays with the founder &mdash; you are the Author, Host, and Growth Lead today, so early on the founder&rsquo;s real take is most of the 100%. Hire in the order of the bottleneck (Rep &rarr; Host &rarr; Author, per Roles for Growth), and hand each share over only when the person takes over the duties. The percentages above replace the old per-unit commissions (K100 per referral, K300 host base) with shares that scale &mdash; revisit them at the first K10,000 month."},
        ]},

        {"eyebrow": "Growth", "title": "The Forecast — the Snapshot, Rolled Forward", "blocks": [
            {"t": "p", "html": "The snapshot says nothing about time. The forecast does &mdash; and it is not a separate model. Month 0 is exactly the snapshot above: your current full members, your prices, your costs. Each month after that, new trials arrive and a share convert to full members, a share of existing members cancels, and Notes refill to 5 seats per member &mdash; the same rule as the snapshot, applied twelve times."},
            {"t": "formula", "html": 'Members next month  <span class="op">=</span>  members &times; (1 &minus; churn)  <span class="op">+</span>  (trials &times; conversion)\nNotes each month    <span class="op">=</span>  5 &times; (members + your seat)  &mdash; assumed full\n\nCeiling:  members settle at  (trials &times; conversion) &divide; churn\n  At 12 trials, 25% conversion, 10% churn:  (12 &times; 0.25) &divide; 0.10  <span class="op">=</span>  30 members'},
            {"t": "p", "html": "Only full members need forecasting &mdash; everything else follows from them. Change any slider up in the snapshot and month 0 down here moves with it; change trials, conversion, or churn and you watch the same business travel twelve months."},
            {"t": "raw", "html": FUNNEL_LAB_HTML},
            {"t": "callout", "tag": "The lever hierarchy", "icon": "bulb", "html": "Doubling trials and halving churn produce the same ceiling &mdash; but halving churn is usually cheaper, because retention is posting cadence and quiz nights, while trials cost flyers, data bundles, and time in WhatsApp groups. Check the steady-state line before spending on reach: if the ceiling at current churn is 30 members, more marketing buys speed toward 30, not a bigger number."},
        ]},

        {"eyebrow": "Reading it", "title": "What the Model Keeps Telling You", "blocks": [
            {"t": "bullets", "items": [
                "Costs step in phases, not per student: K4,625 solo, plus K2,500 for each writer&rsquo;s Claude seat. The entry test for every phase is the same &mdash; your 41% must cover the next seat before you add it.",
                "One full member is worth more than it looks: K600 from them, plus 5 Notes seats at K360 &mdash; up to K2,400 of Notes revenue riding on that single membership.",
                "Steady state ignores launch spikes. Trials &times; conversion &divide; churn is the whole ceiling &mdash; a big first month just gets you there sooner.",
                "Every number traces back to one input: full members. The snapshot, the Notes count, the split, and the forecast all move when that slider does &mdash; so growing members is the whole game.",
                "Churn is the only lever where small numbers are violent: 5% versus 15% churn is a threefold difference in the ceiling.",
            ]},
            {"t": "callout", "tag": "Decision to make", "icon": "check", "html": "Find the slider settings you actually believe &mdash; honest conversion, honest churn, prices you can defend on WhatsApp &mdash; and read what they pay. If the answer disappoints, the model shows which lever is cheapest to move first. When a setting becomes the plan, write it into Operations/pricing-strategy.md and hold the monthly logs to it."},
        ]},
    ],

    "outcomes": [
        "Price the two tiers and read net profit and margin at any headcount",
        "Apply the Slack guest ratio: 5 Notes students per paid member, capped by your Community count",
        "Read each role's monthly and weekly pay from the percentage split at any revenue level",
        "Name the cost phase the business is in and the entry test for the next writer's Claude seat",
        "Project the paying base and MRR twelve months out from trials, conversion, and churn",
        "Locate the steady-state ceiling and name which lever raises it fastest",
        "Say in which month the business passes K1,000, K3,000, and K5,000 net at current settings",
    ],

    "brand": {},

    "glossary": {
        "mrr": "Monthly recurring revenue — what all active subscriptions pay in one month, before costs.",
        "net profit": "Revenue minus total costs — what the business actually keeps in a month.",
        "margin": "Net profit as a share of revenue. High here because the cost base is fixed, not per-student.",
        "cost base": "The monthly tools bill: $185 for the founder's stack plus $100 per writer's Claude seat. It steps in phases with the team, never per student.",
        "phase": "A step in the cost ladder — each phase adds one content writer with their own Claude seat ($100/month). Phase 1 is the founder solo at $185.",
        "claude seat": "A writer's own Claude subscription ($100/month) — required for anyone producing course content. Paid by the founder's share, not the writer's.",
        "churn": "The share of full members who cancel in a month. Sets the ceiling of the member base.",
        "conversion": "The share of free trials that become full members after their free month.",
        "conversion rate": "The share of free trials that become full members after their free month.",
        "steady state": "Where the member base stops growing: new members per month equals members lost to churn. Equals trials × conversion ÷ churn; Notes follow at 5 per member.",
        "funnel": "The path from stranger to payer: WhatsApp group → free trial → day-25 follow-up → paid tier.",
        "top of the funnel": "New free trials arriving each month — fed by group posts, flyers, and status updates.",
        "tier": "A price level: Notes (one course), Community (everything), Custom (negotiated 1-on-1).",
        "exchange rate": "Kwacha per US dollar. Hosting is billed in dollars, so a weaker kwacha raises the cost base.",
        "cohort": "The students who converted in the same month — they churn together at the same rate.",
        "break-even": "The point where revenue covers the cost base — net profit of exactly zero.",
        "ceiling": "The steady-state size of the paying base at current trials, conversion, and churn.",
        "arpu": "Average revenue per user — total MRR divided by paying students; moves with the tier mix.",
        "single-channel guest": "A free Slack guest with access to one channel — how Notes students are hosted. Slack allows 5 per paid member.",
        "marketing fund": "8% of revenue set aside each month to buy flyers, data bundles, and boosts — growth pays for itself.",
        "team welfare": "5% of revenue covering data, meals, and transport for whoever worked that month.",
        "distribution": "How each month's revenue is divided: fixed percentage shares per role, so pay scales with the business.",
        "guest ratio": "Slack's rule: 5 free single-channel guests per paid member. Your seat plus each Community member sets how many Notes you can hold.",
        "guest access": "Slack lets each paid member bring 5 free single-channel guests — the ceiling on Notes students in this model.",
    },

    "closer_html": "When a set of slider positions starts to look like the plan rather than the wish, write those numbers into Operations/pricing-strategy.md and hold the funnel to them &mdash; leads.md, groups.md, and revenue-log.md are where this model meets reality.",
    "next_line": "NEXT: FILL THE FUNNEL — THE LOGS IN OPERATIONS/ ARE THE MODEL'S INPUTS",

    "calculator_js": MODEL_LAB_JS,
    "voice_agent_id": None,
}
