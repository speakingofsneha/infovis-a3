import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://speakingofsneha.github.io',
  base: '/infovis-a3',
  integrations: [react()]
});
