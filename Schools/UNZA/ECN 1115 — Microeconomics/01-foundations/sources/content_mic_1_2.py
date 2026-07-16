"""ECN 1115 Microeconomics — Step 1.2: Markets — Supply, Demand & How a Price Is Set.

Foundations, part two. Universal intro material (the supply-and-demand model),
so it needs none of the UNZA lecture files — same basis as 1.1. Picks up the
tomato-market thread from 1.1's closer. Interactive equilibrium demo built for
the web (mealie-meal market in ZMW).

Build:  python3 _dev/step-generator/generate_step.py "Schools/UNZA/ECN 1115 — Microeconomics/01-foundations/sources/content_mic_1_2.py"
"""

SD_LAB_HTML = """      <div class="lab" id="sd-lab">
        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-calc"/></svg>Try it yourself &mdash; find the price that clears the market</span>
        <p style="margin:0 0 0.6rem;font-size:0.9rem;">A depot sells 25kg bags of mealie meal. Slide the price and watch how many bags buyers want (demand) versus how many sellers offer (supply).</p>
        <div class="lab-grid">
          <div class="lab-row"><label for="sd-p">Price per bag</label><input type="range" id="sd-p" min="100" max="400" step="5" value="160"><output id="sd-p-out"></output></div>
        </div>
        <div class="lab-out">
          <div class="lab-bar"><span class="nm">Bags demanded</span><span class="tr"><span class="fl" id="sd-bar-d"></span></span><output id="sd-val-d"></output></div>
          <div class="lab-bar"><span class="nm">Bags supplied</span><span class="tr"><span class="fl pay" id="sd-bar-s"></span></span><output id="sd-val-s"></output></div>
          <div class="lab-total">
            <span class="big"><span id="sd-verdict"></span></span>
            <span class="note" id="sd-note"></span>
          </div>
        </div>
      </div>"""

SD_LAB_JS = """  /* ── Interactive supply & demand ── */
  (function () {
    var $ = function (id) { return document.getElementById(id); };
    var lab = $("sd-lab");
    if (!lab) return;
    // Qd = 300 - 0.4P ; Qs = 100 + 0.4P ; equilibrium P=250, Q=200.
    function calc() {
      var p = +$("sd-p").value;
      var qd = Math.max(0, 300 - 0.4 * p);
      var qs = Math.max(0, 100 + 0.4 * p);
      $("sd-p-out").textContent = "K" + p;
      var MAX = 280;
      $("sd-bar-d").style.width = Math.min(100, qd / MAX * 100) + "%";
      $("sd-bar-s").style.width = Math.min(100, qs / MAX * 100) + "%";
      $("sd-val-d").textContent = Math.round(qd) + " bags";
      $("sd-val-s").textContent = Math.round(qs) + " bags";
      var gap = qd - qs;
      var v = $("sd-verdict"), n = $("sd-note");
      if (Math.abs(gap) < 1) {
        v.textContent = "Market clears at K250";
        n.textContent = "Bags wanted = bags offered. No pressure on the price \\u2014 this is equilibrium.";
      } else if (gap > 0) {
        v.textContent = "Shortage of " + Math.round(gap) + " bags";
        n.textContent = "Buyers want more than sellers offer. They compete, and the price is pushed UP toward K250.";
      } else {
        v.textContent = "Surplus of " + Math.round(-gap) + " bags";
        n.textContent = "Sellers offer more than buyers want. Unsold stock piles up, and the price drifts DOWN toward K250.";
      }
    }
    lab.addEventListener("input", calc);
    calc();
  })();
"""

STEP = {
    "slug": "mic-1-2",
    "course": "Microeconomics",
    # Foundations stays free/open, same as 1.1.
    "access": "public",
    "page_title": "Step 1.2 · Markets: Supply, Demand & How a Price Is Set — Booklesss",
    "course_chip": "ECN 1115 · UNZA",
    "eyebrow": "Microeconomics · Lesson 1 · Step 1.2",
    "title_html": "Markets: Supply, Demand\n&amp; How a Price Is Set",
    "standfirst_html": "A price is not set by a boss or a committee. It is discovered where two forces meet: what buyers will take and what sellers will offer. This step builds the supply-and-demand model that the rest of the course runs on.",
    "meta": {"minutes": 12, "sections": 6, "examples": 3},

    "sources": {
        "inv": {"domain": "investopedia.com", "label": "Investopedia", "mono": "I", "color": "#121212"},
        "core": {"domain": "core-econ.org", "label": "CORE Econ", "mono": "C", "color": "#0057B8"},
    },

    "sections": [
        {"eyebrow": "Recap", "title": "Picking Up the Thread", "blocks": [
            {"t": "p", "html": "Step 1.1 ended on the tomato market: when the harvest fell, the price rose, and that single number told buyers to economise and sellers to bring more to market. This step slows that moment down and gives it a model &mdash; <b>supply and demand</b> &mdash; so you can predict which way a price moves, and why, in any market {src:core:https://www.core-econ.org/the-economy/}."},
            {"t": "p", "html": "Everything here sits at the level of one market for one good: the market for mealie meal, or fuel, or airtime. Keep one good in mind as you read and the two curves will feel concrete rather than abstract."},
        ]},

        {"eyebrow": "Buyers", "title": "Demand — What Buyers Will Take", "blocks": [
            {"t": "p", "html": "<b>Demand</b> is the quantity of a good buyers are willing and able to buy at each price, over some period. The pattern is so reliable it is called the <b>law of demand</b>: as the price rises, the quantity demanded falls; as the price falls, the quantity demanded rises {src:inv:https://www.investopedia.com/terms/l/lawofdemand.asp}. Higher mealie-meal prices mean households buy fewer bags &mdash; they stretch what they have, or switch to rice."},
            {"t": "p", "html": "Two reasons sit behind the law. First, when something gets dearer, people substitute toward cheaper alternatives. Second, each extra unit is worth a little less to you than the last (the marginal thinking from 1.1), so you only buy more when the price drops to match that lower value."},
            {"t": "h3", "text": "Movement along vs a shift of the curve"},
            {"t": "p", "html": "Be strict about this distinction &mdash; exams turn on it. A change in the good&rsquo;s <i>own price</i> is a <b>movement along</b> the demand curve (same curve, new point). A change in anything <i>else</i> moves the <b>whole curve</b> &mdash; buyers now want more (or less) at <i>every</i> price."},
            {"t": "callout", "tag": "What shifts demand", "icon": "bulb", "html": "Demand shifts when: <b>income</b> changes (a payday means more bags wanted at every price); the price of a <b>related good</b> changes (cheaper rice pulls demand away from mealie meal; a cheaper relish pushes it up); <b>tastes</b> change; <b>expectations</b> change (if you expect a shortage next week, you buy more now); or the <b>number of buyers</b> changes."},
        ]},

        {"eyebrow": "Sellers", "title": "Supply — What Sellers Will Offer", "blocks": [
            {"t": "p", "html": "<b>Supply</b> is the quantity sellers are willing to offer at each price. Its pattern is the mirror image &mdash; the <b>law of supply</b>: as the price rises, the quantity supplied rises {src:inv:https://www.investopedia.com/terms/l/lawofsupply.asp}. A higher mealie-meal price makes milling and selling more profitable, so millers run longer shifts and traders bring more bags to the depot."},
            {"t": "p", "html": "The same movement-vs-shift rule applies. A change in the good&rsquo;s own price is a movement along the supply curve. A change in anything else shifts the whole curve &mdash; sellers offer more (or less) at every price."},
            {"t": "callout", "tag": "What shifts supply", "icon": "bulb", "html": "Supply shifts when: <b>input costs</b> change (dearer maize, fuel, or ZESCO power means fewer bags offered at every price); <b>technology</b> improves (a better mill lifts supply); the <b>weather</b> turns for a farm good (a poor rain season cuts the maize harvest, shifting supply left); <b>taxes or subsidies</b> change; or the <b>number of sellers</b> changes."},
        ]},

        {"eyebrow": "The meeting point", "title": "Equilibrium — Where the Price Settles", "blocks": [
            {"t": "p", "html": "Put the two together. The <b>equilibrium price</b> is the one price where the quantity buyers want exactly equals the quantity sellers offer &mdash; the market <b>clears</b>, with nothing left over and no one turned away {src:inv:https://www.investopedia.com/terms/e/equilibrium.asp}. It is not chosen by anyone; it is discovered by the market groping toward it."},
            {"t": "p", "html": "Away from equilibrium, pressure builds. Set the price <i>above</i> it and sellers offer more than buyers want &mdash; a <b>surplus</b> of unsold bags, which pushes the price down. Set it <i>below</i> and buyers want more than sellers offer &mdash; a <b>shortage</b>, and competing buyers push the price up. Either way the price slides back toward the one level where the pressure disappears. Try it:"},
            {"t": "raw", "html": SD_LAB_HTML},
            {"t": "callout", "tag": "Exam tip", "icon": "medal", "html": "Surplus and shortage are about a <b>price away from equilibrium</b>, not about greed or scarcity in general. Above equilibrium &rarr; surplus &rarr; price falls. Below equilibrium &rarr; shortage &rarr; price rises. State the direction of the pressure and where it stops."},
        ]},

        {"eyebrow": "Prediction", "title": "Shifts in Action — Reading a Real Change", "blocks": [
            {"t": "p", "html": "The model earns its keep when something moves. The drill is always the same three questions: which curve shifts, which way, and what happens to the equilibrium price and quantity."},
            {"t": "h3", "text": "A poor rain season"},
            {"t": "p", "html": "Drought cuts the maize harvest. Maize is the key input, so the <b>supply</b> of mealie meal shifts <b>left</b> &mdash; fewer bags at every price. Demand hasn&rsquo;t moved. The new meeting point is at a <b>higher price</b> and a <b>lower quantity</b>. That is exactly the mealie-meal price spike Zambian households feel after a bad season &mdash; not a conspiracy, just supply and demand."},
            {"t": "h3", "text": "A rise in incomes"},
            {"t": "p", "html": "Now hold supply still and suppose incomes rise across town. Buyers want more at every price, so <b>demand</b> shifts <b>right</b>. The new equilibrium is at a <b>higher price</b> and a <b>higher quantity</b>. Same tool, opposite curve &mdash; and note how price rose in both stories, but quantity moved in opposite directions. Naming the curve and the direction is the whole skill."},
            {"t": "discuss", "html": "ZESCO load-shedding forces bakeries to run diesel generators, raising their costs. Using supply and demand for the bread market, say which curve shifts and which way, and what happens to the price and quantity of bread. Then name one thing that could shift the <i>other</i> curve at the same time."},
        ]},

        {"eyebrow": "Judgement", "title": "When the Price Isn't Left Alone", "blocks": [
            {"t": "p", "html": "Sometimes a government fixes a price instead of letting it clear. A <b>price ceiling</b> is a legal maximum &mdash; set below equilibrium (say, to keep mealie meal affordable), it creates a lasting <b>shortage</b>, because buyers want more than sellers will offer at that capped price. A <b>price floor</b> is a legal minimum &mdash; set above equilibrium (say, to protect farmers&rsquo; incomes), it creates a lasting <b>surplus</b> the setter often has to buy up and store, as the FRA does with maize."},
            {"t": "p", "html": "You do not need the full welfare analysis yet &mdash; that is a later lesson. The point for now is that the model already tells you the <i>direction</i> of the side effect: cap a price below the market and you get queues and shortages; prop it above and you get gluts. The price was carrying information; overrule it and that information does not vanish, it shows up as a shortage or a surplus instead."},
            {"t": "discuss", "html": "A student argues that the simplest way to help poor families is a law forcing the mealie-meal price down to half its current level. Using what this step gives you, explain the most likely unintended consequence &mdash; and suggest what a government could do instead that works <i>with</i> supply and demand rather than against it."},
        ]},
    ],

    "outcomes": [
        "State the law of demand and the law of supply and explain the reasoning behind each",
        "Tell a movement along a curve apart from a shift of the whole curve, and name what causes each",
        "List the main shifters of demand and of supply with a Zambian example of each",
        "Define equilibrium and explain how a surplus or shortage pushes the price back to it",
        "Predict the effect on price and quantity when demand or supply shifts",
        "Explain why a price ceiling causes a shortage and a price floor causes a surplus",
    ],

    "sources_list": [
        {"src": "inv", "href": "https://www.investopedia.com/terms/l/lawofdemand.asp", "label": "Law of Demand — Definition"},
        {"src": "inv", "href": "https://www.investopedia.com/terms/l/lawofsupply.asp", "label": "Law of Supply — Definition"},
        {"src": "inv", "href": "https://www.investopedia.com/terms/e/equilibrium.asp", "label": "Market Equilibrium — Definition"},
        {"src": "core", "href": "https://www.core-econ.org/the-economy/", "label": "CORE Econ — The Economy (open access textbook)"},
    ],

    "brand": {
        "investopedia.com":
            "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>"
            "<circle cx='12' cy='12' r='12' fill='#121212'/>"
            "<text x='12' y='17.8' font-family='Georgia,Times New Roman,serif' font-size='16' font-weight='700' fill='#FFFFFF' text-anchor='middle'>I</text></svg>",
        "core-econ.org":
            "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>"
            "<circle cx='12' cy='12' r='12' fill='#0057B8'/>"
            "<text x='12' y='17.2' font-family='Arial,sans-serif' font-size='13' font-weight='800' fill='#FFFFFF' text-anchor='middle'>C</text></svg>",
    },

    "glossary": {
        "demand": "The quantity of a good buyers are willing and able to buy at each price over a period.",
        "law of demand": "As the price of a good rises, the quantity demanded falls, and vice versa.",
        "demand curve": "The line showing quantity demanded at each price — it slopes downward.",
        "supply": "The quantity of a good sellers are willing to offer at each price over a period.",
        "law of supply": "As the price of a good rises, the quantity supplied rises, and vice versa.",
        "supply curve": "The line showing quantity supplied at each price — it slopes upward.",
        "movement along": "A change in quantity caused by the good's own price changing — the same curve, a new point.",
        "shift": "A change in the whole curve caused by something other than the good's own price.",
        "substitute": "A good bought instead of another; a cheaper substitute pulls demand away from the original.",
        "equilibrium": "The price at which quantity demanded equals quantity supplied and the market clears.",
        "equilibrium price": "The single price where buyers' wants and sellers' offers exactly match.",
        "market clears": "Every unit offered is bought and every buyer is served — no surplus, no shortage.",
        "surplus": "When the price is above equilibrium: sellers offer more than buyers want, so the price falls.",
        "shortage": "When the price is below equilibrium: buyers want more than sellers offer, so the price rises.",
        "price ceiling": "A legal maximum price; set below equilibrium it creates a lasting shortage.",
        "price floor": "A legal minimum price; set above equilibrium it creates a lasting surplus.",
        "input costs": "What it costs to produce a good — maize, fuel, power, labour; higher costs shift supply left.",
    },

    "closer_html": "You now have the engine: two curves, one meeting point, and a drill for reading any change &mdash; which curve, which way, what happens to price and quantity. Play with the slider until a shortage and a surplus feel obvious, then bring your load-shedding answer to the channel. From here the course zooms in: first on <i>how much</i> quantity responds to price (elasticity), then on the buyer and the seller each in turn.",
    "next_line": "NEXT: 2.1 — ELASTICITY: HOW MUCH QUANTITY RESPONDS TO PRICE",

    "calculator_js": SD_LAB_JS,
    "voice_agent_id": None,
}
