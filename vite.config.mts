import { URL, fileURLToPath } from 'node:url';
import { defineConfig, normalizePath } from 'vite';
import * as LucideIcons from 'lucide-static';

import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { VitePWA } from 'vite-plugin-pwa';

const { getAbsoluteFSPath } = await import('swagger-ui-dist');
const swaggerUiPath = getAbsoluteFSPath();

// Build a name→svg map from lucide-static, including camelCase and dash variants
function buildLucideIconMap() {
  const icons: Record<string, string> = {};
  for (const [key, svg] of Object.entries(LucideIcons)) {
    if (key === 'default' || typeof svg !== 'string') continue;
    const patched = svg.replace(/stroke-width="2"/g, 'stroke-width="1.5"');
    // camelCase → dash-case variants
    const withNumber = key.replace(/[A-Z0-9]/g, m => '-' + m.toLowerCase()).replace(/^-/, '');
    const withoutNumber = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase()).replace(/^-/, '');
    icons[withNumber] = patched;
    if (withoutNumber !== withNumber) icons[withoutNumber] = patched;
  }
  return icons;
}

const lucideIconMap = buildLucideIconMap();
const VIRTUAL_PREFIX = '~icons/lucide/';
const RESOLVED_PREFIX = '\0~icons/lucide/';

function lucideIconsPlugin() {
  return {
    name: 'frappe-ui-lucide-icons',
    resolveId(id: string) {
      if (id.startsWith(VIRTUAL_PREFIX)) return RESOLVED_PREFIX + id.slice(VIRTUAL_PREFIX.length);
    },
    load(id: string) {
      if (!id.startsWith(RESOLVED_PREFIX)) return;
      const iconName = id.slice(RESOLVED_PREFIX.length);
      const svg = lucideIconMap[iconName];
      if (!svg) return null;
      const inner =
        svg
          .match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1]
          ?.replace(/>\s+</g, '><')
          .trim() ?? '';
      return `import{h}from'vue';export default{inheritAttrs:false,render(){return h('svg',{xmlns:'http://www.w3.org/2000/svg',width:'24',height:'24',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.5','stroke-linecap':'round','stroke-linejoin':'round',...this.$attrs,innerHTML:${JSON.stringify(inner)}})}}`;
    },
  };
}

// eslint-disable-next-line prefer-const
let config = defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Icons({ compiler: 'vue3', autoInstall: true }),
    lucideIconsPlugin(),
    {
      name: 'cjs-to-esm',
      enforce: 'pre' as const,
      transform(code: string, id: string) {
        if (!id.includes('node_modules')) return;
        if (
          code.includes('export default') ||
          code.includes('export {') ||
          code.includes('export const') ||
          code.includes('export function')
        )
          return;
        if (!code.includes('module.exports') && !code.includes('exports.')) return;
        return {
          code: `const module={exports:{}};const exports=module.exports;\n${code}\nexport default module.exports;`,
          map: null,
        };
      },
    },
    viteStaticCopy({
      targets: [
        {
          src: [
            `${normalizePath(swaggerUiPath)}/*.{js,css,html,png}`,
            `!${normalizePath(swaggerUiPath)}/**/index.html`,
            normalizePath(fileURLToPath(new URL('./dist/axios.min.js', import.meta.resolve('axios/package.json')))),
            normalizePath(fileURLToPath(new URL('./src/main/webapp/swagger-ui/index.html', import.meta.url))),
          ],
          dest: 'swagger-ui',
        },
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      base: '/',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/management/, /^\/v3/],
        runtimeCaching: [
          {
            urlPattern: /^\/api\/v1\/products/,
            handler: 'CacheFirst' as const,
            options: {
              cacheName: 'products-cache',
              expiration: { maxAgeSeconds: 3600, maxEntries: 200 },
            },
          },
          {
            urlPattern: /^\/api\/v1\/exchange-rates/,
            handler: 'NetworkFirst' as const,
            options: { cacheName: 'rates-cache' },
          },
        ],
      },
      manifest: {
        name: 'TbPos — Point of Sale',
        short_name: 'TbPos',
        description: 'Point of Sale system for Zimbabwean retail',
        theme_color: '#171717',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/pos',
        icons: [
          { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  root: fileURLToPath(new URL('./src/main/webapp/', import.meta.url)),
  publicDir: fileURLToPath(new URL('./target/classes/static/public', import.meta.url)),
  cacheDir: fileURLToPath(new URL('./src/main/webapp/.vite-cache', import.meta.url)),
  build: {
    emptyOutDir: true,
    outDir: fileURLToPath(new URL('./target/classes/static/', import.meta.url)),
    rollupOptions: {
      input: {
        app: fileURLToPath(new URL('./src/main/webapp/index.html', import.meta.url)),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/main/webapp/app/', import.meta.url)),
      '@content': fileURLToPath(new URL('./src/main/webapp/content/', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'dayjs', 'frappe-ui', 'highlight.js/lib/core', 'debug'],
    esbuildOptions: {
      plugins: [
        {
          name: 'stub-virtual-icons',
          setup(build: any) {
            build.onResolve({ filter: /^~icons\// }, (args: any) => ({
              path: args.path,
              namespace: 'virtual-icon-stub',
            }));
            build.onLoad({ filter: /.*/, namespace: 'virtual-icon-stub' }, () => ({
              contents: 'export default {}',
              loader: 'js',
            }));
          },
        },
      ],
    },
  },
  define: {
    I18N_HASH: '"generated_hash"',
    SERVER_API_URL: '"/"',
    APP_VERSION: `"${process.env.APP_VERSION ? process.env.APP_VERSION : 'DEV'}"`,
  },
  server: {
    host: true,
    port: 9000,
    fs: {
      allow: [fileURLToPath(new URL('.', import.meta.url))],
    },
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; frame-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://storage.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' ws://localhost:9000 http://localhost:9000 ws://localhost:8080 http://localhost:8080",
    },
    proxy: Object.fromEntries(
      ['/api', '/management', '/v3/api-docs', '/h2-console'].map(res => [
        res,
        {
          target: 'http://localhost:8080',
          configure: (proxy: any) => {
            proxy.on('proxyRes', (_proxyRes: any, _req: any, res: any) => {
              res.removeHeader('Content-Security-Policy');
            });
          },
        },
      ]),
    ),
  },
});

// jhipster-needle-add-vite-config - JHipster will add custom config

export default config;
