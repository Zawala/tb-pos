import { ref } from 'vue';

export type Theme = 'light' | 'dark';
export type NavMode = 'sidebar' | 'top' | 'bottom';

const STORAGE_KEY = 'tb-theme';
const PREFS_KEY = 'tb-prefs';

// Defaults reproduce content/css/pos/tokens.css exactly, so behaviour is
// unchanged until the user customises via Settings → Appearance.
const DEFAULTS = {
  accentLight: '#3b82f6',
  accentDark: '#b06bff',
  radius: 14,
  nav: 'sidebar' as NavMode,
};

const theme = ref<Theme>('light');
const accentLight = ref(DEFAULTS.accentLight);
const accentDark = ref(DEFAULTS.accentDark);
const radius = ref<number>(DEFAULTS.radius);
const nav = ref<NavMode>(DEFAULTS.nav);

/** Port of wireframes/app.jsx applyTheme(): drive radius + accent CSS vars. */
function applyVars(): void {
  const root = document.documentElement;
  root.style.setProperty('--radius-base', radius.value + 'px');
  const accent = theme.value === 'dark' ? accentDark.value : accentLight.value;
  root.style.setProperty('--primary', accent);
  root.style.setProperty('--primary-600', `color-mix(in srgb, ${accent} 86%, #000)`);
  root.style.setProperty('--primary-700', `color-mix(in srgb, ${accent} 72%, #000)`);
  root.style.setProperty('--primary-ring', `color-mix(in srgb, ${accent} 38%, transparent)`);
  if (theme.value === 'dark') {
    root.style.setProperty('--primary-soft', `color-mix(in srgb, ${accent} 16%, transparent)`);
    root.style.setProperty('--primary-softer', `color-mix(in srgb, ${accent} 9%, transparent)`);
    root.style.setProperty('--accent-2', `color-mix(in srgb, ${accent} 50%, #ff5ec9)`);
  } else {
    root.style.setProperty('--primary-soft', `color-mix(in srgb, ${accent} 12%, #fff)`);
    root.style.setProperty('--primary-softer', `color-mix(in srgb, ${accent} 6%, #fff)`);
    root.style.setProperty('--accent-2', `color-mix(in srgb, ${accent} 64%, #7db0ff)`);
  }
}

function apply(next: Theme): void {
  theme.value = next;
  document.documentElement.setAttribute('data-theme', next);
  applyVars();
}

function persistPrefs(): void {
  localStorage.setItem(
    PREFS_KEY,
    JSON.stringify({ accentLight: accentLight.value, accentDark: accentDark.value, radius: radius.value, nav: nav.value }),
  );
}

/** Call once before mount to avoid a flash of the wrong theme. */
export function initTheme(): void {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
    accentLight.value = saved.accentLight ?? DEFAULTS.accentLight;
    accentDark.value = saved.accentDark ?? DEFAULTS.accentDark;
    radius.value = saved.radius ?? DEFAULTS.radius;
    nav.value = saved.nav ?? DEFAULTS.nav;
  } catch {
    // keep defaults
  }
  const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  apply(savedTheme ?? (prefersDark ? 'dark' : 'light'));
}

export function useTheme() {
  function setTheme(next: Theme): void {
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  function toggle(): void {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  }

  function setAccent(mode: 'light' | 'dark', value: string): void {
    if (mode === 'light') accentLight.value = value;
    else accentDark.value = value;
    persistPrefs();
    applyVars();
  }

  function setRadius(value: number): void {
    radius.value = value;
    persistPrefs();
    applyVars();
  }

  function setNav(value: NavMode): void {
    nav.value = value;
    persistPrefs();
  }

  return { theme, accentLight, accentDark, radius, nav, toggle, setTheme, setAccent, setRadius, setNav };
}
