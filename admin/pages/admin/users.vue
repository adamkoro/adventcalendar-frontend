<template>
  <div>
    <NavBar />
    <div class="grid grid-cols-1 gap-4 py-10">
      <ul class="flex items-center justify-center" v-for="user in users" :key="user.id">
        <li class="rounded-[5px] bg-suse-light-green text-suse-text text-center text-l border-2 cursor-pointer px-6 py-4" >
          <div class="">
            <p>ID: {{ user.id }}</p>
          </div>
          <div class="">
            <p>Username: {{ user.username }}</p>
          </div>
          <div class="">
            <p>Email: {{ user.email }}</p>
          </div>
          <div class="">
            <p>Created: {{ user.created }}</p>
          </div>
          <div class="">
            <p>Modified: {{ user.modified }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script setup>
const config = useRuntimeConfig();
const { data: users, error } = await useFetch(config.public.apiUrl + '/api/admin/users', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
})
useHead({
  title: `User Management`,
  link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
definePageMeta({
})
</script>
  