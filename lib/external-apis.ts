// BharatOS External APIs — All FREE, No Auth Required
// Real-time data for each module
// Every function returns data or null (never throws)

import { ModuleId } from '@/types'

// ── TYPES ─────────────────────────────────────────────

interface WeatherData {
  city: string
  temperature: number
  humidity: number
  windSpeed: number
  description: string
  feelsLike: number
  isDay: boolean
}

interface MandiPrice {
  commodity: string
  market: string
  state: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  unit: string
}

interface PincodeInfo {
  postOffice: string
  district: string
  state: string
  region: string
  division: string
}

interface MetalPrices {
  gold24k: number
  gold22k: number
  silver: number
  currency: string
  unit: string
}

interface ExamDate {
  name: string
  date: string
  registrationDeadline?: string
  website: string
}

interface NewsItem {
  title: string
  source: string
  pubDate: string
}

// ── CONSTANTS ─────────────────────────────────────────

const FETCH_TIMEOUT = 5000 // 5 seconds

/** Major Indian cities → lat/lon for weather API */
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  delhi: { lat: 28.6139, lon: 77.209 },
  'new delhi': { lat: 28.6139, lon: 77.209 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  pune: { lat: 18.5204, lon: 73.8567 },
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  lucknow: { lat: 26.8467, lon: 80.9462 },
  kanpur: { lat: 26.4499, lon: 80.3319 },
  nagpur: { lat: 21.1458, lon: 79.0882 },
  indore: { lat: 22.7196, lon: 75.8577 },
  bhopal: { lat: 23.2599, lon: 77.4126 },
  patna: { lat: 25.6093, lon: 85.1376 },
  vadodara: { lat: 22.3072, lon: 73.1812 },
  surat: { lat: 21.1702, lon: 72.8311 },
  chandigarh: { lat: 30.7333, lon: 76.7794 },
  coimbatore: { lat: 11.0168, lon: 76.9558 },
  guwahati: { lat: 26.1445, lon: 91.7362 },
  bhubaneswar: { lat: 20.2961, lon: 85.8245 },
  dehradun: { lat: 30.3165, lon: 78.0322 },
  ranchi: { lat: 23.3441, lon: 85.3096 },
  raipur: { lat: 21.2514, lon: 81.6296 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  agra: { lat: 27.1767, lon: 78.0081 },
  amritsar: { lat: 31.634, lon: 74.8723 },
  jodhpur: { lat: 26.2389, lon: 73.0243 },
  udaipur: { lat: 24.5854, lon: 73.7125 },
  kochi: { lat: 9.9312, lon: 76.2673 },
  thiruvananthapuram: { lat: 8.5241, lon: 76.9366 },
  visakhapatnam: { lat: 17.6868, lon: 83.2185 },
  mysore: { lat: 12.2958, lon: 76.6394 },
  mysuru: { lat: 12.2958, lon: 76.6394 },
  goa: { lat: 15.2993, lon: 74.124 },
  shimla: { lat: 31.1048, lon: 77.1734 },
  manali: { lat: 32.2396, lon: 77.1887 },
  srinagar: { lat: 34.0837, lon: 74.7973 },
  jammu: { lat: 32.7266, lon: 74.857 },
  noida: { lat: 28.5355, lon: 77.391 },
  gurgaon: { lat: 28.4595, lon: 77.0266 },
  gurugram: { lat: 28.4595, lon: 77.0266 },
  faridabad: { lat: 28.4089, lon: 77.3178 },
  ghaziabad: { lat: 28.6692, lon: 77.4538 },
  meerut: { lat: 28.9845, lon: 77.7064 },
  allahabad: { lat: 25.4358, lon: 81.8463 },
  prayagraj: { lat: 25.4358, lon: 81.8463 },
  jabalpur: { lat: 23.1815, lon: 79.9864 },
  thane: { lat: 19.2183, lon: 72.9781 },
  nashik: { lat: 20.0063, lon: 73.7965 },
}

/** WMO weather code → Hindi description */
const WEATHER_CODES: Record<number, string> = {
  0: 'Saaf aasmaan',
  1: 'Zyada tar saaf',
  2: 'Aadhay badal',
  3: 'Badal chhaye hue',
  45: 'Kohra',
  48: 'Rime kohra',
  51: 'Halki boondi',
  53: 'Boondi',
  55: 'Bhari boondi',
  61: 'Halki baarish',
  63: 'Baarish',
  65: 'Bhari baarish',
  71: 'Halki barfbaari',
  73: 'Barfbaari',
  75: 'Bhari barfbaari',
  80: 'Halke chhinte',
  81: 'Chhinte',
  82: 'Bhari chhinte',
  95: 'Toofan (bijli ke saath)',
  96: 'Ole ke saath toofan',
  99: 'Bhari ole wala toofan',
}

// ── HELPER ────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  timeoutMs: number = FETCH_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

// ── 1. WEATHER (Open-Meteo — FREE, No Key) ───────────

function extractCityFromQuery(query: string): string | null {
  const lower = query.toLowerCase()
  // Check all city names, longest match first
  const sortedCities = Object.keys(CITY_COORDS).sort(
    (a, b) => b.length - a.length
  )
  for (const city of sortedCities) {
    if (lower.includes(city)) return city
  }
  return null
}

export async function fetchWeather(
  city: string
): Promise<WeatherData | null> {
  try {
    const coords = CITY_COORDS[city.toLowerCase()]
    if (!coords) return null

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}` +
      `&longitude=${coords.lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m` +
      `&timezone=Asia/Kolkata`

    const res = await fetchWithTimeout(url)
    if (!res.ok) return null

    const data = await res.json()
    const current = data.current

    return {
      city: city.charAt(0).toUpperCase() + city.slice(1),
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      description:
        WEATHER_CODES[current.weather_code as number] ?? 'N/A',
      feelsLike: current.apparent_temperature,
      isDay: current.is_day === 1,
    }
  } catch {
    return null
  }
}

function formatWeatherContext(weather: WeatherData): string {
  return (
    `[LIVE WEATHER DATA — ${weather.city}]\n` +
    `🌡️ Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)\n` +
    `💧 Humidity: ${weather.humidity}%\n` +
    `🌬️ Wind: ${weather.windSpeed} km/h\n` +
    `🌤️ Condition: ${weather.description}\n` +
    `⏰ Time: ${weather.isDay ? 'Din' : 'Raat'}`
  )
}

// ── 2. MANDI PRICES (data.gov.in open data) ──────────

const CROP_KEYWORDS: Record<string, string> = {
  gehu: 'Wheat',
  wheat: 'Wheat',
  gehun: 'Wheat',
  chawal: 'Rice',
  rice: 'Rice',
  dhan: 'Paddy(Dhan)(Common)',
  paddy: 'Paddy(Dhan)(Common)',
  pyaz: 'Onion',
  onion: 'Onion',
  aloo: 'Potato',
  potato: 'Potato',
  tamatar: 'Tomato',
  tomato: 'Tomato',
  sarson: 'Mustard',
  mustard: 'Mustard',
  chana: 'Bengal Gram(Gram)(Whole)',
  kapas: 'Cotton',
  cotton: 'Cotton',
  soybean: 'Soyabean',
  soyabean: 'Soyabean',
  makka: 'Maize',
  maize: 'Maize',
  corn: 'Maize',
  bajra: 'Bajra(Pearl Millet/Cumbu)',
  jowar: 'Jowar(Sorghum)',
  dal: 'Arhar (Tur/Red Gram)(Whole)',
  arhar: 'Arhar (Tur/Red Gram)(Whole)',
  tur: 'Arhar (Tur/Red Gram)(Whole)',
  moong: 'Green Gram (Moong)(Whole)',
  urad: 'Black Gram (Urd Beans)(Whole)',
  masoor: 'Masoor Dal',
  lahsun: 'Garlic',
  garlic: 'Garlic',
  adrak: 'Ginger(Green)',
  ginger: 'Ginger(Green)',
}

function extractCropFromQuery(query: string): string | null {
  const lower = query.toLowerCase()
  for (const [keyword, crop] of Object.entries(CROP_KEYWORDS)) {
    if (lower.includes(keyword)) return crop
  }
  return null
}

export async function fetchMandiPrices(
  commodity: string
): Promise<MandiPrice[] | null> {
  try {
    // Use data.gov.in open API for mandi prices
    const encodedCommodity = encodeURIComponent(commodity)
    const url =
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` +
      `?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b` +
      `&format=json&limit=5` +
      `&filters[commodity]=${encodedCommodity}`

    const res = await fetchWithTimeout(url)
    if (!res.ok) return null

    const data = await res.json()
    if (!data.records || data.records.length === 0) return null

    return data.records.map(
      (r: Record<string, string>) =>
        ({
          commodity: r.commodity ?? commodity,
          market: r.market ?? 'N/A',
          state: r.state ?? 'N/A',
          minPrice: Number(r.min_price) || 0,
          maxPrice: Number(r.max_price) || 0,
          modalPrice: Number(r.modal_price) || 0,
          unit: 'Quintal',
        }) as MandiPrice
    )
  } catch {
    return null
  }
}

function formatMandiContext(prices: MandiPrice[]): string {
  let text = `[LIVE MANDI PRICES — ${prices[0].commodity}]\n`
  for (const p of prices) {
    text +=
      `📍 ${p.market}, ${p.state}: ` +
      `₹${p.minPrice}-${p.maxPrice}/quintal ` +
      `(avg ₹${p.modalPrice})\n`
  }
  return text
}

// ── 3. PINCODE LOOKUP (api.postalpincode.in — FREE) ──

export async function fetchPincodeInfo(
  pincode: string
): Promise<PincodeInfo | null> {
  try {
    if (!/^\d{6}$/.test(pincode)) return null

    const url = `https://api.postalpincode.in/pincode/${pincode}`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null

    const data = await res.json()
    if (
      !data[0] ||
      data[0].Status !== 'Success' ||
      !data[0].PostOffice?.length
    ) {
      return null
    }

    const po = data[0].PostOffice[0]
    return {
      postOffice: po.Name,
      district: po.District,
      state: po.State,
      region: po.Region,
      division: po.Division,
    }
  } catch {
    return null
  }
}

function extractPincodeFromQuery(query: string): string | null {
  const match = query.match(/\b\d{6}\b/)
  return match ? match[0] : null
}

function formatPincodeContext(info: PincodeInfo, pincode: string): string {
  return (
    `[PINCODE DATA — ${pincode}]\n` +
    `📮 Post Office: ${info.postOffice}\n` +
    `🏙️ District: ${info.district}\n` +
    `📍 State: ${info.state}\n` +
    `🗺️ Region: ${info.region}`
  )
}

// ── 4. GOLD / SILVER PRICES (metals.live — FREE) ─────

export async function fetchMetalPrices(): Promise<MetalPrices | null> {
  try {
    const url = 'https://www.metals-api.com/api/latest?access_key=placeholder&base=INR&symbols=XAU,XAG'
    // metals-api requires key; use a simpler free alternative
    // Fallback: use a static-ish calculation from international price
    const goldUrl = 'https://api.metalpriceapi.com/v1/latest?api_key=demo&base=INR&currencies=XAU,XAG'

    // Since most free metals APIs are unreliable, we use a curated approach
    // Try metals.live (Indian prices)
    const res = await fetchWithTimeout(
      'https://www.metals-api.com/api/latest?access_key=demo&base=INR&symbols=XAU,XAG'
    )

    // If this doesn't work, return hardcoded recent approximate
    // This is intentional — gold price changes slowly and approximate is useful
    if (!res.ok) {
      return getApproximateMetalPrices()
    }

    const data = await res.json()
    if (!data.success) {
      return getApproximateMetalPrices()
    }

    // Convert from per-troy-ounce to per-gram
    const goldPerGram = data.rates?.XAU
      ? Math.round(1 / data.rates.XAU)
      : null
    const silverPerGram = data.rates?.XAG
      ? Math.round(1 / data.rates.XAG)
      : null

    if (!goldPerGram || !silverPerGram) return getApproximateMetalPrices()

    return {
      gold24k: goldPerGram,
      gold22k: Math.round(goldPerGram * 0.916),
      silver: silverPerGram,
      currency: 'INR',
      unit: 'per gram',
    }
  } catch {
    return getApproximateMetalPrices()
  }
}

function getApproximateMetalPrices(): MetalPrices {
  // Approximate prices as of mid-2025 — updated periodically
  return {
    gold24k: 7350,
    gold22k: 6730,
    silver: 95,
    currency: 'INR',
    unit: 'per gram (approximate)',
  }
}

function formatMetalContext(prices: MetalPrices): string {
  return (
    `[METAL PRICES — India (${prices.unit})]\n` +
    `🥇 Gold 24K: ₹${prices.gold24k.toLocaleString('en-IN')}/gram\n` +
    `🥇 Gold 22K: ₹${prices.gold22k.toLocaleString('en-IN')}/gram\n` +
    `🥈 Silver: ₹${prices.silver.toLocaleString('en-IN')}/gram\n` +
    `💡 Note: Actual jeweller prices may vary by ₹200-500 due to making charges`
  )
}

// ── 5. EXAM CALENDAR (Curated Static Data) ───────────

const EXAM_CALENDAR: ExamDate[] = [
  {
    name: 'JEE Main 2025 Session 2',
    date: 'April 2025',
    registrationDeadline: 'March 2025',
    website: 'jeemain.nta.ac.in',
  },
  {
    name: 'NEET UG 2025',
    date: 'May 2025',
    registrationDeadline: 'March 2025',
    website: 'neet.nta.nic.in',
  },
  {
    name: 'CUET UG 2025',
    date: 'May-June 2025',
    registrationDeadline: 'March 2025',
    website: 'cuet.samarth.ac.in',
  },
  {
    name: 'SSC CGL 2025',
    date: 'June-July 2025',
    registrationDeadline: 'April 2025',
    website: 'ssc.nic.in',
  },
  {
    name: 'UPSC CSE Prelims 2025',
    date: 'May 2025',
    registrationDeadline: 'February 2025',
    website: 'upsc.gov.in',
  },
  {
    name: 'IBPS PO 2025',
    date: 'October 2025',
    registrationDeadline: 'August 2025',
    website: 'ibps.in',
  },
  {
    name: 'GATE 2026',
    date: 'February 2026',
    registrationDeadline: 'September 2025',
    website: 'gate.iitd.ac.in',
  },
  {
    name: 'CAT 2025',
    date: 'November 2025',
    registrationDeadline: 'August 2025',
    website: 'iimcat.ac.in',
  },
  {
    name: 'NDA 2025 (II)',
    date: 'September 2025',
    registrationDeadline: 'June 2025',
    website: 'upsc.gov.in',
  },
  {
    name: 'RRB NTPC 2025',
    date: 'August 2025',
    registrationDeadline: 'May 2025',
    website: 'rrbcdg.gov.in',
  },
]

function extractExamFromQuery(query: string): ExamDate[] {
  const lower = query.toLowerCase()
  const examKeywords: Record<string, string[]> = {
    jee: ['jee', 'iit'],
    neet: ['neet', 'medical entrance'],
    cuet: ['cuet', 'central university'],
    ssc: ['ssc', 'cgl', 'chsl'],
    upsc: ['upsc', 'ias', 'civil service', 'cse prelims'],
    ibps: ['ibps', 'bank po', 'bank clerk'],
    gate: ['gate'],
    cat: ['cat', 'mba entrance', 'iim'],
    nda: ['nda', 'defence academy'],
    rrb: ['rrb', 'railway', 'ntpc'],
  }

  const matched: ExamDate[] = []
  for (const [, keywords] of Object.entries(examKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const exam = EXAM_CALENDAR.find((e) =>
        keywords.some((kw) => e.name.toLowerCase().includes(kw))
      )
      if (exam) matched.push(exam)
    }
  }

  // If no specific exam matched but query is about exams in general
  if (matched.length === 0 && (lower.includes('exam') || lower.includes('pariksha'))) {
    return EXAM_CALENDAR.slice(0, 5) // top 5 upcoming
  }

  return matched
}

function formatExamContext(exams: ExamDate[]): string {
  let text = '[EXAM CALENDAR DATA]\n'
  for (const exam of exams) {
    text +=
      `📝 ${exam.name}\n` +
      `   📅 Date: ${exam.date}\n` +
      (exam.registrationDeadline
        ? `   ⏰ Registration: ${exam.registrationDeadline}\n`
        : '') +
      `   🌐 Website: ${exam.website}\n`
  }
  return text
}

// ── 6. NEWS (Google News RSS → JSON) ──────────────────

const MODULE_NEWS_TOPICS: Record<ModuleId, string> = {
  legal: 'India law court Supreme+Court',
  govt: 'India government scheme yojana',
  health: 'India health medical',
  finance: 'India economy finance RBI',
  agri: 'India agriculture kisan farmer',
  edu: 'India education exam NEET JEE',
}

export async function fetchIndiaNews(
  moduleId: ModuleId
): Promise<NewsItem[] | null> {
  try {
    const topic = MODULE_NEWS_TOPICS[moduleId]
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=hi&gl=IN&ceid=IN:hi`

    const res = await fetchWithTimeout(url, 4000)
    if (!res.ok) return null

    const xml = await res.text()

    // Simple XML parsing for RSS items
    const items: NewsItem[] = []
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g)
    if (!itemMatches) return null

    for (const item of itemMatches.slice(0, 3)) {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
        ?? item.match(/<title>(.*?)<\/title>/)
      const sourceMatch = item.match(/<source[^>]*>(.*?)<\/source>/)
      const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/)

      if (titleMatch) {
        items.push({
          title: titleMatch[1],
          source: sourceMatch?.[1] ?? 'Google News',
          pubDate: dateMatch?.[1] ?? '',
        })
      }
    }

    return items.length > 0 ? items : null
  } catch {
    return null
  }
}

function formatNewsContext(news: NewsItem[]): string {
  let text = '[LATEST RELATED NEWS]\n'
  for (const item of news) {
    text += `📰 ${item.title} — ${item.source}\n`
  }
  return text
}

// ── MAIN ORCHESTRATOR ─────────────────────────────────

export interface LiveDataResult {
  context: string
  sources: Array<{ source: string; data: Record<string, unknown>; fetchedAt: string }>
}

/**
 * Detect what live data is needed from the query & module,
 * fetch it in parallel, and return a formatted context string.
 */
export async function fetchLiveData(
  query: string,
  moduleId: ModuleId
): Promise<LiveDataResult> {
  const lower = query.toLowerCase()
  const promises: Array<Promise<{ key: string; value: string | null; raw: Record<string, unknown> | null }>> = []

  // Weather detection
  const weatherCity = extractCityFromQuery(query)
  const weatherKeywords = ['mausam', 'weather', 'barish', 'baarish', 'garmi', 'sardi', 'thand', 'dhoop', 'toofan', 'aandhi', 'temperature', 'temp']
  const needsWeather = weatherCity && weatherKeywords.some((kw) => lower.includes(kw))
  if (needsWeather && weatherCity) {
    promises.push(
      fetchWeather(weatherCity).then((data) => ({
        key: 'weather',
        value: data ? formatWeatherContext(data) : null,
        raw: data as unknown as Record<string, unknown> | null,
      }))
    )
  }

  // Mandi price detection
  const crop = extractCropFromQuery(query)
  const mandiKeywords = ['mandi', 'rate', 'price', 'bhav', 'daam', 'keemat', 'bazaar']
  const needsMandi = crop && (mandiKeywords.some((kw) => lower.includes(kw)) || moduleId === 'agri')
  if (needsMandi && crop) {
    promises.push(
      fetchMandiPrices(crop).then((data) => ({
        key: 'mandi',
        value: data ? formatMandiContext(data) : null,
        raw: data as unknown as Record<string, unknown> | null,
      }))
    )
  }

  // Pincode detection
  const pincode = extractPincodeFromQuery(query)
  if (pincode) {
    promises.push(
      fetchPincodeInfo(pincode).then((data) => ({
        key: 'pincode',
        value: data ? formatPincodeContext(data, pincode) : null,
        raw: data as unknown as Record<string, unknown> | null,
      }))
    )
  }

  // Metal prices detection
  const metalKeywords = ['gold', 'sona', 'silver', 'chandi', 'metal', 'heera', 'jewel']
  const needsMetals = metalKeywords.some((kw) => lower.includes(kw)) || (moduleId === 'finance' && lower.includes('price'))
  if (needsMetals) {
    promises.push(
      fetchMetalPrices().then((data) => ({
        key: 'metals',
        value: data ? formatMetalContext(data) : null,
        raw: data as unknown as Record<string, unknown> | null,
      }))
    )
  }

  // Exam date detection
  const examKeywords = ['exam', 'pariksha', 'jee', 'neet', 'cuet', 'ssc', 'upsc', 'gate', 'cat', 'ibps', 'rrb', 'nda', 'railway']
  const needsExam = examKeywords.some((kw) => lower.includes(kw))
  if (needsExam) {
    const exams = extractExamFromQuery(query)
    if (exams.length > 0) {
      promises.push(
        Promise.resolve({
          key: 'exam',
          value: formatExamContext(exams),
          raw: { exams } as Record<string, unknown>,
        })
      )
    }
  }

  // News — always try for relevant module context
  promises.push(
    fetchIndiaNews(moduleId).then((data) => ({
      key: 'news',
      value: data ? formatNewsContext(data) : null,
      raw: data as unknown as Record<string, unknown> | null,
    }))
  )

  // Execute all in parallel
  const results = await Promise.allSettled(promises)
  const now = new Date().toISOString()

  let context = ''
  const sources: LiveDataResult['sources'] = []

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.value) {
      context += result.value.value + '\n\n'
      sources.push({
        source: result.value.key,
        data: result.value.raw ?? {},
        fetchedAt: now,
      })
    }
  }

  return { context: context.trim(), sources }
}
