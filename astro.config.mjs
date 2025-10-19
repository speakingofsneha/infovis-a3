import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://speakingofsneha/infovis-a3',
  base: '/infovis-a3',
  integrations: [react()]
});
