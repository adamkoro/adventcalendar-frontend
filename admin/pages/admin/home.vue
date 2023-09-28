<template>
    <NavBar/>
    <div>
        <div class="w-full p-2 flex justify-between items-center"/>
    </div>
</template>

<script setup>
import nuxtStorage from 'nuxt-storage'
nuxtStorage.localStorage.setData('activeNavLink', 'home')
useHead({
    title: `Admin Home`,
    link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
definePageMeta({

})
</script>