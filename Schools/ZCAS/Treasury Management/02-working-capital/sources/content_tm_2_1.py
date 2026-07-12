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
            <svg class="ccc-ic" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path fill="#18181B" d="M15.5135 7.43674c.3405.13551.6971.22635 1.061.27025.3532.02512.7077.02512 1.0609 0 .0726-.0026.1414-.03327.1918-.08555.0504-.05227.0785-.12208.0785-.19471 0-.07167-.0285-.14041-.0792-.19109-.0506-.05068-.1194-.07915-.1911-.07915-.335-.00421-.6694-.03096-1.0009-.08008-.3072-.05162-.6066-.14244-.8908-.27024-.552-.16983-1.0181-.54436-1.3028-1.04683-.2848-.50246-.3665-1.09481-.2286-1.65562.1996-.67947.5801-1.29187 1.101-1.77161.7411-.767 1.7389-1.23384 2.8026-1.31118 1.7716-.080077 2.7825 1.47133 2.9026 3.00272.073.39703.0609.80502-.0355 1.19702s-.275.75907-.5238 1.07695c-.2488.31789-.5622.57934-.9196.76708-.3574.18773-.7505.29749-1.1535.322-.0832.00516-.1611.04255-.2171.10422-.0561.06167-.0859.14277-.0831.22607.0075.0823.0456.15879.1067.21438.0612.05559.1409.08624.2236.0859 2.4822-.01001 3.5932-2.01183 3.5031-4.01364.016-.51334-.07-1.02475-.253-1.50463-.183-.47988-.4593-.91869-.8131-1.29104-.3537-.372349-.7778-.670837-1.2476-.878184C19.1357.122429 18.6294.0103405 18.1159 0c-1.1039.0678833-2.1566.488979-3.0027 1.20109-.8679.69038-1.4779 1.65295-1.7316 2.73248-.155.7454-.021 1.52184.3748 2.17221.3958.65037 1.0239 1.12611 1.7571 1.33096Z"></path><path fill="#c5613f" d="m5.87485 21.3894-3.07279-.4905c-.25023-.05-.65059-.06-1.00091-.1301-.1505-.014-.29507-.0656-.42038-.1501-.16391-.1832-.26248-.4155-.28025-.6606-.07142-.461-.07142-.9303 0-1.3913l.36033-1.6815c.06005-.2502.11009-.8107.20018-1.3512.03215-.2248.08577-.446.16014-.6606 0-.0701.1101-.1201.08007-.1602.31699-.1316.65774-.1963 1.00091-.1901.26802.0004.53564.0205.80073.06l-.45041 1.8016c-.09239.2701-.15941.5483-.20018.8308-.01853.1936.01973.3883.1101.5605.22579.2851.51338.5153.84108.673.32769.1578.68693.2391 1.05063.2378.36385.0573.73618.0253 1.0849-.0932.34873-.1186.66341-.3202.91692-.5874.23115-.3799.37158-.8081.41037-1.2511.06627-.592.06627-1.1896 0-1.7816h.82074l.06006-.6907h-.18017c-1.0009-.1401-1.8817-.1801-3.18288-.4203-.65971-.1496-1.32836-.2566-2.00182-.3203-.50951-.0282-1.01892.0573-1.49135.2502-.27588.1508-.48359.4015-.580524.7006-.186217.7003-.323341 1.4126-.410372 2.132-.090081.3503-.170154.7106-.240218 1.0709-.070063.3604-.080072.4905-.110099.7407-.0940738.5633-.0940738 1.1383 0 1.7016.082359.4426.311566.8446.650589 1.141.193903.1461.420754.2424.660604.2802.41037.0701.92083.0501 1.23111.0801.83075.0801 1.30118.1001 1.85168.1501.34031 0 .71064.0701 1.22111.1502.06943.0044.13805-.0171.1925-.0604.05444-.0433.09082-.1054.10206-.174.01124-.0687-.00347-.1391-.04127-.1975-.03779-.0584-.09597-.1007-.16321-.1186h.02002ZM4.14328 16.555l.19017-1.9017.49044.07c.80073.1001 1.42129.1402 2.00182.1802-.00564.0365-.00564.0736 0 .1101.01489.5374-.03213 1.0748-.14013 1.6015-.05623.3071-.18681.5957-.38034.8407-.06006.0801-.19018.1001-.32029.1301-.26539.063-.53962.0799-.81074.0501-.27508-.015-.54572-.0759-.80073-.1802-.1201-.05-.24021-.0801-.29026-.1601-.00645-.2484.01368-.4967.06006-.7407Z"></path><path fill="#18181B" d="M23.761 21.5295c-.6204-1.1468-1.3124-2.2533-2.0719-3.313-.1407-.2567-.2515-.5288-.3303-.8107-.0542-.2101-.0542-.4305 0-.6406.2637-.6492.4746-1.3187.6306-2.0018.0617-.9556-.0057-1.915-.2002-2.8526-.1695-.9278-.4311-1.8365-.7807-2.71246-.0122-.03987-.0326-.07676-.0599-.10832-.0272-.03156-.0607-.0571-.0984-.07499-.0377-.01789-.0786-.02774-.1203-.02892-.0417-.00118-.0832.00633-.1218.02205-.0777.03125-.1401.09172-.1738.16843-.0337.07671-.036.16357-.0063.24195.3301.84076.5749 1.71256.7306 2.60236.1573.8782.201 1.773.1301 2.6624-.1701.6307-.391 1.2466-.6606 1.8417-.1088.3464-.1294.7145-.06 1.0709.0895.3467.217.6824.3803 1.001.7098 1.0438 1.355 2.1301 1.9318 3.2529.0977.2411.1221.5058.07.7607-.0141.0894-.0537.1729-.1141.2403-.0603.0675-.1389.1161-.2262.14-.338.0855-.6959.039-1.0009-.1301-.5484-.294-1.0372-.6878-1.4413-1.161-.8578-.8599-1.5379-1.8802-2.0018-3.0028-.4511-1.114-.6559-2.3125-.6005-3.5131v-1.6615c-.0102-.385-.0402-.7692-.0901-1.1511-.0447-.2893-.1151-.574-.2102-.8508-.0359-.0827-.0909-.1559-.1605-.2133-.0696-.0574-.1518-.0975-.2399-.117-.6329-.1049-1.2788-.1049-1.9117 0-1.3412.2102-2.8126.7107-4.0036.7807-.2194.018-.4401-.0058-.6506-.07l.06-.6006c.1101-.09.2302-.1901.3904-.3002l1.2511-.6006 2.0819-.87076c.5505-.20018 1.091-.39036 1.6415-.5505.5528-.16403 1.1141-.29769 1.6815-.40037.0757-.0146.1424-.05865.1856-.12247.0432-.06382.0592-.14218.0446-.21783-.0146-.07566-.0586-.14242-.1225-.18559-.0638-.04317-.1421-.05922-.2178-.04462-.5901.09157-1.1749.21519-1.7516.37033-.5705.16015-1.131.3303-1.6915.53048l-2.172.83076-1.111.57047c.1602-1.8116.2603-3.61323.4905-5.41486.0044-.06944-.0171-.13806-.0604-.19251-.0434-.05444-.1054-.09082-.1741-.10206-.0686-.01124-.139.00347-.1974.04127-.0585.0378-.1007.09597-.1186.16321-.4104 2.00182-.77074 4.00363-1.00094 6.00545-.81074 6.596-.26024 3.6033-.7707 8.4977-.48269.0101-.94937.175-1.33121.4704-.45907.3617-.7719.8772-.8808 1.4513-.06735.2771-.0691.566-.0051.8439.06399.2778.19196.5369.37371.7565.18176.2197.41229.3939.67323.5088.26095.1148.54511.1672.82986.1529.0363.0041.07306.0009.10806-.0096.03501-.0105.06752-.0279.09559-.0513.02807-.0234.0511-.0522.06771-.0848.0166-.0325.02644-.0681.02891-.1045.00561-.0728-.0174-.1449-.06413-.201-.04673-.0561-.1135-.0917-.1861-.0993-.18049-.0045-.3574-.0514-.51641-.1369-.15902-.0856-.29569-.2073-.39897-.3554-.10327-.1481-.17027-.3184-.19556-.4972-.02529-.1787-.00816-.361.04998-.5319.08972-.3469.30292-.6491.59961-.8499.29668-.2009.65647-.2866 1.01185-.2411.30075.0492.5747.2024.77408.4329.19937.2304.31153.5236.31693.8283.0801.6305-.18018 1.2911-1.00092 1.3212-.08251.0023-.16114.0355-.22042.0929-.05927.0574-.09491.135-.09987.2173-.00005.0833.03232.1633.09024.2231.05792.0597.13684.0946.22004.0972.26139.0197.52385-.02.7678-.1159.24393-.0959.46313-.2457.64113-.4381.178-.1925.3102-.4226.3869-.6733.0767-.2507.0957-.5154.0558-.7745-.0029-.4766-.1538-.9406-.4316-1.3278-.2779-.3873-.66917-.6787-1.11976-.8341.32696-1.8083.60388-3.6233.83076-5.445 0-.3903.0801-.7807.1201-1.171.2513.066.5112.093.7707.08 1.1811 0 2.6824-.4904 4.0637-.6606.4551-.0596.9161-.0596 1.3712 0v.3804c.0388.3322.0589.6664.0601 1.0009v1.6014c-.0739 1.3125.1308 2.6258.6005 3.8535-.0595-.0252-.1251-.033-.1889-.0224-.0638.0107-.1233.0393-.1714.0825-.2813.2693-.533.5679-.7507.8908-.2213.3482-.3742.7355-.4504 1.141-.058.3987-.1416.7932-.2502 1.1811-.0501.1802-.1101.3503-.2302.4104-.3704.2002-.6006.1601-.7507-.0501-.3008-.6224-.4352-1.312-.3904-2.0018-.0999-1.0152.0231-2.04.3604-3.0027.375-.9501 1.0012-1.7805 1.8116-2.4022.053-.0461.0867-.1105.0945-.1803.0077-.0699-.011-.1401-.0526-.1967-.0415-.0567-.1028-.0957-.1718-.1093-.0689-.0136-.1404-.0008-.2004.0359-.9693.6194-1.7514 1.4915-2.262 2.5223-.448 1.0727-.6498 2.2321-.5906 3.3931-.0247.8897.1859 1.7701.6106 2.5523.1093.155.2497.2857.4121.3837.1625.098.3435.1613.5317.1857.1881.0245.3793.0096.5614-.0436.1821-.0532.3512-.1436.4966-.2656.2685-.1751.4641-.4419.5505-.7507.1308-.5015.2146-1.0142.2502-1.5314.0325-.3191.1277-.6286.2803-.9108.168-.2926.3695-.5647.6005-.8107.0363-.0309.061-.0733.0701-.1201.5113 1.1134 1.2124 2.1294 2.0719 3.0027.5058.5545 1.1055 1.0153 1.7716 1.3612.5233.2537 1.1214.3071 1.6815.1502.2058-.0585.3952-.164.5532-.3082.1581-.1441.2805-.323.3576-.5226.1727-.5053.1585-1.0557-.04-1.5514Z"></path></svg>
            <span class="ccc-term">Days Inventory</span>
            <span class="ccc-sub">cash stuck in stock</span>
          </div>
          <span class="ccc-op" aria-hidden="true">+</span>
          <div class="ccc-node">
            <svg class="ccc-ic" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path fill="#c5613f" fill-rule="evenodd" d="M14.6697 12.8194c-.1507.1516-.1507.3965 0 .5481.6415.5534 1.4552.8669 2.3021.8871 0 .2392 0 .4883.0698.7274 0 .2992.3239.4863.5831.3367.1202-.0694.1943-.1978.1943-.3367v-.7075c.2625-.0245.5226-.0712.7773-.1395 1.1714-.2439 1.8904-1.4299 1.5647-2.5812-.1245-.5336-.5292-.9574-1.0564-1.1063-.3618-.0879-.735-.1182-1.1063-.0896V9.10214c.344.02582.681.1101.9967.24908.1681.08082.3702.015.4583-.14949.0882-.1651.0257-.3703-.1394-.45836-.4239-.22337-.882-.375-1.3554-.44847V6.83979c.0175-.18928-.1199-.35775-.3089-.37867-.1875-.01735-.353.12143-.3688.30888-.0997.47837-.1694.99663-.2591 1.4651-.256.00571-.5103.04245-.7574.10959-.9301.165-1.5367 1.07021-1.3354 1.99321.0516.5389.4082 1.0003.9168 1.186.2824.0954.5789.1426.877.1395v.4484c0 .4186.0797.8173.1295 1.2258-.6.029-1.1916-.1506-1.6743-.5082-.1434-.129-.3598-.1333-.5082-.01Zm3.9864-1.1759c.1495 0 .2791.0598.3289.2292.2392.7275-.3488 1.1361-1.0564 1.3255l.0597-1.0964v-.4783c.2226-.0231.4471-.0165.6678.02Zm-2.5513-1.5448c-.1395-.56809.2791-.83717.7873-.99656 0 .15939-.0598.30888-.0797.46837-.0199.15949 0 .50829-.0499.75749-.1126.0099-.226.0099-.3387 0-.1396 0-.2791-.0499-.319-.2293Z" clip-rule="evenodd"></path><path fill="#18181B" fill-rule="evenodd" d="M22.7023 6.57073c-.1196-1.89357-.3189-3.77714-.6279-5.700611-.0137-.060715-.0449-.116123-.0897-.159388s0 0 0-.059796c-.1314-.169898-.3738-.205204-.5482-.079796-.3387.239184-.8769.747451-1.4052 1.136121-.5282.38867-.259.56806-1.9931-1.076325-.1521-.160714-.3152-.310612-.4884-.448469-.174-.1233678-.3976-.1531637-.5979-.079694-.3094.124285-.5859.318775-.8073.568061-.3987.408567-.7773.996637-1.0763 1.285607-.3746-.50295-.7913-.973056-1.2457-1.405199-.3888-.406633-.9466-.6061224-1.5049-.5381632-.3463.0812245-.6613.2612242-.907.5182652-.4034.467041-.7763.959797-1.1162 1.474897-.1227.20378-.2897.37745-.48826.50827-.12959-.14949-.25918-.35878-.28908-.38868L7.4542.351955c-.13367-.122551-.3401-.118163-.46837.009898-.12826.128062 0 .059796 0 .079796-.11816.05847-.19469.177143-.19928.308878 0 2.302243 0 4.604383.06969 6.906533v4.55444c0 .9468 0 1.8836-.12949 2.8404-.02459.1829.09776.3533.27898.3886.1849.0189.35357-.1065.38868-.289.39867-1.906.62551-3.8438.67775-5.79026 0-1.15602 0-2.32214-.10969-3.47816.02-1.465-.17939-2.88021-.32888-4.3851L8.8893 2.77369c.16511.20867.34143.40837.52827.59796.12469.11184.29245.16286.45837.13949.33426-.06255.64266-.22194.88706-.45847.3617-.3552.695-.73847.9965-1.14602.2592-.28908.4884-.58806.7774-.62786.0798 0 .1494.0498.2192.09959.1552.10786.2988.23143.4286.36878.5781.58806 1.1261 1.38531 1.475 1.66439.2989.17357.6766.12887.9268-.1097l.3986-.45836c.2891-.31898.6479-.91694.9967-1.34551.0411-.05766.0878-.11102.1394-.15939.0298.04847.0668.09214.1097.12949.1694.13959.7873.91694 1.2457 1.29561.2052.19051.4685.30633.7475.32888.3865-.06541.7481-.23408 1.0464-.48837.3788-.29898.7575-.66765 1.0964-.99653.1593 1.68428.269 3.33857.2989 4.98296 0 1.87367 0 3.74727-.1296 5.66067-.0598 1.4451-.1196 2.9201-.2989 4.3652-.1105.9364-.3074 1.8605-.588 2.7606-.3356.9384-.9829 1.7335-1.8338 2.2523-.7707.5731-1.8169.6049-2.6211.0797-.3844-.2878-.6896-.6684-.8869-1.1062-.3143-.7212-.5095-1.4886-.5781-2.2723-.026-.2124-.2152-.3664-.4286-.3487-.0882.0109-.1697.0533-.2292.1195.1613-.1679.331-.3276.5083-.4783.2633-.1422.274-.516.0192-.673-.1529-.0941-.3502-.0713-.4777.055-.3886.2592-.9965.8572-1.5446 1.2358l-.2591.1794c-.1319-.1293-.2753-.246-.4286-.3488-.5152-.5769-1.0643-1.1227-1.6444-1.6344-.26438-.2168-.59499-.3364-.93682-.3388-.32378.0613-.62205.2173-.85705.4484-.40928.435-.77938.9054-1.10622 1.4053-.23918-.2591-.51826-.6777-.81724-.9967-.20786-.2256-.46796-.3966-.75745-.4982-.18541-.0569-.38653-.0276-.54806.0796-.15684.1244-.30347.2611-.43858.4087l-1.12612 1.455-.17939-.0997-1.85367-1.3454c-.13245-.0828-.30541-.0575-.40867.0598h-.0498c-.04612.0531-.07408.1194-.07969.1894l.10959 2.7407c.09949 1.3443.84173 2.558 1.99326 3.2589 1.11776.6368 2.40909.9021 3.68735.7573.54816-.0498 1.58469-.0697 2.80051-.1096 1.21585-.0398 2.92005-.1394 4.28545-.2291 1.6005-.1314 3.1914-.3611 4.7637-.6877 1.4593-.5499 2.6227-1.6844 3.2091-3.1294.3349-.9699.5687-1.9718.6976-2.9898.1773-1.4884.2705-2.9858.279-4.4847.0199-1.9633-.0697-3.8569-.2092-5.76037ZM14.9587 22.5861H9.26808c-1.06643 0-1.99327 0-2.48153.0598-1.02112.1577-2.06592-.006-2.9899-.4683-.89122-.4709-1.51337-1.3287-1.68418-2.3222l-.21929-1.8138.0698.0598c.33877.299.65775.608.99653.9169 0 0 .28908.309.39867.4087.12817.1197.31082.1616.47837.1095.22061-.0822.41867-.2154.57806-.3886.39857-.3787.89694-1.0764 1.18592-1.3055l.99663 1.1361s.27898.2791.38867.3787c.28541.2493.71113.2493.99654 0 .19938-.1993.66775-.887 1.14612-1.445.12694-.1578.26694-.3045.41857-.4386.02837-.0216.05204-.0488.06979-.0797.63325.4386 1.22385.9357 1.76395 1.4849.1789.184.3686.357.5681.5183.1135.0879.2555.1306.3987.1195.3696-.0829.7124-.2577.9965-.5082.299-.2492.598-.5482.887-.8272-.062.0751-.0908.1723-.0798.2691.048.8781.2364 1.7429.5582 2.5612.2455.5841.6326 1.0978 1.1261 1.4949l.0997.0698c-.4185-.01-.6976.0099-.9766.0099Z" clip-rule="evenodd"></path><path fill="#c5613f" fill-rule="evenodd" d="M11.8491 5.16553c-.3456-.07439-.6948-.13092-1.0464-.16939h-.4583c-.1559-.0152-.3127-.0152-.46852 0-.34561.10511-.67949.24541-.99653.41858-.24704.1052-.28745.43847-.07275.59969.0502.03786.10979.06133.17234.06796.34888 0 .65776.10969.99664.13959h.41852l.4286-.0499.9966-.22918c.2169.01143.3989-.16153.3986-.37867.0006-.20909-.1603-.38296-.3688-.39868Z" clip-rule="evenodd"></path><path fill="#c5613f" fill-rule="evenodd" d="M10.8527 7.35808c-.1857-.0152-.3724-.0152-.5581 0-.44553.10827-.88472.24133-1.31553.39868-.26082.01908-.40306.31347-.25602.52979.06816.10041.18479.15674.30592.14786.43847.0698.83714.16939 1.28563.21928.1759.01.3522.01.5281 0 .1791.01562.3591.01562.5382 0 .4385-.05979.8471-.14948 1.2756-.22928.2954.04775.5318-.24214.4254-.52184-.0656-.17234-.2432-.2749-.4254-.24551-.4285-.08969-.847-.17939-1.2856-.22918-.1714-.03225-.3444-.05551-.5182-.0698Z" clip-rule="evenodd"></path></svg>
            <span class="ccc-term">Days Receivables</span>
            <span class="ccc-sub">waiting to be paid</span>
          </div>
          <span class="ccc-op" aria-hidden="true">&minus;</span>
          <div class="ccc-node">
            <svg class="ccc-ic" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path fill="#c5613f" fill-rule="evenodd" d="m14.0224 16.4827-3.5685 2.6488c-.2099.16-.51977.4798-.84963.7097-.10921.1049-.24951.1716-.39983.1899-.40545-.0573-.77921-.2512-1.05953-.5497-.52574-.5251-1.0103-1.0899-1.44938-1.6893-.78965-.9996-1.55932-1.9991-2.299-2.9987-.73968-.9996-1.41938-2.0491-2.0691-3.1186-1.349415-2.1791-1.26945-1.4094-.74968-1.96919.31239-.35336.64621-.68718.99957-.99956.3522-.3117.7227-.60209 1.10952-.86963l1.99913-1.58931.65972-.50978c.15993 0 .32985.17993.50977.33986.24807.23209.48174.47911.6997.73968l.99957 1.19948 3.27857 4.38805c.057.0769.1422.128.2369.1421.0946.014.191-.0101.2679-.0671.0769-.057.128-.1422.142-.2369.0141-.0946-.0101-.191-.067-.2679L9.25442 7.48658l-.94958-1.25946c-.32672-.4288-.70244-.81794-1.11952-1.15949-.26702-.21165-.5989-.32463-.93959-.31987-.18158.03191-.35492.09988-.50978.19992-.23148.14705-.45197.31075-.65971.48979L3.0771 6.91682c-.42981.28988-.83963.58975-1.23946.90961-.39929.33166-.77971.68539-1.139504 1.05954-.241183.23564-.455714.4971-.6397219.77966C.0198865 9.75391 0 9.84919 0 9.94551c0 .09629.0198865.19159.0584141.27989.0955089.2545.2160479.4989.3598439.7297.279878.4698.649722.9296.909602 1.3494.64972 1.0895 1.33942 2.169 2.11908 3.2086.77967 1.0395 1.59931 1.9991 2.44894 2.9987.58143.7462 1.2529 1.4177 1.99913 1.9991.38445.2808.84374.4409 1.31943.4598.27445-.0123.53897-.1063.75967-.2699.35069-.2727.68449-.5664.99959-.8796.6797-.5597 1.3594-1.1395 1.9991-1.6892.4531-.3665.9129-.7264 1.3794-1.0796.0554-.0525.0901-.1232.098-.1991.0078-.0759-.0117-.1522-.0552-.215-.0434-.0627-.1079-.1079-.1818-.1273-.0738-.0194-.1521-.0117-.2208.0217l.03-.05Z" clip-rule="evenodd"></path><path fill="#c5613f" fill-rule="evenodd" d="M8.91444 11.175c-.39203-.384-.90473-.6205-1.45122-.6697-.5465-.0492-1.09319.092-1.54748.3998-.25969.2133-.47269.4778-.62574.777-.15305.2993-.24287.6268-.26387.9622-.0285.3386.02368.6791.15225.9936.12858.3145.3299.594.58743.8156.39667.3082.88723.4705 1.3894.4598.46823.0081.92916-.1167 1.32942-.3598.07276-.0438.12583-.1139.14818-.1959.02234-.0819.01223-.1693-.02823-.2439.0495.0034.09916-.0037.14569-.021.04653-.0172.08887-.0441.12419-.079.21344-.1685.38661-.3825.50692-.6264.1203-.2439.18472-.5115.18855-.7834.00383-.272-.05302-.5413-.16641-.7885-.11339-.2472-.28047-.466-.48908-.6404Zm-.57975 2.309c-.05829.0643-.09058.148-.09058.2348 0 .0869.03229.1706.09058.2349h-.11994c-.31439.1365-.66181.1782-.99957.12-.2942-.0361-.56649-.174-.76967-.3898-.11377-.1371-.19384-.2989-.23377-.4725-.03992-.1736-.0386-.3541.00387-.5271.03146-.3451.19644-.6643.4598-.8896.2277-.1663.50529-.25.78696-.2373.28168.0127.55059.1211.76237.3073.13471.0836.24759.1981.32931.334.08172.1358.12995.2892.14069.4474s-.01631.3167-.07891.4624c-.06261.1457-.15897.2744-.28114.3755Z" clip-rule="evenodd"></path><path fill="#c5613f" fill-rule="evenodd" d="M17.3508 6.40706c-.096-.52346-.2228-1.0408-.3798-1.54933-.1388-.42666-.3196-.83849-.5398-1.22947-.183-.32981-.4667-.59248-.8096-.74967-.2367-.08518-.4903-.1126-.7397-.07997-.4307.07857-.855.18882-1.2694.32986-.0835.01988-.1557.07212-.2007.14523-.045.07311-.0591.16109-.0392.2446s.0721.1557.1452.20068c.0731.04499.1611.0591.2446.03922.3299-.06584.6638-.10926.9996-.12995.1553-.01131.3108.01979.4498.08996.1399.07997.1999.25989.2799.42982.1435.3444.2507.70286.3198 1.06953.1899.55976.3199 1.12951.4598 1.69927.14.56975.3299 1.16949.4898 1.74924s.2499.81964.2499.82964c.08.41981.6197.07996.6597-.52977-.1999-1.02956-.1199-1.52934-.3199-2.55889Z" clip-rule="evenodd"></path><path fill="#18181B" fill-rule="evenodd" d="M23.9681 16.5226c-.0691-.7268-.2407-1.4403-.5097-2.119-.2667-.6871-.645-1.3254-1.1196-1.8892-1.1429-1.3084-2.6729-2.2186-4.3681-2.59889-.3598-.16992-.6297.08999-.6197.51979-.1544.5596-.3938 1.0922-.7097 1.5793-.3824.3071-.841.5047-1.3268.5716-.4859.0669-.9808.0006-1.432-.1918-.2791-.0584-.5695-.0269-.8296.09-.323.1008-.6038.3053-.799.5817-.1951.2765-.2937.6095-.2806.9476-.0015.3121.07.6202.2088.8996.1389.2794.3412.5225.5909.7097.1299.07.3998.1999.7397.3399.7696.3199 1.9991.7397 2.4689.9996-.08.1999.2099.7296.2599.8796.2357.6668.599 1.2813 1.0695 1.8092.1781.2046.4.3665.6491.4738.2492.1073.5193.1571.7903.1459.0954 0 .187-.0379.2544-.1054.0675-.0675.1054-.159.1054-.2544 0-.0955-.0379-.187-.1054-.2545-.0674-.0675-.159-.1054-.2544-.1054-.1613-.0101-.3184-.0557-.46-.1334-.1417-.0778-.2645-.1858-.3597-.3164-.3558-.4632-.6142-.9936-.7596-1.5593-.05-.1799-.07-.7497-.15-.9996-.036-.1386-.1213-.2594-.2399-.3398-.2362-.1516-.4834-.2852-.7396-.3998-.8697-.3999-2.289-.9996-2.6189-1.1995-.0718-.0758-.1274-.1654-.1635-.2633-.0361-.098-.0519-.2022-.0464-.3065-.0089-.0875.0105-.1756.0555-.2512.045-.0756.1132-.1347.1944-.1686.1157-.0206.2341-.0206.3498 0 .4883.048.9789.068 1.4694.06.4405-.0388.867-.1745 1.2489-.3974.3819-.2229.7098-.5275.9601-.8921.3151-.5143.4812-1.106.4798-1.7092 1.372.503 2.5695 1.3916 3.4485 2.5589.3691.4983.6715 1.0427.8996 1.6193.2341.5823.4018 1.1892.4998 1.8092.2295 1.5046.1616 3.0396-.1999 4.518-.0249.0928-.0127.1916.0339.2755.0467.084.1241.1465.216.1743.0914.0246.1889.0122.2712-.0346.0824-.0468.1429-.1241.1686-.2153.5563-1.5555.781-3.2103.6597-4.8579Z" clip-rule="evenodd"></path><path fill="#c5613f" fill-rule="evenodd" d="M14.852 10.0655c-.2899-.99961-.5498-1.99918-.8297-2.99874-.1799-.66971-.3898-1.32943-.5797-1.99914-.1563-.69782-.4086-1.3706-.7497-1.99913-.1128-.19372-.269-.35864-.4563-.48178-.1873-.12314-.4007-.20116-.6232-.22791-.1596-.00957-.3187.02502-.4598.09996-.2553.15332-.5022.32015-.7397.49978L7.97495 4.50787c-.04489.01251-.0865.03468-.12193.06495-.03542.03028-.06381.06793-.08316.11032-.01936.04239-.02921.08849-.02889.13509.00033.0466.01084.09257.03079.13468.01995.04212.04886.07936.0847.10914.03585.02977.07777.05135.12283.06323.04507.01188.09218.01377.13804.00553.04587-.00823.08939-.02638.1275-.05319l2.63887-1.25945c.4498-.2299.5797-.88962.9996.29987.1799.47979.2898.99956.3698 1.28944.3898 1.18948.7697 2.36897 1.1895 3.54846.4198 1.17946.6897 1.60926 1.1395 2.66886.1999.5797.7197.7197.7197.2899-.2099-.6997-.2399-1.1495-.4498-1.8492Z" clip-rule="evenodd"></path></svg>
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
