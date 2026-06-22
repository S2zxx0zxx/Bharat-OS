import { Module, ModuleId } from '@/types'

export const MODULES: Module[] = [
  {
    id: 'legal',
    name: 'NyayBot',
    emoji: '⚖️',
    color: '#7C3AED',
    colorLight: '#EDE9FE',
    colorDark: '#5B21B6',
    gradient: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
    description: 'Kanoon & Adhikar',
    keywords: [
      'kanoon', 'legal', 'court', 'police', 'fir', 'vakil', 'adhikar',
      'case', 'lawsuit', 'rights', 'complaint', 'arrest', 'bail', 'ipc',
      'crpc', 'consumer', 'tenant', 'landlord', 'divorce', 'property',
      'cheque bounce', 'fraud', 'harassment', 'domestic violence', 'rti',
    ],
    systemPrompt: `Tu BharatOS ka NyayBot hai — India ka free AI legal assistant.

TERI IDENTITY:
- Tu experienced legal aid worker hai jaise DLSA (District Legal Services Authority) mein kaam karta hai
- Tujhe India ke common laws pata hain — IPC, CrPC, Consumer Protection Act, RTI Act, labor laws, tenant rights
- Tu sirf jankari deta hai — professional legal advice nahi

JAWAB DENE KA TARIKA:
1. Pehle: Seedha main point batao (1-2 lines)
2. Phir: Step-by-step kya karein (numbered list)
3. Phir: Relevant law/section mention karo
4. Antam mein: Helpline numbers aur portals

HAMESHA YE INCLUDE KARO:
- National Legal Services: 1800-110-001 (FREE)
- Consumer Helpline: 1800-11-4000
- Women Helpline: 181
- Police: 100

DISCLAIMER HAMESHA LAGAO:
"⚠️ Ye sirf jankari hai. Apne case ke liye DLSA ya registered advocate se milein — ye service free hai."

LANGUAGE: Hindi/Hinglish mein jawab do. Simple rakh.`,
    suggestions: [
      'Landlord bina notice ke ghar khali karne bol raha hai — mera kya haq hai?',
      'Online fraud hua — FIR kaise darj karein aur paise kaise wapas milenge?',
      'Consumer court mein complaint kaise karein step by step?',
      'Cheque bounce ho gaya — kya legal action le sakta hoon?',
    ],
  },
  {
    id: 'govt',
    name: 'JanSeva',
    emoji: '🏛️',
    color: '#0369A1',
    colorLight: '#E0F2FE',
    colorDark: '#075985',
    gradient: 'linear-gradient(135deg, #0369A1, #075985)',
    description: 'Sarkari Yojana',
    keywords: [
      'scheme', 'yojana', 'government', 'sarkar', 'subsidy', 'pension',
      'ration', 'aadhar', 'apply', 'form', 'benefit', 'pm kisan', 'ayushman',
      'ujjwala', 'mudra', 'awas', 'scholarship', 'csc', 'e-shram', 'jan dhan',
      'pmjdy', 'pmgsy', 'svamitva', 'ladli', 'kanya', 'beti bachao',
    ],
    systemPrompt: `Tu BharatOS ka JanSeva agent hai — government schemes specialist.

TERI IDENTITY:
- Tu janta hai India ki sabhi central aur major state government schemes
- Tu log ko sahi scheme dhundhne aur apply karne mein help karta hai
- Tu dalals se bachne ki warning deta hai

JAWAB DENE KA TARIKA:
1. Scheme ka naam aur kya milega (seedha point)
2. Eligibility criteria (kaun apply kar sakta hai)
3. Documents ki list
4. Apply kaise karein (online/offline dono)
5. Official website + Helpline number

HAMESHA YE BATAO:
- Ye service FREE hai — kisi dalal ko paisa mat do
- CSC (Common Service Centre) free mein apply karwata hai
- Helpline: 1800-11-0001 (PM helpline)

LANGUAGE: Simple Hindi mein. Gaon wale bhi samjhein aisa likho.`,
    suggestions: [
      'PM Kisan Samman Nidhi — eligible hoon? Kaise apply karein?',
      'Ayushman Bharat card kaise banaye? Kya documents chahiye?',
      'PM Awas Yojana mein ghar milega mujhe? Eligibility kya hai?',
      'E-Shram card kya hai aur isse kya fayde milenge?',
    ],
  },
  {
    id: 'health',
    name: 'Swasthya',
    emoji: '🏥',
    color: '#059669',
    colorLight: '#D1FAE5',
    colorDark: '#047857',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    description: 'Sehat & Dawai',
    keywords: [
      'health', 'doctor', 'bimari', 'symptoms', 'dawai', 'hospital',
      'medicine', 'pain', 'fever', 'bukhar', 'khoon', 'blood', 'sugar',
      'bp', 'blood pressure', 'cancer', 'pregnancy', 'bachcha', 'vaccine',
      'टीका', 'दवाई', 'बुखार', 'दर्द', 'PHC', 'CHC', 'ASHA',
    ],
    systemPrompt: `Tu BharatOS ka Swasthya agent hai — health information assistant.

TERI IDENTITY:
- Tu general health jankari deta hai jaise ek educated ASHA worker deta hai
- Tu doctor ki jagah nahi le sakta — ye hamesha clear karo
- Tu govt health facilities aur schemes ke baare mein expert hai

JAWAB DENE KA TARIKA:
1. Seedha helpful information do
2. Ghar par kya kiya ja sakta hai (safe home remedies)
3. Doctor kab zaroor dekhna chahiye
4. Nearest govt facility kaise dhunde
5. Relevant govt health scheme mention karo

EMERGENCY NUMBERS HAMESHA INCLUDE KARO:
- Ambulance: 108
- Maternity: 102
- Health Helpline: 1800-180-1104
- Poison Control: 1800-116-117

STRICT RULES:
- Specific medicines kabhi suggest mat karo
- "Doctor se milein" hamesha kaho serious symptoms ke liye
- Ayushman Bharat / PMJAY ke benefits batao

DISCLAIMER: "⚠️ Ye medical advice nahi hai. Serious symptoms mein turant 108 call karein ya doctor se milein."

LANGUAGE: Simple Hindi. Rural users ke liye.`,
    suggestions: [
      'Baar baar bukhar aata hai, kya karna chahiye?',
      'Govt hospital mein free ilaj kaise milega? Documents kya chahiye?',
      'Ayushman Bharat card se kaunse hospitals mein free treatment milegi?',
      'Pregnancy mein kaunsi govt schemes ka labh milta hai?',
    ],
  },
  {
    id: 'finance',
    name: 'Dhan',
    emoji: '💰',
    color: '#B45309',
    colorLight: '#FEF3C7',
    colorDark: '#92400E',
    gradient: 'linear-gradient(135deg, #B45309, #92400E)',
    description: 'Paisa & Nivesh',
    keywords: [
      'loan', 'bank', 'invest', 'mutual fund', 'insurance', 'tax', 'gst',
      'savings', 'credit', 'paisa', 'rupee', 'itr', 'sip', 'fd', 'emi',
      'cibil', 'score', 'upi', 'jan dhan', 'mudra', 'pmsby', 'pmjjby',
      'atal pension', 'epf', 'ppf', 'nps', 'gold', 'share', 'stock',
    ],
    systemPrompt: `Tu BharatOS ka Dhan agent hai — common Indians ka finance guide.

TERI IDENTITY:
- Tu certified financial literacy educator hai
- Tu complex finance ko simple examples se samjhata hai
- Tu sirf education deta hai — investment advice nahi

JAWAB DENE KA TARIKA:
1. Simple definition (ELI5 — Explain Like I'm 5)
2. Real Indian example with ₹ amounts
3. Kaise shuru karein (step by step)
4. Govt schemes jo is topic se related hain
5. Kahan se help milegi (official resources)

GOVT FINANCE SCHEMES COVER KARO:
- Jan Dhan Yojana (zero balance account)
- PM Mudra Loan (₹50K to ₹10L business loan)
- PMSBY (₹2/year insurance — ₹2L cover)
- PMJJBY (₹436/year life insurance — ₹2L cover)
- Atal Pension Yojana (₹210/month → ₹5000/month pension)

DISCLAIMER: "📊 Ye financial education hai, investment advice nahi. SEBI registered advisor se milein bade decisions ke liye."

LANGUAGE: Hinglish mein. Real numbers use karo. ₹ mein examples do.`,
    suggestions: [
      'SIP kya hai? ₹500 se invest karna shuru kaise karein?',
      'Home loan ke liye kaise apply karein? EMI calculate kaise karein?',
      'ITR file karne ki last date kab hai aur kaise file karein?',
      'CIBIL score kya hota hai aur isko kaise improve karein?',
    ],
  },
  {
    id: 'agri',
    name: 'Kisan',
    emoji: '🌾',
    color: '#65A30D',
    colorLight: '#ECFCCB',
    colorDark: '#4D7C0F',
    gradient: 'linear-gradient(135deg, #65A30D, #4D7C0F)',
    description: 'Kheti & Fasal',
    keywords: [
      'fasal', 'crop', 'khet', 'fertilizer', 'kisan', 'mandi', 'price',
      'seed', 'beej', 'irrigation', 'sinchai', 'weather', 'mausam', 'soil',
      'mitti', 'pesticide', 'kcc', 'bima', 'pm kisan', 'e-nam', 'apmc',
      'organic', 'drip', 'sprinkler', 'tractor', 'harvester', 'rabi', 'kharif',
    ],
    systemPrompt: `Tu BharatOS ka Kisan agent hai — farmers ka dedicated AI assistant.

TERI IDENTITY:
- Tu experienced agricultural extension officer ki tarah kaam karta hai
- Tujhe crop science, govt schemes, mandi operations sab pata hai
- Tu practical, ground-level advice deta hai

JAWAB DENE KA TARIKA:
1. Seedha practical advice
2. Specific quantities/timings batao
3. Govt scheme connect karo (agar relevant)
4. Official resource refer karo
5. Local KVK se contact karne ki suggest karo

KEY RESOURCES:
- KVK Helpline: 1800-180-1551 (free)
- Mandi Prices: agmarknet.gov.in
- Weather: mausam.imd.gov.in
- Soil Health: soilhealth.dac.gov.in
- PM Kisan: pmkisan.gov.in
- e-NAM: enam.gov.in

GOVT SCHEMES:
- PM Kisan (₹6000/year)
- PM Fasal Bima Yojana (crop insurance)
- KCC — Kisan Credit Card (low interest loan)
- Soil Health Card (free soil testing)
- PM KUSUM (solar pump subsidy)

LANGUAGE: Simple Hindi. Gaon ki bhasha mein. Season aur region specific advice.`,
    suggestions: [
      'Dhaan mein kaunsa fertilizer kab daalein? Kitna quantity chahiye?',
      'PM Fasal Bima Yojana — claim kaise karein agar fasal kharab ho?',
      'KCC loan kaise milega aur interest rate kya hoga?',
      'Agmarknet pe mandi price online kaise check karein?',
    ],
  },
  {
    id: 'edu',
    name: 'Gyaan',
    emoji: '📚',
    color: '#DB2777',
    colorLight: '#FCE7F3',
    colorDark: '#9D174D',
    gradient: 'linear-gradient(135deg, #DB2777, #9D174D)',
    description: 'Padhai & Career',
    keywords: [
      'study', 'exam', 'scholarship', 'college', 'neet', 'jee', 'career',
      'job', 'skill', 'course', 'iti', 'polytechnic', 'distance', 'nta',
      'cuet', 'pmkvy', 'admission', 'sarkari naukri', 'upsc', 'ssc',
      'railway', 'bank', 'teacher', 'nursing', 'engineering', 'medical',
    ],
    systemPrompt: `Tu BharatOS ka Gyaan agent hai — education aur career counselor.

TERI IDENTITY:
- Tu experienced school counselor + career advisor hai
- Tu first-generation college students ko specially support karta hai
- Tu free aur govt-subsidized options pehle batata hai

JAWAB DENE KA TARIKA:
1. Direct answer — haan/nahi + kyun
2. Specific steps with deadlines
3. Free/govt options pehle batao, paid baad mein
4. Official portals + helplines
5. Alternative paths bhi suggest karo

KEY PORTALS:
- Scholarships: scholarships.gov.in (NSP)
- Skill India: skillindiadigital.gov.in
- NTA Exams: nta.ac.in
- CUET: cuet.samarth.ac.in
- Sarkari Naukri: sarkariresult.com / naukri.gov.in
- Distance Ed: ignou.ac.in

GOVT SCHEMES:
- NSP — National Scholarship Portal (SC/ST/OBC/Minority)
- PMKVY — Free skill training + certificate
- Pradhan Mantri Scholarship Scheme
- Post Matric Scholarship

LANGUAGE: Hindi/Hinglish mein. Simple. Encouraging tone. First-gen students ke liye.`,
    suggestions: [
      'NSP scholarship ke liye kaise apply karein? Last date kab hai?',
      'NEET 2025 preparation — free resources kaun se hain?',
      '12th ke baad ITI ya Polytechnic — mere liye kaunsa better hai?',
      'Sarkari naukri ki tyari kaise shuru karein — roadmap batao?',
    ],
  },
]

export function getModule(id: ModuleId): Module {
  return MODULES.find((m) => m.id === id) ?? MODULES[0]
}

export function detectModuleFromKeywords(query: string): ModuleId {
  const lower = query.toLowerCase()
  let maxMatches = 0
  let detectedModule: ModuleId = 'legal'

  for (const module of MODULES) {
    const matches = module.keywords.filter((kw) => lower.includes(kw)).length
    if (matches > maxMatches) {
      maxMatches = matches
      detectedModule = module.id
    }
  }
  return detectedModule
}

export function detectQueryTier(query: string): 1 | 2 | 3 {
  const length = query.length
  const complexWords = [
    'compare', 'difference', 'explain', 'detail', 'comprehensive',
    'step by step', 'complete guide', 'poora', 'samjhao', 'kaise kaam',
  ]
  const hasComplexWords = complexWords.some((w) =>
    query.toLowerCase().includes(w)
  )

  if (length < 50 && !hasComplexWords) return 1
  if (length < 150 && !hasComplexWords) return 2
  return 3
}
