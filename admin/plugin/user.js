import { defineNuxtPlugin, useState } from '#app'
export default defineNuxtPlugin(() => {
    const username = useState('username', () => '')
})