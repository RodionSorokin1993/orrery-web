export const THEME_STORAGE_KEY = 'orrery-theme'
export const THEME_EVENT = 'orrery-theme-change'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

/**
 * Runs before first paint (inlined in <head>), so a dark-mode reader never sees a light flash.
 * Kept tiny and dependency-free on purpose.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');var d=p==='dark'||(p!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light')}catch(e){}})()`

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  if (preference === 'system') return prefersDark ? 'dark' : 'light'
  return preference
}

export function nextPreference(current: ThemePreference): ThemePreference {
  return current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system'
}
