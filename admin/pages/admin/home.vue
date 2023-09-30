<template>
    <NavBar />
    <div class="flex flex-col items-center justify-center">
        <div class="text-3xl font-semibold">Welcome to the admin panel!</div>
        <div class="text-xl font-semibold">Please use the navigation bar above to navigate the admin panel.</div>
    </div>
</template>

<script setup>
import nuxtStorage from 'nuxt-storage'
import checkCookie from '~/middleware/checkCookie'

nuxtStorage.localStorage.setData('activeNavLink', 'home')

useHead({
    title: `Admin Home`,
    link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
definePageMeta({
    middleware: checkCookie
})
</script>