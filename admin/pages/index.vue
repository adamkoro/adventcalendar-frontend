<script setup>
import login from '~/middleware/login';
definePageMeta({
    middleware: login
})
</script>