<template>
    <div class="has-tooltip">
        <span class='tooltip rounded-[5px] p-1 bg-suse-terminal text-suse-text text-xs -mt-5'>{{ copy.value ? 'Copied!' : 'Click' }}</span>
        <button class="text-suse-text text-xs" @click="copy(copyData)">
            Copy
        </button>
    </div>
</template>

<script setup>
defineProps({
    copyData: {
        type: String,
    }
})
const copy = (data) => {
    try {
        navigator.clipboard.writeText(data)
    } catch(e) {
    console.log(e)
    }
}

</script>