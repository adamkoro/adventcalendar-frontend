<template>
  <div>
    <NavBar />
    <div class="w-full p-2 flex justify-between items-center">
        <div class="w-auto">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" v-model="filterInput" placeholder="Search for user..." />
        </div>
        <div class="w-auto">
          <UButton icon="i-heroicons-arrow-path-20-solid" label="Update"/>
        </div>
        <div class="w-auto justify-end space-x-2">
          <UButton icon="i-heroicons-plus-20-solid" label="Create"/>
          <UButton icon="i-heroicons-pencil-square-20-solid" label="Edit"/>
          <UButton icon="i-heroicons-no-symbol-20-solid" label="Delete"/>
        </div>
      </div>
    <UTable v-model="selected" @select="select" :rows="filteredRows" :columns="columns" :loading="pending" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }" :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">
    </UTable>
  </div>
</template>
  
<script setup>
const config = useRuntimeConfig();
const { data: users, error, pending } = await useFetch(config.public.apiUrl + '/api/admin/users', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
})
const filterInput = ref('')
const selected = ref([users[1]])
function select (row) {
  const index = selected.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}
const filteredRows = computed(() => {
  if (!filterInput.value) {
    return users.value
  }
  return users.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(filterInput.value.toLowerCase())
    })
  })
})
useHead({
  title: `User Management`,
  link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})

definePageMeta({
})
</script>
  