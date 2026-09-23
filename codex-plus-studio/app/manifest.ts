export default {
  name: 'Codex+ Unified Studio',
  short_name: 'Codex+ Studio',
  description: 'AI-driven premium app studio with Pollinations visuals and Vercel previews.',
  start_url: '/',
  display: 'standalone',
  background_color: '#050816',
  theme_color: '#050816',
  lang: 'en',
  orientation: 'portrait-primary',
  icons: [
    {
      src: 'https://image.pollinations.ai/prompt/premium_glassmorphism_app_icon?width=192&height=192&nologo=true',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: 'https://image.pollinations.ai/prompt/premium_glassmorphism_app_icon?width=512&height=512&nologo=true',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ]
};
