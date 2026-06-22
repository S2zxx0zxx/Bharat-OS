'use client'

import { motion } from 'framer-motion'
import { Moon, Sun, Zap } from 'lucide-react'
import { QuotaState } from '@/types'

interface HeaderProps {
  readonly quota: QuotaState
  readonly darkMode: boolean
  readonly onToggleDark: () => void
}

function getQuotaColor(remaining: number): string {
  if (remaining > 5) return '#059669'
  if (remaining > 2) return '#B45309'
  return '#DC2626'
}

export function Header({ quota, darkMode, onToggleDark }: Readonly<HeaderProps>) {
  const quotaPercent = Math.round(
    ((quota.limit - quota.remaining) / quota.limit) * 100
  )
  const quotaColor = getQuotaColor(quota.remaining)

  return (
    <header className="header" role="banner">
      <div className="header-inner">
        {/* Logo */}
        <motion.div
          className="header-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="header-flag-wrapper" aria-hidden="true">
            <div className="header-flag">
              <div className="flag-stripe flag-saffron" />
              <div className="flag-stripe flag-white">
                <div className="ashoka-chakra">●</div>
              </div>
              <div className="flag-stripe flag-green" />
            </div>
          </div>
          <div className="header-brand">
            <span className="brand-bharat">Bharat</span>
            <span className="brand-os">OS</span>
          </div>
          <span className="header-tagline">India ka AI</span>
        </motion.div>

        {/* Right controls */}
        <div className="header-controls">
          {/* Quota badge */}
          <motion.div
            className="quota-badge"
            style={{ borderColor: `${quotaColor}40` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap size={12} style={{ color: quotaColor }} />
            <span
              className="quota-text"
              style={{ color: quotaColor }}
              aria-label={`${quota.remaining} queries remaining today`}
            >
              {quota.remaining}/{quota.limit}
            </span>
            <div className="quota-bar-track">
              <motion.div
                className="quota-bar-fill"
                style={{ background: quotaColor }}
                initial={{ width: 0 }}
                animate={{ width: `${quotaPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Dark mode toggle */}
          <motion.button
            id="dark-mode-toggle"
            onClick={onToggleDark}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="dark-toggle-btn"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
        </div>
      </div>
    </header>
  )
}
