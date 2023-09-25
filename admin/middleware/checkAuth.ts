export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path == '/'){
        return navigateTo('/admin/login')
    }
    const cookie = useCookie('token')
    if (cookie && cookie.value) {
        console.log('cookie', cookie.value)
    } else {
        console.log('no cookie')
    }
})