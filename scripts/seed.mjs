/**
 * Sanity Seed Script
 * Populates the CMS with real sample data for the law firm.
 *
 * Run:  node --env-file=.env.local scripts/seed.mjs
 *
 * Safe to re-run — uses createOrReplace(), so nothing duplicates.
 */

import { createClient } from '@sanity/client'

// ── Client ────────────────────────────────────────────────────────────────────
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

// ── Portable Text Helpers ─────────────────────────────────────────────────────
let _k = 0
const k  = () => `k${++_k}`

/** Plain paragraph */
const p = (text) => ({
  _type: 'block', _key: k(), style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

/** Heading (h2, h3) */
const h = (text, style = 'h2') => ({
  _type: 'block', _key: k(), style, markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

/** Bullet list item */
const li = (text) => ({
  _type: 'block', _key: k(), style: 'normal',
  listItem: 'bullet', level: 1, markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

/** Bold inline span inside a paragraph */
const boldP = (boldText, restText) => ({
  _type: 'block', _key: k(), style: 'normal', markDefs: [],
  children: [
    { _type: 'span', _key: k(), text: boldText, marks: ['strong'] },
    { _type: 'span', _key: k(), text: restText,  marks: [] },
  ],
})

/** Blockquote */
const bq = (text) => ({
  _type: 'block', _key: k(), style: 'blockquote', markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

// ─────────────────────────────────────────────────────────────────────────────
//  1. SITE SETTINGS  (singleton _id = 'siteSettings')
// ─────────────────────────────────────────────────────────────────────────────
const siteSettings = {
  _id:   'siteSettings',
  _type: 'siteSettings',
  firmName:    'Sayyed Law Associates',
  tagline:     'Relentless Advocacy. Measured Counsel.',
  description: 'A premier law firm specialising in banking litigation, debt recovery, and civil disputes. Over 15 years of focused expertise — delivering outcomes that matter.',
  address:     'Chamber No. 12, District Court Complex, Fort',
  city:        'Mumbai, Maharashtra – 400 001',
  phone:       '+91 98765 43210',
  email:       'contact@sayyedlaw.in',
  foundedYear: 2009,
  linkedIn:    'https://linkedin.com/company/sayyed-law-associates',
  heroStats: [
    { _key: k(), value: '15+',   label: 'Years of Experience' },
    { _key: k(), value: '200+',  label: 'DRT Cases Argued'   },
    { _key: k(), value: '₹50Cr+', label: 'Recovered for Clients' },
    { _key: k(), value: '98%',   label: 'Success Rate'       },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
//  2. PRACTICE AREAS
// ─────────────────────────────────────────────────────────────────────────────
const practiceAreas = [
  {
    _id:   'practiceArea-banking-debt-recovery',
    _type: 'practiceArea',
    orderRank: 1,
    title:       'Banking & Debt Recovery',
    slug:        { _type: 'slug', current: 'banking-debt-recovery' },
    icon:        '⚖️',
    description: 'Specialist representation for banks, NBFCs, and borrowers in DRT proceedings, SARFAESI actions, and all facets of debt recovery litigation.',
    body: [
      h('Banking & Debt Recovery Law'),
      p('Our banking and debt recovery practice is the cornerstone of the firm. Led by Mr. Mohammed Tayyab Qasim Sayyed, we have over 15 years of unbroken focus on financial disputes before the Debt Recovery Tribunals (DRTs), High Courts, and the Supreme Court of India.'),
      h('Who We Represent', 'h3'),
      p('We act for both creditors and borrowers — providing banks and financial institutions with aggressive recovery strategies, while ensuring that borrowers facing wrongful enforcement receive fair representation.'),
      li('Nationalised banks and scheduled commercial banks'),
      li('Non-Banking Financial Companies (NBFCs)'),
      li('Asset Reconstruction Companies (ARCs)'),
      li('Corporate borrowers challenging wrongful SARFAESI action'),
      li('Guarantors and co-obligors in recovery proceedings'),
      h('Our Services', 'h3'),
      boldP('DRT Proceedings: ', 'Filing and defending Original Applications (OAs), Interim Applications, and appeals before DRATs across the country.'),
      boldP('SARFAESI Act: ', 'Advising on the enforcement of security interests, representing parties in possession actions, and challenging unlawful enforcement.'),
      boldP('IBC Insolvency: ', 'Representing creditors and debtors before the NCLT in insolvency and resolution proceedings.'),
      boldP('Loan Restructuring: ', 'Negotiating one-time settlements and restructuring proposals between banks and defaulting borrowers.'),
      bq('"Mr. Sayyed\'s grasp of banking regulations and DRT procedure is exceptional. He helped us recover ₹8 crore in a case our previous counsel had given up on." — Senior Manager, National Bank'),
    ],
  },
  {
    _id:   'practiceArea-civil-litigation',
    _type: 'practiceArea',
    orderRank: 2,
    title:       'Civil Litigation',
    slug:        { _type: 'slug', current: 'civil-litigation' },
    icon:        '🏛️',
    description: 'Comprehensive civil litigation services covering contract disputes, injunctions, declarations, and enforcement of decrees before all civil courts.',
    body: [
      h('Civil Litigation'),
      p('Our civil litigation team handles complex disputes across all tiers of the civil court system — from Civil Judge courts at the district level to the High Courts and the Supreme Court of India. We combine meticulous case preparation with assertive courtroom advocacy.'),
      h('Practice Highlights', 'h3'),
      li('Contract disputes and breach of agreement claims'),
      li('Injunctions — temporary, ad-interim, and permanent'),
      li('Declaration suits and specific performance'),
      li('Recovery of money and enforcement of decrees'),
      li('Property and possession disputes'),
      li('Commercial disputes and summary suits'),
      h('Our Approach', 'h3'),
      p('We believe that good litigation is 80% preparation. Before filing or responding to any suit, we conduct a rigorous analysis of the legal and factual merits, advise on realistic prospects, and develop a strategy calibrated to the client\'s commercial objectives.'),
    ],
  },
  {
    _id:   'practiceArea-corporate-commercial',
    _type: 'practiceArea',
    orderRank: 3,
    title:       'Corporate & Commercial Law',
    slug:        { _type: 'slug', current: 'corporate-commercial' },
    icon:        '🏢',
    description: 'End-to-end legal support for businesses — company formation, commercial contracts, regulatory compliance, and boardroom disputes.',
    body: [
      h('Corporate & Commercial Law'),
      p('From incorporation to exit, we provide businesses with practical, commercially-minded legal counsel. Our corporate practice supports startups, SMEs, and established enterprises across all stages of the business lifecycle.'),
      h('Services', 'h3'),
      li('Company formation and structuring (Private Ltd, LLP, Section 8)'),
      li('Shareholders\' agreements and joint venture documentation'),
      li('Commercial contract drafting, review, and negotiation'),
      li('Mergers, acquisitions, and business transfers'),
      li('Directors\' duties and corporate governance advisory'),
      li('Regulatory compliance and ROC filings'),
    ],
  },
  {
    _id:   'practiceArea-real-estate',
    _type: 'practiceArea',
    orderRank: 4,
    title:       'Real Estate & Property Law',
    slug:        { _type: 'slug', current: 'real-estate' },
    icon:        '🏠',
    description: 'Full-spectrum property law services — title due diligence, sale agreements, RERA compliance, landlord-tenant disputes, and property litigation.',
    body: [
      h('Real Estate & Property Law'),
      p('Property transactions and disputes require precision. A single overlooked encumbrance or a poorly drafted agreement can cost more than years of legal fees. Our team provides both transactional and litigation support across residential, commercial, and agricultural properties.'),
      h('Key Services', 'h3'),
      li('Title search and due diligence reports'),
      li('Sale agreements, MOUs, and conveyance deeds'),
      li('RERA registration, compliance, and consumer forum representation'),
      li('Landlord-tenant disputes and eviction proceedings'),
      li('Partition suits and co-ownership disputes'),
      li('Property mortgage documentation and review'),
    ],
  },
  {
    _id:   'practiceArea-employment-labour',
    _type: 'practiceArea',
    orderRank: 5,
    title:       'Employment & Labour Law',
    slug:        { _type: 'slug', current: 'employment-labour' },
    icon:        '👔',
    description: 'Representing employers and employees in disciplinary proceedings, wrongful termination claims, labour court disputes, and employment contract matters.',
    body: [
      h('Employment & Labour Law'),
      p('Employment disputes carry reputational and financial risk for both employers and employees. Our team advises on prevention and represents clients robustly when disputes arise.'),
      h('Areas of Practice', 'h3'),
      li('Drafting and reviewing employment agreements and HR policies'),
      li('Domestic enquiry representation and advisory'),
      li('Wrongful termination and retrenchment claims before Labour Courts'),
      li('POSH — Internal Committee constitution and advisory'),
      li('Industrial disputes, strikes, and lock-out proceedings'),
      li('Provident Fund, ESI, and statutory compliance'),
    ],
  },
  {
    _id:   'practiceArea-family-matrimonial',
    _type: 'practiceArea',
    orderRank: 6,
    title:       'Family & Matrimonial Law',
    slug:        { _type: 'slug', current: 'family-matrimonial' },
    icon:        '👨‍👩‍👧',
    description: 'Sensitive, discreet handling of divorce, maintenance, child custody, and succession matters — always pursuing the least adversarial path first.',
    body: [
      h('Family & Matrimonial Law'),
      p('Family matters require a blend of legal rigour and human sensitivity. We approach matrimonial and succession cases with discretion — exploring mediated settlement where possible, and litigating firmly where necessary.'),
      h('Services', 'h3'),
      li('Contested and mutual consent divorce proceedings'),
      li('Maintenance under Section 125 CrPC and the Hindu Marriage Act'),
      li('Child custody and visitation rights'),
      li('Domestic Violence Act proceedings and protection orders'),
      li('Succession certificates and probate of Wills'),
      li('Partition of ancestral and self-acquired property'),
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
//  3. ATTORNEYS
// ─────────────────────────────────────────────────────────────────────────────
const attorneys = [
  {
    _id:   'attorney-mohammed-tayyab',
    _type: 'attorney',
    orderRank: 1,
    name:  'Mohammed Tayyab Qasim Sayyed',
    slug:  { _type: 'slug', current: 'mohammed-tayyab-qasim-sayyed' },
    role:  'Founder & Managing Director',
    email: 'mt.sayyed@sayyedlaw.in',
    phone: '+91 98765 43210',
    linkedIn: 'https://linkedin.com/in/mt-sayyed',
    specializations: [
      'Banking & Debt Recovery',
      'Civil Litigation',
      'DRT Proceedings',
      'SARFAESI Act',
      'Financial Disputes',
    ],
    barAdmissions: ['Bar Council of Maharashtra & Goa', 'Supreme Court of India'],
    education: [
      { _key: k(), degree: 'LL.B. (Hons)', institution: 'Government Law College, Mumbai', year: '2007' },
      { _key: k(), degree: 'B.Com', institution: 'University of Mumbai', year: '2004' },
    ],
    bio: [
      p('With over 15 years of experience in banking litigation and civil disputes, Mr. Mohammed Tayyab Qasim Sayyed has established himself as a leading authority in debt recovery and financial disputes in India. As the Founder and Managing Director of Sayyed Law Associates, he has built a practice recognised for its strategic depth and consistent results before the Debt Recovery Tribunals.'),
      p('His background in commerce gives him a rare ability to dissect complex financial instruments, balance sheets, and banking documentation — a skill that proves decisive in contested recovery proceedings where technical arguments win or lose cases.'),
      h('Notable Achievements', 'h3'),
      li('Recognised as "Top Banking Litigator" by Legal Times magazine (2018–2021, four consecutive years)'),
      li('Successfully argued 200+ cases before Debt Recovery Tribunals across the country'),
      li('Advisor to several nationalised banks and NBFCs on debt recovery strategies and NPA management'),
      li('Guest lecturer at the National Law University on Banking Litigation and the SARFAESI Act'),
      li('Personally negotiated and executed one-time settlements aggregating over ₹50 crore for client banks'),
      li('Represented clients in landmark DRT rulings that have been cited as precedents in subsequent cases'),
      h('Philosophy', 'h3'),
      bq('"Every case has a right answer — the lawyer\'s job is to find it, argue it clearly, and not flinch from it."'),
      p('Mr. Sayyed believes that the best legal outcome is always achieved through thorough preparation, clear communication with clients, and a willingness to negotiate pragmatically without compromising on what is right.'),
    ],
  },
  {
    _id:   'attorney-aditi-sharma',
    _type: 'attorney',
    orderRank: 2,
    name:  'Aditi Sharma',
    slug:  { _type: 'slug', current: 'aditi-sharma' },
    role:  'Senior Associate',
    email: 'a.sharma@sayyedlaw.in',
    phone: '+91 87654 32109',
    specializations: [
      'Corporate & Commercial Law',
      'Real Estate Law',
      'Contract Drafting',
      'RERA Compliance',
    ],
    barAdmissions: ['Bar Council of Maharashtra & Goa'],
    education: [
      { _key: k(), degree: 'LL.M. (Corporate Law)', institution: 'ILS Law College, Pune', year: '2014' },
      { _key: k(), degree: 'LL.B.', institution: 'Symbiosis Law School, Pune', year: '2012' },
    ],
    bio: [
      p('Ms. Aditi Sharma joined Sayyed Law Associates in 2015 and has since become the backbone of the firm\'s corporate and real estate practice. With a Master\'s degree in Corporate Law from ILS Pune, she brings academic rigour to every transactional mandate she handles.'),
      p('Her specialisation in RERA compliance has become increasingly central to the firm\'s offerings as Maharashtra\'s real estate regulatory landscape evolves. She advises developers, buyers, and investors on compliance strategy, and represents homebuyers in RERA proceedings when promoters default on delivery commitments.'),
      h('Areas of Focus', 'h3'),
      li('RERA registration, compliance advisory, and consumer dispute representation'),
      li('End-to-end due diligence for property transactions in Maharashtra'),
      li('Shareholders\' agreements and joint venture documentation for SMEs'),
      li('Commercial lease drafting and negotiation for retail and office properties'),
      li('Company incorporation and ongoing corporate secretarial advisory'),
    ],
  },
  {
    _id:   'attorney-rahul-verma',
    _type: 'attorney',
    orderRank: 3,
    name:  'Rahul Verma',
    slug:  { _type: 'slug', current: 'rahul-verma' },
    role:  'Associate',
    email: 'r.verma@sayyedlaw.in',
    phone: '+91 76543 21098',
    specializations: [
      'Civil Litigation',
      'Employment & Labour Law',
      'Family & Matrimonial Law',
      'Consumer Forum',
    ],
    barAdmissions: ['Bar Council of Maharashtra & Goa'],
    education: [
      { _key: k(), degree: 'LL.B.', institution: 'Government Law College, Mumbai', year: '2019' },
      { _key: k(), degree: 'B.A. (Political Science)', institution: 'St. Xavier\'s College, Mumbai', year: '2016' },
    ],
    bio: [
      p('Mr. Rahul Verma joined the firm as an Associate in 2020 after completing his law degree from Government Law College — the same institution from which the firm\'s founder graduated. He brings energy, analytical sharpness, and a genuine commitment to client service.'),
      p('His practice spans civil litigation, employment disputes, and family law. He handles day-to-day case management for the firm\'s civil docket and has developed a particular interest in employment law, having handled over 40 labour court and industrial tribunal matters since joining.'),
      h('Practice Focus', 'h3'),
      li('Civil suits — money recovery, injunctions, and possession matters'),
      li('Labour Court and Industrial Tribunal representation for employers'),
      li('Domestic enquiry proceedings and disciplinary advisory'),
      li('Matrimonial cases including divorce, maintenance, and child custody'),
      li('Consumer Forum complaints and appeals'),
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
//  4. CASE RESULTS
// ─────────────────────────────────────────────────────────────────────────────
const caseResults = [
  {
    _id:   'result-drt-recovery-8cr',
    _type: 'caseResult',
    featured: true,
    title:       'Nationalised Bank vs. Corporate Defaulter — DRT Mumbai',
    outcome:     '₹8.2 Cr Recovered',
    description: 'Represented a nationalised bank in a complex DRT Original Application against a corporate borrower who had systematically siphoned funds. Secured an order for attachment and sale of the borrower\'s properties within 8 months — well below the DRT average.',
    year: '2022',
    practiceArea: { _type: 'reference', _ref: 'practiceArea-banking-debt-recovery' },
  },
  {
    _id:   'result-sarfaesi-challenged',
    _type: 'caseResult',
    featured: true,
    title:       'Borrower vs. Private Bank — Wrongful SARFAESI Enforcement',
    outcome:     'Enforcement Stayed & OTS Secured',
    description: 'Defended a medium-sized manufacturing company against wrongful possession action under the SARFAESI Act. Successfully challenged the bank\'s notice under Section 13(2) on procedural grounds, secured a stay, and negotiated a favourable one-time settlement saving the client\'s factory from auction.',
    year: '2021',
    practiceArea: { _type: 'reference', _ref: 'practiceArea-banking-debt-recovery' },
  },
  {
    _id:   'result-commercial-property',
    _type: 'caseResult',
    featured: true,
    title:       'Commercial Property Possession Dispute — Bandra',
    outcome:     '₹1.8 Cr Award + Possession',
    description: 'Acted for a commercial property owner in a suit against a sitting tenant who had converted the premises and refused to vacate. Obtained possession and a decree for mesne profits spanning 6 years — a result achieved in under 14 months through aggressive interlocutory applications.',
    year: '2023',
    practiceArea: { _type: 'reference', _ref: 'practiceArea-civil-litigation' },
  },
  {
    _id:   'result-npa-restructuring',
    _type: 'caseResult',
    featured: false,
    title:       'NBFC Debt Restructuring — Manufacturing Sector NPA',
    outcome:     '₹3.4 Cr OTS Settlement',
    description: 'Advised an NBFC on the restructuring of a non-performing account in the manufacturing sector. Negotiated and documented a one-time settlement that recovered 85% of the principal outstanding while avoiding a protracted DRT proceeding.',
    year: '2022',
    practiceArea: { _type: 'reference', _ref: 'practiceArea-banking-debt-recovery' },
  },
  {
    _id:   'result-wrongful-termination',
    _type: 'caseResult',
    featured: false,
    title:       'Wrongful Termination — Senior Manager, Financial Services',
    outcome:     'Reinstatement + 18 Months Back-Pay',
    description: 'Represented a senior manager wrongfully terminated without following the prescribed domestic enquiry procedure. Successfully argued before the Labour Court that the termination was void — securing reinstatement and full back-wages.',
    year: '2021',
    practiceArea: { _type: 'reference', _ref: 'practiceArea-employment-labour' },
  },
  {
    _id:   'result-rera-homebuyer',
    _type: 'caseResult',
    featured: false,
    title:       'Homebuyer vs. Developer — RERA Complaint, Thane Project',
    outcome:     '₹14L Refund + 10.75% Interest',
    description: 'Filed a RERA complaint on behalf of a homebuyer against a developer who had delayed possession by 4 years without justification. MahaRERA ordered a full refund of the amount paid with interest — a result obtained within 5 months of filing.',
    year: '2023',
    practiceArea: { _type: 'reference', _ref: 'practiceArea-real-estate' },
  },
  {
    _id:   'result-shareholder-dispute',
    _type: 'caseResult',
    featured: false,
    title:       'Shareholder Oppression & Mismanagement — Family Business',
    outcome:     'Buyout Order at Fair Value',
    description: 'Acted for minority shareholders in a family-run private limited company where the majority had been systematically excluding them from management and diverting profits. Secured a Company Law Board order directing a buyout of the minority stake at judicially determined fair value.',
    year: '2020',
    practiceArea: { _type: 'reference', _ref: 'practiceArea-corporate-commercial' },
  },
  {
    _id:   'result-maintenance-interim',
    _type: 'caseResult',
    featured: false,
    title:       'Matrimonial Dispute — Maintenance & Child Custody, Bandra Family Court',
    outcome:     '₹80K / Month Interim Maintenance',
    description: 'Represented a client in a contested matrimonial matter involving significant assets and two minor children. Secured interim maintenance of ₹80,000 per month within 6 weeks of filing — well above the typical range for the court — through comprehensive documentation of the husband\'s income and assets.',
    year: '2022',
    practiceArea: { _type: 'reference', _ref: 'practiceArea-family-matrimonial' },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
//  5. BLOG POSTS (Insights)
// ─────────────────────────────────────────────────────────────────────────────
const posts = [
  {
    _id:   'post-sarfaesi-guide',
    _type: 'post',
    title:       'Understanding the SARFAESI Act: A Practical Guide for Borrowers',
    slug:        { _type: 'slug', current: 'sarfaesi-act-guide-borrowers' },
    excerpt:     'Received a notice under Section 13(2) of the SARFAESI Act? Here is what it means, what the bank can and cannot do, and the exact steps you must take within 60 days to protect your property.',
    publishedAt: '2024-03-15T09:00:00Z',
    categories:  ['Banking Law', 'Debt Recovery', 'Borrower Rights'],
    author:      { _type: 'reference', _ref: 'attorney-mohammed-tayyab' },
    body: [
      p('Few pieces of legislation cause as much anxiety for borrowers — and as much misunderstanding — as the Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002. Better known as the SARFAESI Act, it gives secured creditors powerful tools to recover non-performing assets without going to court. But it also comes with procedural safeguards that borrowers can and must use.'),
      h('What Triggers SARFAESI Action?'),
      p('A bank or NBFC can invoke SARFAESI powers when a loan account is classified as a Non-Performing Asset (NPA) — which typically means the borrower has not paid principal or interest for 90 consecutive days.'),
      p('The process begins with a demand notice under Section 13(2), which gives the borrower 60 days to pay the outstanding dues in full. This notice is the starting gun. What you do in those 60 days determines everything.'),
      h('The 60-Day Window: Your Rights', 'h3'),
      li('Represent to the bank in writing, disputing the NPA classification or the amount claimed'),
      li('Negotiate a One-Time Settlement (OTS) — banks are often more flexible than they appear at this stage'),
      li('Challenge the notice if procedural requirements under Section 13(2) were not followed'),
      li('File a representation if the loan account classification is incorrect'),
      h('After 60 Days: What the Bank Can Do', 'h3'),
      p('If the borrower does not pay, the bank may take possession of the secured asset, appoint a receiver to manage it, or sell it by public auction. The bank does not need a court order for any of this — which is precisely what makes SARFAESI so powerful, and why borrowers cannot afford to be passive.'),
      h('Challenging SARFAESI Action: DRT Remedy', 'h3'),
      p('A borrower aggrieved by any action taken under the Act may file a Securitisation Application (SA) before the Debt Recovery Tribunal under Section 17. The DRT can stay the bank\'s action and ultimately set it aside if the bank has not followed due process.'),
      bq('Grounds for challenge include: failure to give proper notice, incorrect NPA classification, non-compliance with RBI Fair Practices Code, and valuation disputes.'),
      p('Time is critical — the SA must be filed promptly, ideally before the bank takes physical possession. Once possession is taken and the property is auctioned, options narrow significantly.'),
      h('Key Takeaway'),
      p('The SARFAESI Act is not a one-way street. Banks have powers, but borrowers have rights. If you have received a 13(2) notice, engage a specialist banking lawyer immediately — do not wait for the 60 days to expire.'),
    ],
  },
  {
    _id:   'post-drt-proceedings-guide',
    _type: 'post',
    title:       'DRT Proceedings: What Banks and Borrowers Both Need to Know',
    slug:        { _type: 'slug', current: 'drt-proceedings-guide' },
    excerpt:     'The Debt Recovery Tribunal system was designed to fast-track financial dispute resolution. In practice, outcomes depend heavily on preparation. Here is a ground-level view of how DRT litigation actually works.',
    publishedAt: '2024-01-22T09:00:00Z',
    categories:  ['DRT', 'Banking Law', 'Litigation'],
    author:      { _type: 'reference', _ref: 'attorney-mohammed-tayyab' },
    body: [
      p('The Debt Recovery Tribunals were established under the Recovery of Debts Due to Banks and Financial Institutions Act, 1993 (the "RDDBFI Act") with a clear mandate: resolve financial recovery disputes faster than the civil courts. DRTs have exclusive jurisdiction over claims above ₹20 lakh by banks and financial institutions.'),
      p('Having appeared before DRTs across the country for over 15 years, I want to share an honest account of how these proceedings actually work — for both sides.'),
      h('Filing an Original Application (OA)'),
      p('The bank initiates proceedings by filing an Original Application before the DRT having jurisdiction over where the cause of action arose or where the defendant resides. The OA sets out the loan account history, the default, and the relief sought — typically recovery of the outstanding amount with interest, plus enforcement of security.'),
      p('The bank must file the original loan agreement, sanction letter, security documents, and statement of account. The quality of this documentation is frequently the deciding factor in cases.'),
      h('The Borrower\'s Position', 'h3'),
      p('The borrower (defendant) files a written statement and may also file a Counter Claim if they believe the bank has acted wrongfully. This is a frequently underused but powerful tool — a well-drafted Counter Claim can dramatically change the negotiating dynamic.'),
      li('Challenge the bank\'s calculation of outstanding dues — bank statements often contain errors'),
      li('Question the validity of the security documents — a defective mortgage can be fatal to the bank\'s case'),
      li('Dispute the interest rate and penal interest charged'),
      li('Raise a Counter Claim for wrongful account classification or harassment'),
      h('Interim Relief — The Critical Early Stage', 'h3'),
      p('The most consequential phase of DRT proceedings is often the early weeks. Banks frequently apply for interim attachment of the borrower\'s properties to prevent asset dissipation. Borrowers may apply for stay of SARFAESI action.'),
      bq('In my experience, the DRT\'s decision on interim relief — made with limited facts and in a matter of minutes — often effectively determines the trajectory of the entire case.'),
      p('This is why having experienced DRT counsel present at the very first hearing is not optional. An unfavourable interim order is extraordinarily difficult to reverse.'),
      h('Timeline Expectations'),
      p('The RDDBFI Act mandates disposal within 180 days. Reality varies. Complex multi-party cases with extensive documentation can take 2–4 years. Simpler matters with cooperative defendants can conclude in 12–18 months. Much depends on which DRT bench you are before and how aggressively both sides pursue the matter.'),
    ],
  },
  {
    _id:   'post-employment-termination',
    _type: 'post',
    title:       'Wrongful Termination in India: What Employees Must Know Before They Sign Anything',
    slug:        { _type: 'slug', current: 'wrongful-termination-india-employee-guide' },
    excerpt:     'Got a termination letter or a "mutual separation" agreement? Do not sign anything before you read this. Employees routinely waive significant rights without realising it.',
    publishedAt: '2023-11-08T09:00:00Z',
    categories:  ['Employment Law', 'Employee Rights', 'Labour Law'],
    author:      { _type: 'reference', _ref: 'attorney-rahul-verma' },
    body: [
      p('Every week, we receive calls from employees who have already signed a full and final settlement — and only then discovered they had significant claims. The settlement, naturally, waives all those claims. This article is about making sure you are not one of those people.'),
      h('The First Rule: Time'),
      p('Employment law remedies in India are time-sensitive. A claim before the Labour Court must generally be made within 3 years of dismissal. A complaint under the POSH Act must be filed within 3 months of the incident. Do not delay.'),
      h('Workman vs. Non-Workman: Why It Matters', 'h3'),
      p('India\'s Industrial Disputes Act, 1947 provides strong protections — but only for "workmen." Whether you qualify as a workman depends primarily on your job role, not your salary or job title. Many white-collar employees earning significant salaries qualify as workmen and are entitled to the full protection of the ID Act.'),
      p('If you are a workman, your employer cannot retrench you without: paying retrenchment compensation at 15 days\' pay per year of service, giving 1 month\'s notice or notice pay, and obtaining prior government permission if the establishment employs 100 or more workers.'),
      h('The Domestic Enquiry Requirement', 'h3'),
      p('For dismissal on grounds of misconduct, the employer must hold a domestic enquiry — a quasi-judicial internal proceeding where the employee must be given a charge sheet, the opportunity to present their defence, and access to relevant documents. An order of dismissal without a proper enquiry is void.'),
      bq('We have secured reinstatement for clients in cases where the employer\'s substantive case against them was strong — purely because the enquiry procedure was not followed correctly.'),
      h('The "Mutual Separation" Trap', 'h3'),
      p('"Mutual separation" agreements are increasingly used to avoid the protections of the ID Act. The employer presents it as a clean break with a modest severance. The employee, anxious to negotiate and move on, signs.'),
      p('What they sign away: the right to challenge wrongful termination, any pending salary or bonus claims, claims under the Gratuity Act, and sometimes even pending provident fund disputes.'),
      li('Never sign any separation agreement under time pressure'),
      li('Insist on at least 5 working days to review and take legal advice'),
      li('Ensure gratuity (if eligible) is fully paid before signing'),
      li('Check that all pending dues — bonus, reimbursements, LTA — are settled'),
      li('Understand what you are waiving — get it explained in plain language'),
      h('When to Consult a Lawyer'),
      p('Before you resign or sign anything. Not after. A 30-minute consultation at this stage can protect rights that would otherwise be permanently lost.'),
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
//  SEED RUNNER
// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱 Starting seed...\n')

  const allDocs = [
    siteSettings,
    ...practiceAreas,
    ...attorneys,
    ...caseResults,
    ...posts,
  ]

  let created = 0
  let failed  = 0

  for (const doc of allDocs) {
    try {
      await client.createOrReplace(doc)
      console.log(`  ✅  ${doc._type.padEnd(22)} ${doc._id}`)
      created++
    } catch (err) {
      console.error(`  ❌  ${doc._type.padEnd(22)} ${doc._id}`)
      console.error(`      ${err.message}`)
      failed++
    }
  }

  console.log(`\n────────────────────────────────────`)
  console.log(`  ✅  Created / updated : ${created}`)
  if (failed > 0) {
    console.log(`  ❌  Failed           : ${failed}`)
    console.log(`\n  Check SANITY_API_WRITE_TOKEN has Editor permissions.`)
  }
  console.log(`\n  Open http://localhost:3000/studio to review.`)
  console.log(`  Open http://localhost:3000 to see the live site.\n`)
}

seed().catch((err) => {
  console.error('\n💥 Seed failed:', err.message)
  process.exit(1)
})
