<template>
    <div class="rounded-[5px] font-poppins-semibold bg-suse-light-green text-suse-text text-center px-6 py-4 text-xl border-2 cursor-pointer" :class="{
    'border-suse-info-text': !isWatched,
    'border-suse-text': isWatched}">
        {{ day }}
    </div>
</template>

<script setup>
defineProps({
    isWatched: {
        type: Boolean,
        default: false
    },
    day: {
        type: Number
    }
    
})
</script>