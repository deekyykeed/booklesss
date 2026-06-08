const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  HeadingLevel, PageNumber, Header, Footer, TableOfContents,
  LevelFormat, BorderStyle
} = require('C:/Users/deeky/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

// Helper: body paragraph (TNR 12pt, 1.5 spacing, justified)
function body(text, opts = {}) {
  const runs = [];
  if (opts.bold) {
    runs.push(new TextRun({ text, font: 'Times New Roman', size: 24, bold: true }));
  } else {
    runs.push(new TextRun({ text, font: 'Times New Roman', size: 24 }));
  }
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, lineRule: 'auto', before: 0, after: 160 },
    children: runs,
    ...opts.paraProps,
  });
}

// Helper: heading 1
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: 'Times New Roman', size: 28, bold: true })],
  });
}

// Helper: heading 2
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: 'Times New Roman', size: 24, bold: true })],
  });
}

// Helper: bullet
function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, lineRule: 'auto', after: 80 },
    children: [new TextRun({ text, font: 'Times New Roman', size: 24 })],
  });
}

// Helper: empty line
function blank() {
  return new Paragraph({
    spacing: { after: 0 },
    children: [new TextRun({ text: '', font: 'Times New Roman', size: 24 })],
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: 'Times New Roman', size: 24 } },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 28, bold: true, font: 'Times New Roman', color: '000000' },
        paragraph: {
          spacing: { before: 320, after: 160 },
          outlineLevel: 0,
        },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 24, bold: true, font: 'Times New Roman', color: '000000' },
        paragraph: {
          spacing: { before: 240, after: 120 },
          outlineLevel: 1,
        },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: 'BBF4302 - Treasury Management Assignment', font: 'Times New Roman', size: 20 })],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Page ', font: 'Times New Roman', size: 20 }),
                new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 20 }),
                new TextRun({ text: ' of ', font: 'Times New Roman', size: 20 }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Times New Roman', size: 20 }),
              ],
            }),
          ],
        }),
      },
      children: [
        // TITLE PAGE
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 2880, after: 480 },
          children: [new TextRun({ text: 'ZCAS University', font: 'Times New Roman', size: 36, bold: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
          children: [new TextRun({ text: 'BBF4302 - Treasury Management', font: 'Times New Roman', size: 28, bold: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
          children: [new TextRun({ text: 'Assignment', font: 'Times New Roman', size: 28, bold: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
          children: [new TextRun({ text: 'Case Study: Zambezi Manufacturing Limited', font: 'Times New Roman', size: 24 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
          children: [new TextRun({ text: 'Student Number: _______________', font: 'Times New Roman', size: 24 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
          children: [new TextRun({ text: 'Due Date: 13th March 2026', font: 'Times New Roman', size: 24 })],
        }),

        // PAGE BREAK before TOC
        new Paragraph({ pageBreakBefore: true, children: [new TextRun('')] }),

        // TABLE OF CONTENTS
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 320 },
          children: [new TextRun({ text: 'TABLE OF CONTENTS', font: 'Times New Roman', size: 28, bold: true })],
        }),
        new TableOfContents('Table of Contents', {
          hyperlink: true,
          headingStyleRange: '1-2',
        }),

        // PAGE BREAK before body
        new Paragraph({ pageBreakBefore: true, children: [new TextRun('')] }),

        // ─── INTRODUCTION ───
        h1('1. Introduction'),
        body(
          'Zambezi Manufacturing Limited (ZML) is a growing manufacturing company based in Lusaka, Zambia, which has recently expanded into neighbouring SADC countries. The treasury department is the financial centre of an organisation, with the key role of safeguarding and stewardship of financial assets and management of liabilities (ZCAS University, 2026a). Treasury staff perform critically important daily liquidity management tasks that help ensure adequate cash resources are available for ongoing operations (ZCAS University, 2026a). This report evaluates ZML\'s current manual treasury system, identifies its weaknesses and associated risks, and makes a case for the adoption of a Treasury Management System (TMS), covering cost justification, implementation options, and the role of internal audit.'
        ),

        // ─── SECTION 1 ───
        h1('2. Evaluation of the Current System'),

        h2('2.1 Weaknesses of ZML\'s Current Manual Treasury System'),
        body(
          'ZML currently relies on spreadsheets and a standard accounting/Enterprise Resource Planning (ERP) system to manage daily cash balances, supplier payments, debt repayments, and short-term investments. While this approach may suffice for a small operation, it presents several critical weaknesses as the company grows.'
        ),
        body(
          'First, the manual system lacks a comprehensive audit trail. According to ZCAS University (2026b), all treasury transactions should result in a clearly defined audit trail that identifies who made a transaction and the date, amount, and accounts impacted. Spreadsheets do not inherently provide this level of traceability, making it difficult to detect or investigate suspicious activity.'
        ),
        body(
          'Second, there is inadequate segregation of duties. In a well-designed treasury function, trading activities must be separated from confirmation activities (ZCAS University, 2026a). In ZML\'s small team, a single employee may initiate, approve, and record transactions, creating a significant control weakness and increasing the risk of fraud.'
        ),
        body(
          'Third, the existing system offers no real-time cash visibility. A treasurer\'s overriding obligation is to ensure that the company has adequate cash to fund operations (ZCAS University, 2026b). Without multibank balance reporting and automated cash pooling, ZML\'s treasury team cannot make timely, informed decisions about cash deployment or short-term borrowing.'
        ),
        body(
          'Fourth, the manual system is ill-equipped to support ZML\'s SADC expansion. Managing foreign exchange (FX) transactions and intercompany settlements across multiple currencies requires specialised tools that spreadsheets simply cannot provide (Bragg, 2010).'
        ),
        body(
          'Fifth, the system offers no automated warning indicators. A robust treasury system should automatically notify users if transaction confirmations have not been received, hedging policies are violated, or cash balances turn negative (ZCAS University, 2026b). The absence of such alerts exposes ZML to operational errors going undetected for extended periods.'
        ),

        h2('2.2 Risks of Continuing with Manual Processes'),
        body(
          'The risks associated with ZML\'s continued reliance on spreadsheets and manual processes are multifaceted and potentially severe.'
        ),
        body(
          'Financial misstatement risk is particularly significant. Spreadsheet errors, such as broken formulas or incorrect data entry, can lead to inaccurate financial reports. A single formula error in a critical spreadsheet can have material consequences for reported figures, which may mislead management and external stakeholders (Gitman & Zutter, 2012).'
        ),
        body(
          'Fraud risk is also elevated. Without system-enforced segregation of duties, approval workflows, and audit trails, it is relatively straightforward for a dishonest employee to manipulate records without detection. This mirrors the circumstances that led to the Barings Bank collapse due to unchecked treasury activity (ZCAS University, 2026a).'
        ),
        body(
          'Regulatory and reputational risk is another concern. As ZML\'s internal audit report has already warned, weaknesses in internal controls could expose the company to regulatory scrutiny. In an era of increasing financial governance requirements, failure to maintain adequate controls can result in regulatory sanctions, fines, and lasting reputational damage.'
        ),
        body(
          'Finally, operational risk arising from cash flow mismanagement remains a constant threat. Without accurate cash forecasting tools, ZML may face unexpected cash shortfalls that disrupt day-to-day operations or force costly short-term borrowing. As ZML continues to grow and operate across borders, these risks will only intensify.'
        ),

        // ─── SECTION 2 ───
        h1('3. Benefits of a Treasury Management System'),

        h2('3.1 Improving Efficiency in Treasury Operations'),
        body(
          'A Treasury Management System (TMS) is a software application that automates the process of managing a company\'s financial operations (ZCAS University, 2026b). For ZML, the adoption of a TMS would bring substantial efficiency improvements across the entire treasury function.'
        ),
        body(
          'A key efficiency benefit is the minimisation of data entry. A well-designed TMS should never require manual entry of a transaction into the system more than once and should ideally involve automated data collection and posting (ZCAS University, 2026b). This significantly reduces the time treasury staff spend on rote data entry tasks, freeing them to focus on value-adding activities such as financial analysis and risk management.'
        ),
        body(
          'A TMS also provides integrated, real-time information by pulling data from multiple sources, including banks and ERP systems. This yields a comprehensive, real-time view of ZML\'s cash position across all accounts, which is the treasurer\'s overriding obligation to maintain (ZCAS University, 2026b). Features such as multibank balance reporting, cash pooling management, cash forecasting, and automated debt management would directly address the shortcomings identified in ZML\'s current system.'
        ),
        body(
          'Workflow processing is another major efficiency gain. Where supervisory approval is required, a TMS electronically routes transactions to the correct supervisor for approval (ZCAS University, 2026b). This eliminates delays caused by manual approval processes and creates a documented record of each approval. For ZML\'s SADC operations, the TMS can also manage foreign exchange position analysis, FX deal-making, and intercompany netting, which are functions that a spreadsheet cannot replicate (Bragg, 2010).'
        ),
        body(
          'Furthermore, a TMS can provide a customised dashboard that is updated in real time, giving ZML management visibility into the global cash position, investment portfolio, debt portfolio, cash forecast, and foreign exchange transactions, along with mark-to-market valuations and scenario analysis (ZCAS University, 2026b).'
        ),

        h2('3.2 Strengthening Internal Controls and Reducing Fraud or Errors'),
        body(
          'One of the most compelling arguments for a TMS is its capacity to strengthen internal controls, which is the primary concern raised by ZML\'s internal auditors.'
        ),
        body(
          'A TMS enforces a comprehensive audit trail for every treasury transaction, recording who made the transaction, when it was made, the amount involved, and the accounts affected (ZCAS University, 2026b). This level of transparency is simply not achievable with spreadsheets and is fundamental to detecting and deterring fraudulent activity.'
        ),
        body(
          'The system also enforces segregation of duties by limiting access to certain modules and requiring approval of key transactions (ZCAS University, 2026b). For example, the individual who initiates a payment cannot also be the one who authorises it, ensuring that no single employee has unchecked control over financial transactions. This directly addresses the weakness identified in ZML\'s current setup.'
        ),
        body(
          'Warning indicators within a TMS provide automated alerts when policy limits are breached, when transaction confirmations are outstanding, when cash balances turn negative, or when hedging policies are being violated (ZCAS University, 2026b). These real-time controls help management identify and respond to problems before they escalate.'
        ),
        body(
          'Automation through Straight-Through Processing (STP) further reduces the risk of human error by automating repetitive processing tasks, reducing the number of manual interventions that can introduce mistakes (ZCAS University, 2026a). Taken together, these features substantially reduce the risk of both intentional fraud and unintentional errors, directly addressing the concerns raised in ZML\'s internal audit report.'
        ),

        // ─── SECTION 3 ───
        h1('4. Cost Justification and Implementation'),

        h2('4.1 Justifying the Cost of a TMS'),
        body(
          'Although some ZML senior managers are concerned about the cost of implementing a TMS, this cost can be justified through several compelling arguments.'
        ),
        body(
          'The most direct justification is the cost of the current system\'s failures. ZML can look at the cost of a failed manual system, such as a spreadsheet error, to illustrate the financial exposure it faces daily (ZCAS University, 2026b). A single uncorrected spreadsheet error in treasury operations can result in incorrect payments, missed investment opportunities, or inaccurate financial reporting, all of which carry direct financial costs.'
        ),
        body(
          'Additionally, ZML\'s internal auditors can argue that the risk of a transactional error may result in a control breach that would have to be revealed in the company\'s financial filings, with serious regulatory and reputational consequences (ZCAS University, 2026b). The risk of regulatory fines and reputational damage may far outweigh the cost of the TMS.'
        ),
        body(
          'From a long-term perspective, the automation of routine treasury tasks reduces the reliance on manual labour, lowers the risk of costly errors, and enables better cash management decisions. Improved investment of surplus funds and reduced short-term borrowing costs alone may generate savings that offset the system\'s cost over time (Brigham & Houston, 2019).'
        ),

        h2('4.2 In-House Purchase vs. Third-Party Hosted Solution'),
        body(
          'ZML has two main implementation options: purchasing and installing the system internally, or using a third-party hosted (cloud/SaaS) solution. Each approach has distinct advantages and disadvantages.'
        ),
        body('In-House Purchase and Installation:', { bold: true }),
        bullet('Advantage: Full ownership and control over the system, with the ability to customise interfaces and integrate deeply with ZML\'s existing ERP systems.'),
        bullet('Advantage: Long-term cost savings as there are no ongoing subscription fees once the initial investment is recovered.'),
        bullet('Disadvantage: Requires a significant upfront capital investment, which may strain ZML\'s budget and face resistance from cost-conscious managers.'),
        bullet('Disadvantage: Requires dedicated internal IT resources for installation, maintenance, upgrades, and support, which may be beyond ZML\'s current capacity.'),
        blank(),

        body('Third-Party Hosted Solution:', { bold: true }),
        bullet('Advantage: Substitutes the large upfront capital cost for an ongoing monthly fee, making it more accessible for ZML at its current stage of growth (ZCAS University, 2026b).'),
        bullet('Advantage: The vendor handles system maintenance, upgrades, and security, reducing the burden on ZML\'s internal IT team.'),
        bullet('Advantage: Faster deployment, as the infrastructure is already in place and configuration is less complex than a full in-house installation.'),
        bullet('Disadvantage: Ongoing subscription costs may become significant over time, potentially exceeding the cost of an in-house system.'),
        bullet('Disadvantage: Less control over customisation and potential dependency on the vendor for support and continuity of service.'),
        blank(),

        body(
          'Given ZML\'s growth trajectory and the need to manage operations across multiple SADC countries, a third-party hosted solution may be the more pragmatic initial choice, as it reduces upfront costs and deployment complexity while delivering the core TMS benefits quickly.'
        ),

        h2('4.3 Practical Steps to Ensure Full System Utilisation'),
        body(
          'The implementation of a TMS carries the risk that it will not be fully utilised, as employees tend to focus only on the specific functions they were performing before the system was installed (ZCAS University, 2026b). Management can take the following two practical steps to address this risk.'
        ),
        body(
          'First, schedule comprehensive training for all affected personnel across all functions of the system (ZCAS University, 2026b). Training should not be limited to individual job functions but should cover the full capabilities of the TMS, enabling staff to understand how their work connects to broader treasury operations and to utilise the system to its full potential.'
        ),
        body(
          'Second, schedule a formal audit of system usage several months after installation to determine which features are not being used (ZCAS University, 2026b). This audit should identify whether underutilisation is due to knowledge gaps, workflow resistance, or technical issues, and appropriate corrective action should be taken. Regular post-implementation reviews will ensure that ZML continues to derive maximum value from its TMS investment.'
        ),

        // ─── SECTION 4 ───
        h1('5. Internal Audit and Compliance'),

        h2('5.1 Role of Internal Audit in Supporting TMS Implementation'),
        body(
          'Internal audit plays a vital and multifaceted role in supporting the implementation of a TMS at ZML. Given that ZML\'s internal audit team has already identified the risks associated with the current manual system, the function is well-positioned to champion and support the transition to a TMS.'
        ),
        body(
          'During the pre-implementation phase, internal auditors can conduct a thorough risk assessment of the current treasury processes, documenting control weaknesses and quantifying the potential financial exposure. This evidence-based analysis provides management with a compelling business case for the TMS investment. Internal auditors can specifically highlight the risk that transactional errors may result in control breaches that would have to be disclosed in the company\'s financial filings (ZCAS University, 2026b).'
        ),
        body(
          'During implementation, internal audit should be involved in reviewing the system\'s control configurations, including the segregation of duties settings, approval thresholds, and user access rights. This ensures that the TMS is configured in alignment with ZML\'s internal control policies and regulatory requirements.'
        ),
        body(
          'Post-implementation, internal audits should be scheduled to match actual transactions against company policies and procedures (ZCAS University, 2026a). These reviews verify that the TMS is operating as intended, that controls are being adhered to, and that any gaps or configuration issues are identified and resolved promptly. This ongoing oversight role is essential for maintaining the integrity of ZML\'s treasury function over time.'
        ),

        h2('5.2 TMS in Preventing Control Breaches and Improving Financial Reporting'),
        body(
          'A TMS contributes directly to the prevention of control breaches and the improvement of financial reporting reliability through several mechanisms.'
        ),
        body(
          'By enforcing automated segregation of duties, the TMS ensures that no single user can both initiate and approve a transaction, thereby preventing the kind of unauthorised activity that led to the collapse of Barings Bank (ZCAS University, 2026a). The system\'s warning indicators automatically alert users and supervisors when policy limits are being approached or breached, enabling real-time intervention before a control failure occurs (ZCAS University, 2026b).'
        ),
        body(
          'The comprehensive audit trail generated by the TMS creates a complete, tamper-resistant record of every treasury transaction. This not only deters fraudulent behaviour but also provides the evidence required for internal and external audits, regulatory inspections, and financial reporting. Unlike spreadsheets, where data can be altered without leaving a trace, TMS audit trails are structured, time-stamped, and attributable to specific users.'
        ),
        body(
          'Financial reporting reliability is further enhanced by the TMS\'s integration with ZML\'s accounting and ERP systems, which eliminates the need for manual data re-entry and the errors that accompany it. Real-time data feeds ensure that financial reports reflect the actual position of the company at any given moment, reducing the risk of misstatements and providing management with accurate, timely information for decision-making (Gitman & Zutter, 2012).'
        ),
        body(
          'In summary, a TMS transforms treasury compliance from a reactive, manual exercise into a proactive, automated function, substantially reducing the probability of control breaches and the material misstatements that ZML\'s current system is susceptible to.'
        ),

        // ─── CONCLUSION ───
        h1('6. Conclusion'),
        body(
          'This report has demonstrated that ZML\'s current manual treasury system is inadequate for a company of its size, complexity, and growth ambitions. The weaknesses identified, including the absence of audit trails, poor segregation of duties, limited real-time visibility, and inability to manage multi-currency operations, expose ZML to significant financial, operational, regulatory, and reputational risks.'
        ),
        body(
          'The adoption of a Treasury Management System would address each of these weaknesses by automating treasury operations, enforcing robust internal controls, and providing real-time financial intelligence. The cost of the TMS can be justified by the savings from error prevention, improved cash management, and the avoidance of costly regulatory breaches. A third-party hosted solution is recommended as the most practical initial approach, given ZML\'s growth stage and budgetary constraints.'
        ),
        body(
          'Internal audit has a critical role to play throughout the TMS lifecycle, from building the business case to post-implementation oversight. With proper training, a structured audit of system usage, and ongoing internal audit support, ZML can ensure that the TMS is fully utilised and that its treasury function evolves to meet the demands of a growing, regionally-active manufacturing company.'
        ),

        // ─── REFERENCES ───
        new Paragraph({ pageBreakBefore: true, children: [new TextRun('')] }),
        h1('References'),
        body(
          'Bragg, S. M. (2010). Treasury management: The practitioner\'s guide. John Wiley & Sons.'
        ),
        body(
          'Brigham, E. F., & Houston, J. F. (2019). Fundamentals of financial management (15th ed.). Cengage Learning.'
        ),
        body(
          'Gitman, L. J., & Zutter, C. J. (2012). Principles of managerial finance (13th ed.). Pearson Education.'
        ),
        body(
          'ZCAS University. (2026a). BBF4302 Treasury management: Introduction to treasury management [Lecture slides]. ZCAS University.'
        ),
        body(
          'ZCAS University. (2026b). BBF4302 Treasury management: Treasury systems [Lecture slides]. ZCAS University.'
        ),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(
    'C:\\Users\\deeky\\OneDrive\\Desktop\\Booklesss\\Treasury Management\\02_ASSIGNMENT\\ZML_Treasury_Management_Assignment.docx',
    buffer
  );
  console.log('Done!');
});
