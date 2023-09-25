// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true, },
  modules: ['@nuxt/ui', ],

  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8080',
      mailUrl: 'http://localhost:8082',
      authUrl: 'http://localhost:8086',
      publicUrl: 'http://localhost:8088',
    },
  },
})
