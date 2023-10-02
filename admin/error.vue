<template>
    <NuxtLayout>
        <div class="cursor-default">
            <div class="flex flex-col items-center justify-center py-5 w-full">
                <div>
                    <ErrorHeader />
                </div>
                <div class="mt-10 flex flex-col">
                    <label class="border-2 border-red-500 rounded-lg font-semibold p-3 bg-red-500 text-white text-xl">Error
                        Status Code</label>
                </div>
                <div class="flex flex-col mb-10">
                    <div class="text-center mt-5 border-2 border-red-500 rounded-lg text-lg font-semibold mx-10 py-2 px-10">
                        {{ error.statusCode }}
                    </div>
                </div>
                <div class="flex flex-col text-center">
                    <label class="border-2 border-red-500 rounded-lg font-semibold p-3 bg-red-500 text-white text-xl">Error
                        Message</label>
                </div>
                <div class="flex flex-col text-center">
                    <div class="text-center mt-5 border-2 border-red-500 rounded-lg text-lg font-semibold p-2">
                        {{ error.message }}
                    </div>
                </div>
                <div class="mt-10">
                    <UButton to="/admin/login" target="_parent" icon="i-heroicons-arrow-right-on-rectangle" size="xl"
                        label="Return to login page" color="red" />
                </div>
                <div class="mt-20">
                    <UTooltip text="Clear page data, such as localstorage and cookies.">
                        <UButton icon="i-heroicons-trash" size="xl" label="Clear local data" color="red"
                            @click="clearLocalData" />
                    </UTooltip>
                </div>
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
const clearLocalData = () => {
    localStorage.removeItem('activeNavLink')
    deleteCookie('username')
    useFetch(useRuntimeConfig().public.authUrl + '/api/auth/logout', {
        method: 'POST',
        headers: useRequestHeaders(['authorization', 'cookie',]),
        credentials: 'include',
    })

}
</script>