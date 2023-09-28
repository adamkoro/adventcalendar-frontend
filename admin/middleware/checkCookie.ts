export default defineNuxtRouteMiddleware((to, from) => {
    let cookie = useCookie('token')
    if (typeof cookie.value === 'string' && cookie.value.length > 0){
        return navigateTo('/admin/home')
    }
})