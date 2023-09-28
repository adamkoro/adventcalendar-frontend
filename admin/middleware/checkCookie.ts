export default defineNuxtRouteMiddleware((to, from) => {
    var cookie = useCookie('token')
    if (cookie.value !== '' || cookie.value !== undefined || cookie.value !== null){
        return navigateTo('/admin/home')
    }
})