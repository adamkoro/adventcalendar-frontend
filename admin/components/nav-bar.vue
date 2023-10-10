<template>
    <header
        class="header sticky top-2 bg-white dark:bg-slate-800 shadow-md flex items-center justify-between px-4 mb-5 rounded">
        <!-- logo -->
        <h1 class="w-1/3">
            <div class="flex items-center gap-1 cursor-pointer">
                <img src="~/assets/images/geeko.svg" class="h-6" />
                <NuxtLink to="/home" class="text-l font-semibold ">AdventCalendar Admin Center</NuxtLink>
            </div>
        </h1>
        <nav class="nav font-semibold">
            <ul class="flex items-center">
                <li class="p-4 cursor-pointer"
                    :class="{ 'border-b-2 border-primary-500  border-opacity-100 text-primary-500': route.path === '/home' }">
                    <NuxtLink to="/home">Home</NuxtLink>
                </li>
                <li class="p-4 cursor-pointer"
                    :class="{ 'border-b-2 border-primary-500  border-opacity-100 text-primary-500': route.path === '/days' }">
                    <NuxtLink to="/days">Days</NuxtLink>
                </li>
                <li class="p-4 cursor-pointer"
                    :class="{ 'border-b-2 border-primary-500  border-opacity-100 text-primary-500': route.path === '/users'}">
                    <NuxtLink to="/users">Users</NuxtLink>
                </li>
                <li class="p-4 cursor-pointer"
                :class="{ 'border-b-2 border-primary-500  border-opacity-100 text-primary-500': route.path === '/emails'}">
                <NuxtLink to="/emails">Emails</NuxtLink>
            </li>
            </ul>
        </nav>
        <div class="w-1/3 flex justify-end gap-2">
            <div class="flex font-semibold items-center">
                <div class="">Welcome,</div>
                <div class="ml-1 text-orange-600">{{ username }}</div>
            </div>

            <div class="">
                <ThemeSwitchButton />
            </div>
            <UButton @click="logout" label="Logout" />
        </div>
    </header>
</template>
<script setup>
const route = useRoute()
const username = useCookie('username')
const logout = async () => {
    const { data, error } = await useFetch(useRuntimeConfig().public.authUrl + '/api/auth/logout', {
        method: 'POST',
        headers: useRequestHeaders(['authorization', 'cookie',]),
        credentials: 'include',
    })
    if (error.value != null) {
        alert(error.value.data.error)
        return
    }
    if (data.value.status === 'logout successful') {
        deleteCookie("username")
        localStorage.removeItem('activeNavLink')
        navigateTo('/login', {
            replace: true,
            redirectCode: 302,
            external: false,
            open: false,
        })
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