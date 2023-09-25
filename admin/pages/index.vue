<template>

</template>

<script setup>
import checkAuth from "~/middleware/checkAuth"
definePageMeta({
    middleware: checkAuth
})
</script>