import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Check } from 'lucide-react'
import {
  COLOR_THEMES,
  type ColorTheme,
  loadColorTheme,
  saveColorTheme,
} from '../../lib/color-theme-store'
import {
  FONT_OPTIONS,
  type AppFont,
  loadFont,
  saveFont,
} from '../../lib/font-store'

export const Route = createFileRoute('/_app/settings')({ component: SettingsPage })

function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your application preferences.</p>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 px-8 py-6 overflow-y-auto">
          <GeneralTab />
        </div>
      </div>
    </div>
  )
}

function GeneralTab() {
  const [colorTheme, setColorThemeState] = React.useState<ColorTheme>(loadColorTheme)
  const [font, setFontState] = React.useState<AppFont>(loadFont)

  function handleThemeChange(theme: ColorTheme) {
    setColorThemeState(theme)
    saveColorTheme(theme)
  }

  function handleFontChange(f: AppFont) {
    setFontState(f)
    saveFont(f)
  }

  return (
    <div className="max-w-lg flex flex-col gap-8">
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-0.5">Appearance</h2>
        <p className="text-sm text-gray-500 mb-4">Choose an accent color for the interface.</p>
        <div className="flex flex-wrap gap-3">
          {COLOR_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              title={t.label}
              className="flex flex-col items-center gap-1.5 group"
            >
              <span
                className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: t.swatch }}
              >
                {colorTheme === t.id && (
                  <Check size={16} className="text-white" strokeWidth={3} />
                )}
              </span>
              <span
                className={`text-xs font-medium ${
                  colorTheme === t.id ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-0.5">Font</h2>
        <p className="text-sm text-gray-500 mb-4">Choose the interface font.</p>
        <div className="flex flex-col gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFontChange(f.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-left ${
                font === f.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              <span
                className="text-sm text-gray-900"
                style={{ fontFamily: `'${f.family}', sans-serif` }}
              >
                {f.label}
              </span>
              {font === f.id && <Check size={16} className="text-orange-600" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
