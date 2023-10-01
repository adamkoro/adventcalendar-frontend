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

nuxtStorage.localStorage.setData('activeNavLink', 'home', 1440)

useHead({
    title: `Admin Home`,
})
definePageMeta({
    middleware: checkCookie
})
</script>