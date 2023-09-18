<script setup>
definePageMeta({
    middleware: [
        function (to, from) {
            const token = useCookie('token')
            if (token.value) {
                navigateTo('/admin/home',{ redirect: true })
            }
            navigateTo('/admin/login',{ redirect: true })
        }
    ],
})
</script>