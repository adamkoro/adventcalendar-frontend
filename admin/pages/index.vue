<template></template>

<script setup>
import routeToLogin from "~/middleware/routeToLogin";


definePageMeta({
    middleware: routeToLogin
})
</script>