export default defineNuxtRouteMiddleware(async (to, from) => {
    const tokenCookie = useCookie('token');
    const token = tokenCookie.value;

    if (!token) {
        return navigateTo(`/admin/login`, { redirectCode: 301 })
    } else {
        return navigateTo(`/admin/home`, { redirectCode: 301 })
    }
});