<template>
    <NuxtLayout>
        <div class="grid grid-cols-1">
            <div class="flex justify-center py-10">
                <div class=" rounded-[5px] font-poppins-semibold bg-suse-light-green px-6 py-4 text-xl border-2">
                    <div class="flex justify-center">
                        <p>Hups....</p>
                    </div>
                    <div class="flex justify-center">
                        <p>Error occurred</p>
                    </div>
                    <div class="">
                        <p>{{ error.message }}</p>
                    </div>
                </div>
            </div>
            <div class="flex justify-center py-10">
                <a class="cursor-pointer rounded-[5px] font-poppins-semibold bg-suse-light-green t text-center px-6 py-4 text-xl border-2  transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
                    @click="handleError">Return to login page</a>
            </div>
        </div>
    </NuxtLayout>
</template>


<script setup>
useHead({
    title: `Error occurred`,
    link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})

const error = useError();
const handleError = () => {
    clearError({
        redirect:
            '/admin/login',
    })
}
</script>