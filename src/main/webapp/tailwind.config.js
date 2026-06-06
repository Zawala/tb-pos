import frappeUIPreset from 'frappe-ui/tailwind';

/**
 * Tailwind v4 loads this legacy config via the `@config` directive in
 * content/css/tailwind.css. The frappe-ui preset injects the design-system
 * CSS variables (--surface-*, --ink-*, --outline-*), maps the semantic color
 * utilities to them, and replaces the palette with frappe's colors.
 *
 * `content` MUST include frappe-ui's own source so the utility classes used
 * inside its components (Button, Dialog, …) are generated. Paths are relative
 * to this file (src/main/webapp/).
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  presets: [frappeUIPreset],
  content: ['./app/**/*.{vue,js,ts,jsx,tsx,html}', './index.html', '../../../node_modules/frappe-ui/src/**/*.{vue,js,ts}'],
};
