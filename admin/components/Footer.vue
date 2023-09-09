<template>
    <div class="fixed inset-x-0 bottom-0">
        <div class="font-poppins-semibold cursor-default">
            <div class="text-center text-xs">
            <span>
                © {{ actualYear }} Copyright:
                <NuxtLink to="https://github.com/adamkoro/adventcalendar-frontend" target="_blank">Github</NuxtLink>
            </span>
            </div>
        </div>
    </div>
</template>
<script setup>
const actualYear = new Date().getFullYear()
</script>