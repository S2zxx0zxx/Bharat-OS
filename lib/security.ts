import { SecurityCheckResult } from '@/types'

interface PiiPattern {
  name: string
  pattern: RegExp
  replacement: string
}

const PII_PATTERNS: PiiPattern[] = [
  {
    name: 'aadhaar',
    pattern: /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
    replacement: '[AADHAAR REDACTED]',
  },
  {
    name: 'phone',
    pattern: /\b[6-9]\d{9}\b/g,
    replacement: '[PHONE REDACTED]',
  },
  {
    name: 'pan',
    pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
    replacement: '[PAN REDACTED]',
  },
  {
    name: 'email',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: '[EMAIL REDACTED]',
  },
  {
    name: 'bankAccount',
    pattern: /\b\d{9,18}\b/g,
    replacement: '[ACCOUNT REDACTED]',
  },
]

const INJECTION_PATTERNS: string[] = [
  'ignore previous',
  'ignore all',
  'system prompt',
  'jailbreak',
  'pretend you are',
  'act as',
  'disregard',
  'forget your instructions',
  'you are now',
  'new persona',
  'bypass',
  'override instructions',
]

export function securityCheck(query: string): SecurityCheckResult {
  let sanitized = query
  const warnings: string[] = []
  let hasPII = false

  // Check for prompt injection
  const hasInjection = INJECTION_PATTERNS.some((p) =>
    query.toLowerCase().includes(p.toLowerCase())
  )

  if (hasInjection) {
    return {
      isSafe: false,
      hasPII: false,
      sanitizedQuery: '',
      warnings: ['Suspicious input detected. Please ask a genuine question.'],
    }
  }

  // Redact PII
  for (const pii of PII_PATTERNS) {
    // Reset regex state
    pii.pattern.lastIndex = 0
    if (pii.pattern.test(sanitized)) {
      hasPII = true
      pii.pattern.lastIndex = 0
      sanitized = sanitized.replace(pii.pattern, pii.replacement)
      warnings.push(`${pii.name} detected and redacted for your safety`)
    }
  }

  // Length check
  if (query.length > 1000) {
    sanitized = sanitized.substring(0, 1000)
    warnings.push('Query truncated to 1000 characters')
  }

  return {
    isSafe: true,
    hasPII,
    sanitizedQuery: sanitized.trim(),
    warnings,
  }
}
