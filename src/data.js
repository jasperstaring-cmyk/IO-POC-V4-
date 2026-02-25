// ─── Job roles ────────────────────────────────────────────────────────────────
export const JOB_ROLES = [
  "Portfolio Manager","Fund Manager","Investment Analyst","Risk Manager",
  "Compliance Officer","Chief Investment Officer (CIO)","Chief Financial Officer (CFO)",
  "Relationship Manager","Private Banker","Financial Advisor","Wealth Manager",
  "Asset Manager","Trader","Economist","Strategist","Managing Director",
  "Director","Partner","Consultant","Other",
]

// ─── Organisation segments & types ───────────────────────────────────────────
export const SEGMENTS = [
  {
    id: "wealth",
    name: "Wealth Management",
    desc: "Organisations that help individuals and families manage their wealth, including private banks, independent advisors, and family offices.",
    product: "A",
    types: [
      { id:"private_banking", name:"Private Banking",                      desc:"Banks offering wealth and investment services to individuals and families." },
      { id:"large_banks",     name:"Large Banks (Wholesale & Retail)",      desc:"Large banks providing investment services to individual and corporate clients." },
      { id:"family_offices",  name:"Family Offices",                        desc:"Organisations managing the wealth of one or more families." },
      { id:"independent",     name:"Independent Advisors & Intermediaries", desc:"Independent wealth advisors, brokers and tied agents." },
      { id:"brokerage",       name:"Brokerage & Trading",                   desc:"Firms providing brokerage and trading services." },
      { id:"corporate_ib",    name:"Corporate & Investment Banking",        desc:"Banks offering corporate finance and capital markets services." },
      { id:"estate",          name:"Estate Planning & Foundations",         desc:"Entities focused on inheritance, estate structures and philanthropy." },
      { id:"sovereign",       name:"Sovereign Wealth Funds",                desc:"State-owned investment funds." },
      { id:"other_wealth",    name:"Other",                                  desc:"Any other wealth management organisation." },
    ],
  },
  {
    id: "asset_management",
    name: "Asset Management",
    desc: "Firms that design and manage investment strategies through investment funds and institutional mandates.",
    product: "C",
    types: [
      { id:"diversified",     name:"Diversified Asset Manager",      desc:"Firms with multiple product lines and no clear dominant focus." },
      { id:"traditional",     name:"Traditional Asset Manager",      desc:"Fund houses focused on mutual funds, UCITS or AIFs." },
      { id:"etf_issuer",      name:"ETF Issuer",                     desc:"Specialists issuing and managing ETFs." },
      { id:"real_estate",     name:"Real Estate Investment Manager",  desc:"Organisations providing real estate investment vehicles." },
      { id:"private_markets", name:"Private Markets Manager",        desc:"Firms focused on private equity, private credit, infrastructure, venture capital and broader real assets." },
      { id:"structured",      name:"Structured Products Provider",   desc:"Issuers of certificates, notes, and derivative-based investment products." },
      { id:"fiduciary",       name:"Fiduciary / OCIO Provider",      desc:"Providers of LDI mandates, fiduciary services or outsourced CIO solutions." },
      { id:"boutique",        name:"Specialist / Boutique Manager",  desc:"Niche or thematic investment providers (e.g., ESG, quant, single strategy)." },
      { id:"other_am",        name:"Other",                          desc:"Organisations not fitting the above categories." },
    ],
  },
  {
    id: "institutional",
    name: "Institutional Investor",
    desc: "Large organisations that invest significant assets, such as pension funds and insurance companies.",
    product: "placeholder",
    types: [],
  },
  {
    id: "asset_servicing",
    name: "Asset Servicing",
    desc: "Firms providing supporting services such as custody, administration, consulting, technology, data, legal services or compliance.",
    product: "placeholder",
    types: [],
  },
  {
    id: "other",
    name: "Other Organisation",
    desc: "Regulators, governments, associations, universities and other entities connected to the investment industry.",
    product: "placeholder",
    types: [],
  },
]

// ─── Business plan sizes (per Figma wireframe 153) ─────────────────────────
export const BUSINESS_SIZES = [
  { id:"S",  label:"Small Business",       users:"1–5 gebruikers",    priceLabel:"€ 79,–",    monthlyPrice:79,   perUser: null,  desc:"Voor kleine teams die samen willen lezen." },
  { id:"M",  label:"Medium Business",      users:"6–10 gebruikers",   priceLabel:"€ 104,–",   monthlyPrice:104,  perUser: null,  desc:"Voor middelgrote teams met gedeelde toegang." },
  { id:"L",  label:"Large Business",       users:"11–16 gebruikers",  priceLabel:"€ 145,–",   monthlyPrice:145,  perUser: null,  desc:"Voor grotere organisaties." },
  { id:"XL", label:"Extra large Business", users:"Meer dan 16 gebruikers", priceLabel:"Vanaf € 9,– p.m. per gebruiker", monthlyPrice:null, perUser: 9, desc:"Prijs per gebruiker per maand." },
]

// Backward compat
export const PRODUCT_C_VARIANTS = BUSINESS_SIZES

// ─── Personal plans ───────────────────────────────────────────────────────────
export const PERSONAL_PLANS = [
  {
    id: "freemium",
    name: "Freemium",
    sub: "Voor professionals",
    priceLabel: "Gratis",
    priceSuffix: "",
    cta: "Maak gratis account aan",
    ctaNote: "Altijd gratis. Upgrade wanneer u wilt.",
    features: [
      "Toegang tot fondsenanalyse en marktrapporten",
      "Selectie van partnercontent",
      "Nieuwsbrieven instellen en beheren",
      "Persoonlijke omgeving met profielbeheer",
    ],
  },
  {
    id: "trial",
    name: "Pro Trial",
    sub: "10 dagen volledige toegang",
    priceLabel: "Gratis",
    priceSuffix: "10 dagen",
    cta: "Start 10 dagen Pro",
    ctaNote: "Na 10 dagen stopt uw toegang automatisch.",
    features: [
      "Volledige toegang tot alle Premium artikelen (Nederland)",
      "Alle columns, analyses en expertbijdragen",
      "Toegang via website en app",
      "Volledige controle over nieuwsbrieven",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    sub: "Volledige toegang – Nederland",
    priceLabel: "€ 649,–",
    priceSuffix: "Per jaar (excl. btw)",
    cta: "Word Pro lid",
    ctaNote: "Direct onbeperkte toegang na betaling.",
    features: [
      "Onbeperkte toegang tot alle redactionele content",
      "Exclusieve interviews, analyses en columns",
      "Volledige dekking van editie Nederland",
      "Persoonlijk account voor web en app",
    ],
  },
]