<template>
    <NavBar />
    <div class="flex flex-col items-center justify-center">
        <div class="text-3xl font-semibold">Welcome to the admin panel!</div>
        <div class="text-xl font-semibold">Please use the navigation bar above to navigate the admin panel.</div>
    </div>
</template>

<script setup>
import checkCookie from '~/middleware/checkCookie'

useHead({
    title: `Admin Home`,
})
definePageMeta({
    middleware: checkCookie
})
</script>