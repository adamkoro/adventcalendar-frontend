<template>
    <div class="font-poppins-semibold suse-text-black">
        <div class="flex flex-col items-center justify-center py-5">
            <div>
                <Header/>
            </div>
            <div class="bg-suse-light-green border-2 rounded-lg border-suse-info-text px-6 py-4 text-xl cursor-pointer">
                <input class="rounded-[5px] drop-shadow-md" type="username" v-model="username" id="username" placeholder="Enter your username" />
            </div>
            <div class="mt-5 bg-suse-light-green border-2 rounded-lg border-suse-info-text px-6 py-4 text-xl cursor-pointer">
                <input class="rounded-[5px] drop-shadow-md" type="password" v-model="password" id="password" placeholder="Enter your password" />
            </div>
            <div @click="login" class="mt-10 mx-2 text-suse-text bg-suse-light-green border-2 rounded-lg border-suse-info-text px-6 py-4 text-xl cursor-pointer ransition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300">
                <button type="button">Login</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const username = ref('')
const password = ref('')
const login = async () => {
        if (username.value == '' || password.value == '') {
            alert('Please enter a username and password')
            return
        }
        await useFetch(useRuntimeConfig().public.apiUrl+'/api/login', {
        method: 'POST',
        body: JSON.stringify({username: username.value, password: password.value}),
        headers: useRequestHeaders(['authorization','cookie',]),
        credentials: 'include',
        }).catch((error) => {
            console.log("error", error)
        }).finally(() => {
            navigateTo('/admin/home', { replace: true, redirectCode: 301 })
        })
    }

useHead({
    title: `Admin Login`,
    link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
definePageMeta({
})



</script>