<template>
    <div class="fixed inset-x-0 bottom-0">
        <div class="font-poppins-semibold cursor-default">
            <div class="text-center text-xs text-suse-info-text bg-suse-dark-green">
            <span>
                © {{ actualYear }} Copyright:
                <a href="mailto:dfaltum@npsh.hu">Faltum Dániel</a> &
                <a href="mailto:akoronics@npsh.hu">Koronics Ádám</a>
            </span>
            </div>
        </div>
    </div>
</template>
<script setup>
const actualYear = new Date().getFullYear()
</script>