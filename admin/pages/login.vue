<template>
    <div class="text-black cursor-pointer">
        <div class="flex flex-col items-center justify-center py-5">
            <div>
                <LoginHeader />
            </div>
            <UForm :schema="loginSchema" :state="state" @submit="login">
                <div class="p-2">
                    <UFormGroup size="xl" label="Username" name="username"
                        :ui="{ label: { base: 'font-semibold text-black text-xl',wrapper: 'justify-center' } }" error>
                        <UInput v-model="state.username" placeholder="Enter your username..." />
                    </UFormGroup>
                </div>
                <div class="p-2">
                    <UFormGroup size="xl" label="Password" name="password"
                        :ui="{ label: { base: 'font-semibold text-black text-xl', wrapper: 'justify-center' } }" error>
                        <UInput v-model="state.password" type="password" placeholder="Enter your password..." />
                    </UFormGroup>
                </div>
                <UContainer v-model="isLoginError">
                    <div class="text-center text-red-500">
                        {{ loginError }}
                    </div>
                </UContainer>
                <div class="flex justify-center p-4">
                    <UButton type="submit" size="xl" label="Login">
                        <template #trailing>
                            <UIcon name="i-heroicons-arrow-right-20-solid" />
                        </template>
                    </UButton>
                </div>
            </UForm>
            <ThemeSwitchButton />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { string, object, minLength, maxLength } from 'valibot';
import checkCookieAtLogin from '~/middleware/checkCookieAtLogin';
///////////////////////////
// Variables
///////////////////////////
const isLoginError = ref(false)
const loginError = ref('')
const toast = useToast()
const router = useRouter()
///////////////////////////
// State
///////////////////////////
function initialState() {
    return {
        username: undefined,
        password: undefined,
    }
}
const state = ref({ ...initialState })
///////////////////////////
// Schema validation
///////////////////////////
const loginSchema = object({
    username: string([minLength(1, 'Required'),maxLength(32, 'Username must be less than 32 characters')]),
    password: string([minLength(4, 'Required')]),
})
///////////////////////////
// Login function
///////////////////////////
async function login() {
    const { data, error } = await useFetch(useRuntimeConfig().public.authUrl + '/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: state.value.username, password: btoa(state.value.password) }),
        headers: useRequestHeaders(['authorization', 'cookie',]),
        credentials: 'include',
    })
    if (error.value != null && error.value.message.includes('Failed to fetch')) {
        isLoginError.value = true
        loginError.value = 'Failed to connect to auth server'
        return
    }
    if (error.value != null && error.value?.statusCode === 401) {
        isLoginError.value = true
        loginError.value = 'Invalid username or password'
        return
    }
    const responseData = data.value
    if (responseData.status == 'login successful') {
        setCookie("username", state.value.username)
        router.push('/home')
        toast.add({ title: 'Login successful', description: 'You have been logged in successfully as ' + state.value.username, icon: 'i-heroicons-check-circle-20-solid' })
    }
    else {
        isLoginError.value = true
    }
}
///////////////////////////
// Page meta
///////////////////////////
useHead({
    title: `Admin Login`,
    link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
definePageMeta({
    middleware: checkCookieAtLogin
})
</script>