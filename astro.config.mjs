import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://speakingofsneha.github.io',
  base: '/astro-demo',
  integrations: [react()]
});
