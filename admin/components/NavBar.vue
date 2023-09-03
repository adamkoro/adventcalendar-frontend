<template>
    <nav class="font-poppins-semibold mt-1 mx-2 bg-suse-text-light-bg border-b-2 rounded-lg border-suse-info-text">
        <div class="flex items-center justify-between p-3">
            <div class="flex items-center">
                <img src="~/assets/pictures/geeko.svg" class="h-6 mr-2" />
                <span class="text-xl font-semibold whitespace-nowrap dark:text-white text-suse-text">AdventCalendar Admin Center</span>
            </div>
            <div class="hidden w-full md:block md:w-auto text-suse-text">
                <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
                    <div class="hover:text-suse-info-text">
                        <div class="text-gray-600 dark:text-gray-400">Welcome, {{ userName }}</div>
                    </div>
                    <div class="hover:text-suse-info-text">
                        <a href="/admin/home">Home</a>
                    </div>
                    <div class="hover:text-suse-info-text">
                        <a href="/admin/users">Users</a>
                    </div>
                    <div class="hover:text-suse-info-text">
                        <button class="text-white" @click="logout">Logout</button>
                    </div>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
const logout = async () => {
    await useFetch(useRuntimeConfig().public.apiUrl+'/api/logout', {
        method: 'POST',
        headers: useRequestHeaders(['authorization','cookie',]),
        credentials: 'include',
        }).catch((error) => {
            console.log("error", error)
        }).finally(() => {
            navigateTo('/admin/login', { replace: true, redirectCode: 301 })
        })
}
const userName = computed(() => {
    return "TEST"
})

</script>