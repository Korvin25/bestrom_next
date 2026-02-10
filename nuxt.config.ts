// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image'],
  image: {
    provider: 'ipx',
    domains: ['bestrom.ru']
  },
  css: ['~/assets/styles/theme.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'БЕСТРОМ',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://bestrom.ru/api/',
      mediaBase: 'https://bestrom.ru/',
      raskroyBase: 'https://bestrom.su/',
      siteUrl: 'https://bestrom.ru'
    }
  },
  routeRules: {
    '/service/raskroy-paketov/': { redirect: '/cutting' },
    '/service/3/': { redirect: '/catalog' },
    '/product/**': { redirect: '/catalog' },
    '/by_package/**': { redirect: '/catalog/type/podbor-po-tipu-upakovki/' },
    '/by_product/**': { redirect: '/catalog/type/podbor-po-tipu-produkta/' },
    '/by_type/**': { redirect: '/catalog/type/podbor-po-tipu-mashiny/' }
  }
})
