"""ECN 1115 Microeconomics — Step 1.1: What Economics Studies (web step).

Foundations. Universal intro material — scarcity, opportunity cost, marginal
thinking, how markets coordinate, and how economists frame an argument. Written
without the UNZA lecture files (gitignored/local-only); Foundations is the one
step whose content doesn't depend on them. Numbering follows the provisional
plan in COURSE-PREP.md — confirm against the ECN 1115 syllabus before the
source-heavy steps.

Build:  python3 _dev/step-generator/generate_step.py "Schools/UNZA/ECN 1115 — Microeconomics/01-foundations/sources/content_mic_1_1.py"
"""

STEP = {
    "slug": "mic-1-1",
    "course": "Microeconomics",
    # Free intro step: Foundations is the course's front door — open to any
    # signed-in student, no plan required. It also doubles as the lead magnet
    # (a full step, not a teaser) and the easiest way to see the reading
    # experience end to end. Later micro steps default to members.
    "access": "public",
    "page_title": "Step 1.1 · What Economics Studies — Booklesss",
    "course_chip": "ECN 1115 · UNZA",
    "eyebrow": "Microeconomics · Lesson 1 · Step 1.1",
    "title_html": "What Economics\nStudies",
    "standfirst_html": "Scarcity is the one fact behind the whole subject: there is never enough to go round, so every choice gives something up. Once you can price that trade-off and think one unit at a time, the rest of microeconomics is machinery built on this step.",
    "meta": {"minutes": 9, "sections": 5, "examples": 3},

    "sources": {
        "inv": {"domain": "investopedia.com", "label": "Investopedia", "mono": "I", "color": "#121212"},
        "core": {"domain": "core-econ.org", "label": "CORE Econ", "mono": "C", "color": "#0057B8"},
    },

    "sections": [
        {"eyebrow": "Foundations", "title": "Scarcity: Why You Have to Choose", "blocks": [
            {"t": "p", "html": "Economics is the study of how people use limited resources to satisfy wants that are effectively unlimited {src:inv:https://www.investopedia.com/terms/s/scarcity.asp}. Strip away the graphs and that single sentence is the whole discipline. The tension inside it &mdash; limited resources, unlimited wants &mdash; is called <b>scarcity</b>, and it is the reason economics exists at all."},
            {"t": "p", "html": "Scarcity does not mean poverty. It means there is never enough of everything for everyone to have all they want. Time is scarce &mdash; a day has 24 hours whether you are a student or the President. Money is scarce. Land, skilled labour, and ZESCO power are scarce. Even a wealthy person runs into scarcity: they cannot be in two places at once."},
            {"t": "h3", "text": "The economising problem"},
            {"t": "p", "html": "Because resources are scarce, using them one way means not using them another. That is the <b>economising problem</b>: not how to get more of everything, but how to get the most out of what there is."},
            {"t": "p", "html": "Picture a first-year student with K500 for the month, who needs data for coursework, transport to campus, and food. Spend it all on data and you cannot get to lectures. Spend it all on transport and you go hungry. Every kwacha committed one way is a kwacha unavailable for another. Nothing about this is greed &mdash; it is arithmetic. That constraint, faced by every person, firm, and government, is what economics is built to reason about."},
            {"t": "callout", "tag": "The four resources", "icon": "bulb", "html": "Economists group scarce resources &mdash; the <b>factors of production</b> &mdash; into four kinds: <b>land</b> (natural resources, from copper to farmland), <b>labour</b> (human effort and skill), <b>capital</b> (tools, machines, buildings), and <b>enterprise</b> (the willingness to combine the others and carry the risk). Every good you can name is made by mixing these four."},
        ]},

        {"eyebrow": "The core idea", "title": "Opportunity Cost — The Real Price of Anything", "blocks": [
            {"t": "p", "html": "If every choice gives something up, then the true cost of a choice is what you gave up to make it. Economists call this the <b>opportunity cost</b>: the value of the next best alternative you did not choose {src:inv:https://www.investopedia.com/terms/o/opportunitycost.asp}. It is the most important idea in this step, and it runs through every lesson that follows."},
            {"t": "p", "html": "Opportunity cost is often larger than the money price. The real cost of a year studying full-time at UNZA is not only the fees and books &mdash; it is also the salary you could have earned working that year. No one sends you a bill for the forgone salary, but it is a genuine part of what the year costs you. Leave it out and you have understated the price of your degree."},
            {"t": "h3", "text": "Even free things have a cost"},
            {"t": "p", "html": "A queue that costs no money still costs time. Waiting three hours at a clinic for a &ldquo;free&rdquo; consultation costs you three hours you could have spent earning, studying, or resting. When ZESCO cuts power to a welding shop for eight hours, the shop&rsquo;s opportunity cost is the orders it could not complete &mdash; real output lost, appearing on no invoice. Money price and opportunity cost are not the same number, and the gap between them is where clear thinking pays off."},
            {"t": "callout", "tag": "Exam tip", "icon": "medal", "html": "When asked for the cost of a decision, give the <b>next best alternative forgone</b> &mdash; not the sum of everything you did not do. If a farmer uses a field for maize, the opportunity cost is the soya he could have grown there instead (the best alternative), not maize plus soya plus grazing all added together."},
            {"t": "discuss", "html": "A friend says football practice is free because the pitch charges nothing to use. Using opportunity cost, explain what those two hours of practice actually cost him &mdash; and describe a situation where that cost would be high enough that skipping practice is the rational choice."},
        ]},

        {"eyebrow": "How economists decide", "title": "Thinking at the Margin", "blocks": [
            {"t": "p", "html": "People rarely face all-or-nothing choices. You do not decide between &ldquo;study&rdquo; and &ldquo;never study&rdquo; &mdash; you decide whether to study for <i>one more hour</i>. Firms do not choose between producing and closing down &mdash; they choose whether to make <i>one more batch</i>. Economists call these <b>marginal</b> decisions, and comparing costs and benefits at the margin is how rational choices actually get made {src:core:https://www.core-econ.org/the-economy/}."},
            {"t": "p", "html": "A marginal decision weighs the <b>marginal benefit</b> &mdash; the extra gain from one more unit &mdash; against the <b>marginal cost</b> &mdash; the extra cost of that unit. Zambeef deciding whether to slaughter one more batch of cattle this week does not reconsider the entire business; it asks whether the extra revenue from that batch beats the extra cost of producing it. A boarding student deciding whether to revise one more hour weighs the extra marks against the sleep given up."},
            {"t": "formula", "html": 'Do it while:   marginal benefit  <span class="op">&ge;</span>  marginal cost\n\nStop when:     marginal benefit  <span class="op">=</span>  marginal cost'},
            {"t": "p", "html": "That one rule &mdash; keep going while the extra benefit covers the extra cost, stop where they meet &mdash; reappears in every later lesson, whether the decision is how much to buy, how much to produce, or how many workers to hire. If you take one habit from this step, make it the habit of asking &ldquo;what does <i>one more</i> cost, and what does it give me?&rdquo;"},
        ]},

        {"eyebrow": "Coordination", "title": "What a Market Does", "blocks": [
            {"t": "p", "html": "A <b>market</b> is any arrangement that brings buyers and sellers together to trade. Soweto Market, an MTN airtime kiosk, the fuel station forecourt, and the Lusaka Securities Exchange are all markets. They look nothing alike, but each does the same job: it lets people who want to buy find people who want to sell, and settle on a price."},
            {"t": "p", "html": "Here is the striking part. No official plans how much charcoal Lusaka needs each day, yet roughly the right amount arrives &mdash; not so much that it rots unsold, not so little that most households go without. No committee coordinates the thousands of traders, transporters, and buyers involved. <b>Prices</b> do the coordinating."},
            {"t": "h3", "text": "A price is a signal and an incentive"},
            {"t": "p", "html": "When poor rains cut the tomato harvest, tomatoes become scarcer and their price rises. That higher price does two things at once. It tells buyers to economise &mdash; use fewer, switch to something else &mdash; and it tells farmers and traders that tomatoes are worth bringing to market, so more of them do. The shortage starts to correct itself, with no one in charge. A price carries information about scarcity and hands out incentives to act on it, all in one number."},
            {"t": "p", "html": "That is a first look at <b>supply and demand</b> &mdash; the engine that sets prices and quantities in every market, and the subject of the next step. It is worth saying now that markets do not always get it right: pollution, and single sellers like ZESCO, are cases where the price leaves something out. Those are lessons of their own later in the course."},
        ]},

        {"eyebrow": "Framing the subject", "title": "Micro vs Macro, Positive vs Normative", "blocks": [
            {"t": "p", "html": "Two distinctions tell you what kind of question you are dealing with, and both matter for how you answer exam questions cleanly."},
            {"t": "h3", "text": "Microeconomics vs macroeconomics"},
            {"t": "p", "html": "<b>Microeconomics</b> studies the individual pieces &mdash; a single consumer, one firm, one market for one good. <b>Macroeconomics</b> studies the whole economy at once: national output, inflation, unemployment, the exchange rate. This course, ECN 1115, is micro. We stay at the level of households, firms, and single markets &mdash; how a shopper spends K500, how a bakery sets its output, how the maize market clears &mdash; and leave the economy-wide picture to macro."},
            {"t": "h3", "text": "Positive vs normative statements"},
            {"t": "p", "html": "A <b>positive</b> statement is about what <i>is</i>, and can be tested against evidence: &ldquo;a rise in the fuel price reduces the quantity of fuel bought.&rdquo; True or false, the facts can settle it. A <b>normative</b> statement is about what <i>ought</i> to be, and rests on values: &ldquo;the government should subsidise fuel.&rdquo; No amount of data settles it, because it turns on a judgement about what is fair or desirable. Economics can resolve positive questions with evidence; normative ones need an argument about values as well. Keep them apart, and you will always know whether a disagreement is about facts or about what we should want."},
            {"t": "discuss", "html": "Sort these two into positive and normative, and say how you would settle each: (a) &ldquo;Raising the price of mealie meal reduces the amount households buy.&rdquo; (b) &ldquo;Mealie meal should be kept cheap so no family goes hungry.&rdquo; Where does the disagreement between two people arguing about (b) really lie?"},
        ]},
    ],

    "outcomes": [
        "Explain scarcity and why it forces every person, firm, and economy to choose",
        "Identify the four factors of production and give a Zambian example of each",
        "Define opportunity cost and find the true cost of a decision beyond its money price",
        "Apply marginal thinking — compare marginal benefit and marginal cost — to a simple decision",
        "Explain how prices coordinate a market and act as both signal and incentive",
        "Distinguish microeconomics from macroeconomics, and positive from normative statements",
    ],

    "sources_list": [
        {"src": "inv", "href": "https://www.investopedia.com/terms/s/scarcity.asp", "label": "Scarcity — Definition"},
        {"src": "inv", "href": "https://www.investopedia.com/terms/o/opportunitycost.asp", "label": "Opportunity Cost — Definition"},
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
        "economics": "The study of how people use limited resources to satisfy effectively unlimited wants.",
        "scarcity": "The central fact of economics: there is never enough of everything for everyone to have all they want.",
        "economising problem": "How to get the most out of scarce resources — not how to get more of everything.",
        "factors of production": "The four scarce resources used to make goods: land, labour, capital, and enterprise.",
        "land": "The factor of production covering natural resources — from copper and farmland to water.",
        "labour": "The human effort and skill used in production.",
        "capital": "Tools, machines, and buildings used to produce other goods — not money itself.",
        "enterprise": "The willingness to combine land, labour, and capital and carry the risk of production.",
        "opportunity cost": "The value of the next best alternative given up when a choice is made.",
        "marginal": "Relating to one more (or one less) unit — the level at which economists analyse most decisions.",
        "marginal benefit": "The extra benefit gained from one more unit of something.",
        "marginal cost": "The extra cost incurred from producing or consuming one more unit.",
        "rational choice": "Doing something as long as its marginal benefit is at least its marginal cost.",
        "market": "Any arrangement that brings buyers and sellers together to trade.",
        "price signal": "A price acting as information about scarcity and an incentive to respond to it.",
        "supply and demand": "The interaction of buyers and sellers that sets price and quantity in a market.",
        "microeconomics": "The study of individual parts of the economy — one consumer, one firm, one market.",
        "macroeconomics": "The study of the economy as a whole — output, inflation, unemployment, exchange rates.",
        "positive statement": "A claim about what is, which can be tested against evidence.",
        "normative statement": "A claim about what ought to be, which rests on values and cannot be settled by data alone.",
    },

    "closer_html": "Every idea after this one &mdash; demand curves, costs, monopoly, the lot &mdash; is built from scarcity, opportunity cost, and thinking at the margin. Get comfortable spotting the trade-off in an everyday choice and you will read the rest of the course as machinery, not memorisation. The tomato example at the end of section four is the thread we pull next: how buyers and sellers together set the price.",
    "next_line": "NEXT: 1.2 — MARKETS: SUPPLY, DEMAND &amp; HOW A PRICE IS SET",

    "calculator_js": "",
    "voice_agent_id": None,
}
