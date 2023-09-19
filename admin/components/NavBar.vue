<template>
    <header class="header sticky top-2 bg-white dark:bg-slate-800 shadow-md flex items-center justify-between px-4 mb-5 rounded">
        <!-- logo -->
        <h1 class="w-1/3">
            <div class="flex items-center gap-1 cursor-pointer">
                <img src="~/assets/pictures/geeko.svg" class="h-6" />
                <NuxtLink to="/admin/home" class="text-l font-semibold ">AdventCalendar Admin Center</NuxtLink>
            </div>
        </h1>
        <nav class="nav font-semibold">
            <ul class="flex items-center">
                <li class="p-4 border-b-2 border-primary-500 border-opacity-0 hover:border-opacity-100 hover:text-primary-500 duration-200 cursor-pointer">
                    <NuxtLink to="/admin/home">Home</NuxtLink>
                </li>
                <li class="p-4 border-b-2 border-primary-500 border-opacity-0 hover:border-opacity-100 hover:text-primary-500 duration-200 cursor-pointer">
                    <NuxtLink to="/admin/users">Users</NuxtLink>
                </li>
                <li class="p-4 border-b-2 border-primary-500 border-opacity-0 hover:border-opacity-100 hover:text-primary-500 duration-200 cursor-pointer">
                    <NuxtLink to="/admin/emails">Emails</NuxtLink>
                </li>
            </ul>
        </nav>
        <div class="w-1/3 flex justify-end gap-2">
            <div class="flex font-semibold items-center">
                <div class="">Welcome,</div>
                <div class="ml-1 text-orange-600">{{ username }}</div>
            </div>
            
            <div class="">
                <LightDarkButton />
            </div>
            <UButton @click="logout" label="Logout" />
        </div>
    </header>
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