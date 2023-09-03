<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#FE7C3F" />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
useHead({
  title: 'Adventi Kalendárium',
  link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
</script>
