// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ['@nuxtjs/tailwindcss','@dargmuesli/nuxt-cookie-control'],
  /*colorMode: {
    classSuffix: ''
  },*/
  tailwindcss: {
  cssPath: '~/assets/css/tailwind.css',
  configPath: 'tailwind.config.js',
  exposeConfig: false,
  config: {},
  injectPosition: 0,
  viewer: true,
  },
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8080',
    },
  },
}
)