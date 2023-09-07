export function setCookie(name, value){
    const usernameCookie = useCookie(name)
    usernameCookie.value = value
    return "cookie set"
}

export function getCookie(name){
    const usernameCookie = useCookie(name)
    return usernameCookie.value
}

export function deleteCookie(name){
    const usernameCookie = useCookie(name)
    usernameCookie.value = ""
    return "cookie deleted"
}