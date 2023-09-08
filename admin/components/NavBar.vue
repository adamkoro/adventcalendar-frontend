<template>
    <nav class="mt-1 mx-2 bg-green-900 border-b-2 rounded-lg border-orange-600 text-white dark:text-black">
        <div class="w-full flex items-center justify-between p-3">
            <div class="flex items-center">
                <img src="~/assets/pictures/geeko.svg" class="h-6 mr-2" />
                <div class="text-xl font-semibold ">AdventCalendar Admin Center</div>
            </div>
            <div class="flex items-center hover:text-orange-600">
                <div class="flex items-center">Welcome, {{ username }}</div>
            </div>
            <div class="hidden w-full md:block md:w-auto ">
                <ul class="font-medium flex gap-3 items-center">
                    <div class="">
                        <LightDarkButton />
                    </div>
                    <UButton>
                        <NuxtLink to="/admin/home">Home</NuxtLink>
                    </UButton>
                    <UButton>
                        <NuxtLink to="/admin/users">Users</NuxtLink>
                    </UButton>
                    <UButton @click="logout" label="Logout" />
                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
const username = useCookie('username')
const logout = async () => {
    const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/logout', {
        method: 'POST',
        headers: useRequestHeaders(['authorization', 'cookie',]),
        credentials: 'include',
    })
    if (error.value != null) {
        alert(error.value.data.error)
        return
    }
    if (data.value.status == 'Logout successful') {
        deleteCookie("username")
        navigateTo('/admin/login', { redirect: true })
    }
    else {
        alert(data.value.data.error)
    }
}
const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})
</script>