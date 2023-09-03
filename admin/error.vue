<template>
    <NuxtLayout>
        <div class="grid grid-cols-1 text-suse-text">
            <div class="flex justify-center py-10">
                <div class=" rounded-[5px] font-poppins-semibold bg-suse-light-green px-6 py-4 text-xl border-2 border-suse-info-text">
                    <div class="flex justify-center">
                        <p>Hoppá...</p>
                    </div>
                    <div class="flex justify-center">
                        <p>Hiba történt</p>
                    </div>
                    <div class="text-suse-text">
                        <p>{{ error.message }}</p>
                    </div>
                </div>
            </div>
            <div class="flex justify-center py-10">
                <a class="cursor-pointer rounded-[5px] font-poppins-semibold bg-suse-light-green text-suse-text text-center px-6 py-4 text-xl border-2 border-suse-info-text transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
                    @click="handleError">Vissza a fő oldalra</a>
            </div>
        </div>
    </NuxtLayout>
</template>


<script setup>
useHead({
    title: `Hiba történt`,
    link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})

const error = useError();
const handleError = () => {
    clearError({
        redirect:
            '/',
    })
}
</script>