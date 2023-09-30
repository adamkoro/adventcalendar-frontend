export default defineNuxtRouteMiddleware((to, from) => {
    const cookie = useCookie('token');
    if (cookie.value !== '' && typeof cookie.value === 'string') {
        return true;
    }
    if (cookie.value !== '' && typeof cookie.value === 'string' && to.path === '/admin/login') {
        return navigateTo('/admin/home');
    }
    if ((cookie.value === '' || cookie.value === null || cookie.value === 'undefined') && (typeof cookie.value === 'string' || typeof cookie.value === 'undefined' || typeof cookie.value === null)) {
        abortNavigation();
        return navigateTo('/');
    }
})