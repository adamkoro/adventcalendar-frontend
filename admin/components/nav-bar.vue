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
                <div v-if="activeNavLink == 'home'">
                    <li class="p-4 border-b-2 border-primary-500 border-opacity-100 text-primary-500 cursor-pointer">
                        <NuxtLink to="/home" >Home</NuxtLink>
                    </li>
                </div>
                <div v-else >
                    <li class="p-4 border-b-2 border-primary-500 border-opacity-0 hover:border-opacity-100 hover:text-primary-500 duration-200 cursor-pointer">
                        <NuxtLink to="/home" >Home</NuxtLink>
                    </li>
                </div>
                <div v-if="activeNavLink == 'days'">
                    <li class="p-4 border-b-2 border-primary-500 border-opacity-100 text-primary-500 cursor-pointer">
                        <NuxtLink to="days" >Days</NuxtLink>
                    </li>
                </div>
                <div v-else >
                <li
                    class="p-4 border-b-2 border-primary-500 border-opacity-0 hover:border-opacity-100 hover:text-primary-500 duration-200 cursor-pointer">
                    <NuxtLink to="/days" >Days</NuxtLink>
                </li>
                </div>
                <div v-if="activeNavLink == 'users'">
                    <li class="p-4 border-b-2 border-primary-500 border-opacity-100 text-primary-500 cursor-pointer">
                        <NuxtLink to="/users" >Users</NuxtLink>
                    </li>
                </div>
                <div v-else >
                <li
                    class="p-4 border-b-2 border-primary-500 border-opacity-0 hover:border-opacity-100 hover:text-primary-500 duration-200 cursor-pointer">
                    <NuxtLink to="/users" >Users</NuxtLink>
                </li>
                </div>
                <div v-if="activeNavLink == 'emails'">
                    <li class="p-4 border-b-2 border-primary-500 border-opacity-100 text-primary-500 cursor-pointer">
                        <NuxtLink to="/emails" >Emails</NuxtLink>
                    </li>
                </div>
                <div v-else >
                <li
                    class="p-4 border-b-2 border-primary-500 border-opacity-0 hover:border-opacity-100 hover:text-primary-500 duration-200 cursor-pointer">
                    <NuxtLink to="/emails" >Emails</NuxtLink>
                </li>
                </div>
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
const activeNavLink = localStorage.getItem('activeNavLink')
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
        nuxtStorage.localStorage.removeItem('activeNavLink')
        navigateTo('/login',{
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