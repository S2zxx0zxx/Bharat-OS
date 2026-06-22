'use client'

import { useState, useCallback } from 'react'
import { ModuleId } from '@/types'
import { getModule, MODULES } from '@/lib/modules'

export function useModule(initialModule: ModuleId = 'legal') {
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>(initialModule)

  const activeModule = getModule(activeModuleId)

  const switchModule = useCallback((id: ModuleId) => {
    setActiveModuleId(id)
  }, [])

  return {
    activeModuleId,
    activeModule,
    allModules: MODULES,
    switchModule,
  }
}
