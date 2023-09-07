export async function useLogin(username, password) {
    if (username.value == '' || password.value == '') {
        alert('Please enter a username and password')
        return
    }
    const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl+'/api/login', {
    method: 'POST',
    body: JSON.stringify({username: username.value, password: password.value}),
    headers: useRequestHeaders(['authorization','cookie',]),
    credentials: 'include',
    })
    if (error.value != null){
        alert(error.value.data.error)
        return
    }
    if (data.value.status == 'Login successful') {
        const usernameCookie = useCookie('username')
        usernameCookie.value = username.value
        navigateTo('/admin/home',{ redirect: true })
    }
    else {
        alert(data.value.data.error)
    }
}