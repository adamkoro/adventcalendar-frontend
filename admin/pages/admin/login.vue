<template>
    <div class="text-black cursor-pointer">
        <div class="flex flex-col items-center justify-center py-5">
            <div>
                <Header/>
            </div>
            <UForm :validate="validate" :state="state" @submit="login">
                <div class="p-2">
                    <!--label class="text-white dark:text-white text-xl">Username</label-->
                    <UFormGroup size="xl" label="Username" name="username" :ui="{ label: { base: 'font-semibold text-black text-xl' } }" error>
                        <UInput v-model="state.username" placeholder="Enter your username..."/>
                    </UFormGroup>
                </div>
                <div class="p-2">
                <UFormGroup size="xl" label="Password" name="password" :ui="{ label: { base: 'font-semibold text-black text-xl' } }" error>
                    <!--label class="text-white dark:text-white text-xl">Password</label-->
                    <UInput v-model="state.password" type="password" placeholder="Enter your password..."/>
                </UFormGroup>
                </div>
                <Ucard v-model="isLoginError">
                    <div class="text-center text-red-500">
                    {{ loginError }}
                    </div>
                </Ucard>
                <div class="flex justify-center p-4">
                    <UButton type="submit" size="xl" label="Login" >
                        <template #trailing>
                            <UIcon name="i-heroicons-arrow-right-20-solid" />
                        </template>
                    </UButton>
                </div>
            </UForm>
            <LightDarkButton/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { string, object, minLength, Input } from 'valibot'
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const isLoginError = ref(false)
const loginError = ref('')
const toast = useToast()
const schema = object({
    username: string([minLength(1, 'Required')]),
    password: string([minLength(1, 'Required')])
})
type Schema = Input<typeof schema>
const state = ref({
    username: undefined,
    password: undefined
})
const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.username) errors.push({ path: 'username', message: 'Required' })
    if (!state.password) errors.push({ path: 'password', message: 'Required' })
    return errors
}
async function login(event: FormSubmitEvent<Schema>) {
        const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl+'/api/login', {
        method: 'POST',
        body: JSON.stringify({username: state.value.username, password: state.value.password}),
        headers: useRequestHeaders(['authorization','cookie',]),
        credentials: 'include',
        })
        if (error.value != null){
            isLoginError.value = true
            loginError.value = error.value.data.error
            return
        }
        if (data.value.status == 'Login successful') {
            setCookie("username", state.value.username)
            navigateTo('/admin/home',{ redirect: true })
            toast.add({ title: 'Login successful', description: 'You have been logged in successfully as '+state.value.username, icon: 'i-heroicons-check-circle-20-solid' })

        }
        else {
            isLoginError.value = true
        }
    }
useHead({
    title: `Admin Login`,
    link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
definePageMeta({
    //middleware: ["auth"]
    // or middleware: 'auth'
})
/*definePageMeta({
    async validate({ params }) {
        const { data, error } = await useAsyncData('data', () => $fetch(`/api/${year}/day/${day}`))
        if (error.value === null){
            return true
        }
        if (error.value.message.split(" ")[0] === "403") {
            return createError({
                statusCode: 403,
                message: "Hozzáférés megtagadva"
            })
        }
        if (data.value === null) {
            return createError({
                statusCode: 404,
                message: `Nap nem található`
            })
        }
    return true
    }
})*/


</script>