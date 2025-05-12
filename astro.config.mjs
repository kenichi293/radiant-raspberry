// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'; // ✅ React を追加！

// https://astro.build/config
export default defineConfig({
  integrations: [react()] // ✅ React 統合を設定！
});
