<template>
    <nav class="mt-1 mx-2 bg-green-900 border-b-2 rounded-lg border-orange-600 text-white dark:text-black">
        <div class="flex items-center justify-between p-3">
            <div class="flex items-center">
                <img src="~/assets/pictures/geeko.svg" class="h-6 mr-2" />
                <span class="text-xl font-semibold whitespace-nowrap ">AdventCalendar Admin Center</span>
            </div>
            <div class=" hidden w-full md:block md:w-auto ">
                <ul class=" font-medium flex gap-5 items-center">
                    <div class=" hover:text-orange-600">
                        <div class="">Welcome, {{ username }}</div>
                    </div>
                    <div class="hover:text-orange-600">
                        <a href="/admin/home">Home</a>
                    </div>
                    <div class="hover:text-orange-600">
                        <a href="/admin/users">Users</a>
                    </div>
                    <div class="hover:text-orange-600">
                        <button class="" @click="logout">Logout</button>
                    </div>
                    <div class="">
                        <LightDarkButton/>
                    </div>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
const username = useCookie('username')
const logout = async () => {
        const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl+'/api/logout', {
        method: 'POST',
        headers: useRequestHeaders(['authorization','cookie',]),
        credentials: 'include',
        })
        if (error.value != null){
            alert(error.value.data.error)
            return
        }
        if (data.value.status == 'Logout successful') {
            deleteCookie("username")
            navigateTo('/admin/login',{ redirect: true })
        }
        else {
            alert(data.value.data.error)
        }
    }
const colorMode = useColorMode()
const isDark = computed({
    get () {
        return colorMode.value === 'dark'
    },
    set () {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})
</script>