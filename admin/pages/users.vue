<template>
  <NavBar />
  <UContainer>
    <div>
      <div class="flex items-center justify-between p-2">
        <div class="w-1/3">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" v-model="filterInput" placeholder="Search for user..." />
        </div>
        <div class="">
          <UTooltip text="Update user list">
            <UButton icon="i-heroicons-arrow-path-20-solid" label="Refresh" @click="fetchUsers" />
          </UTooltip>
        </div>
        <div class="w-1/3 flex justify-end gap-2">
          <UTooltip text="Create new user">
            <UButton icon="i-heroicons-plus-20-solid" label="Create" @click="isCreateOpen = true" />
          </UTooltip>
          <UTooltip text="Delete selected user(s)">
            <UButton icon="i-heroicons-trash-20-solid" label="Delete" @click="isDeleteOpen = true" />
          </UTooltip>
        </div>
      </div>
      <UTable v-model="selected" @select="select" :rows="filteredRows" :columns="columns" :sort="{ column: 'title' }"
        :loading="pending" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
      <!-------------------------->
      <!-- Create user pattern --->
      <!-------------------------->
      <UModal v-model="isCreateOpen">
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between ">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Create user
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="(isCreateOpen = false)" />
            </div>
          </template>
          <UForm :schema="createUserSchema" :state="state" @submit="createUser">
            <UFormGroup size="lg" label="Username" name="username"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <UInput v-model="state.username" placeholder="Enter username..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Email" name="email" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <UInput v-model="state.email" type="email" placeholder="Enter email..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Password" name="password"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <UInput v-model="state.password" type="password" placeholder="Enter password..." />
            </UFormGroup>
          </UForm>
          <template #footer>
            <div class="flex justify-between">
              <UButton type="cancel" size="xl" label="Cancel"
                @click="(isCreateOpen = false) && (state.username = undefined) && (state.email = undefined) && (state.password = undefined)">
                <template #trailing>
                  <UIcon name="i-heroicons-no-symbol-20-solid" />
                </template>
              </UButton>
              <UButton type="submit" size="xl" label="Create" @click="createUser">
                <template #trailing>
                  <UIcon name="i-heroicons-plus-20-solid" />
                </template>
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
      <!-------------------------->
      <!---- Edit user pattern --->
      <!-------------------------->
      <UModal v-model="isEditOpen">
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between ">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Edit user
                |
                {{ editSelectedUser.username }}
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="(isEditOpen = false) && (editSelectedUser = '')" />
            </div>
          </template>
          <UForm :schema="createUserSchema" :state="state" @submit="updateUser">
            <UFormGroup size="lg" label="Username" name="username"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              {{ editSelectedUser.username }}
            </UFormGroup>
            <UFormGroup size="lg" label="Email" name="email" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <p>Current</p>
              <UInput :readonly="true" v-model="editSelectedUser.email" />
              <p>New</p>
              <UInput v-model="state.email" type="email" placeholder="Enter new email..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Password" name="password"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <UInput v-model="state.password" type="password" placeholder="Enter a new password..." />
            </UFormGroup>
          </UForm>
          <template #footer>
            <div class="flex justify-between">
              <UButton type="cancel" size="xl" label="Cancel" @click="(isEditOpen = false) && (editSelectedUser = '')">
                <template #trailing>
                  <UIcon name="i-heroicons-no-symbol-20-solid" />
                </template>
              </UButton>
              <UButton type="submit" size="xl" label="Save" @click="updateUser">
                <template #trailing>
                  <UIcon name="i-heroicons-check-20-solid" />
                </template>
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
      <!-------------------------->
      <!-- Delete user pattern --->
      <!-------------------------->
      <UModal v-model="isDeleteOpen" prevent-close>
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between ">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Delete user
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="(isDeleteOpen = false); resetState()" />
            </div>
          </template>
          <div v-if="deleteSelectedUser" class="flex flex-wrap gap-1">
            <div class="">Are you sure you want to delete</div>
            <div class="text-red-600">{{ deleteSelectedUser }}</div>
            <div class="">?</div>
          </div>
          <div v-else>
            <div v-if="selected && selected.length > 1" class="flex flex-wrap gap-1">
              <div class="">Are you sure you want to delete</div>
              <div class="text-red-600">{{ selected.length - 1 }} user(s)</div>
              <div class="">?</div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <UButton type="cancel" size="xl" label="Cancel" @click="(isDeleteOpen = false); resetState()">
                <template #trailing>
                  <UIcon name="i-heroicons-no-symbol-20-solid" />
                </template>
              </UButton>
              <UButton type="submit" size="xl" label="Delete" @click="deleteUser">
                <template #trailing>
                  <UIcon name="i-heroicons-trash-20-solid" />
                </template>
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </UContainer>
</template>
  
<script setup>
import { ref } from 'vue'
import { string, object, email, minLength, maxLength } from 'valibot'
import nuxtStorage from 'nuxt-storage'
import checkCookie from '~/middleware/checkCookie';
//////////////////////////
// Set local storage value
//////////////////////////
nuxtStorage.localStorage.setData('activeNavLink', 'users', 1440)
//////////////////////////
// Fetch data
//////////////////////////
const { data: users, error, pending, refresh: fetchUsers } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/usermanage/users', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
})
//////////////////////////
// User state
//////////////////////////
function initialState() {
  return {
    username: undefined,
    email: undefined,
    password: undefined
  }
}
const state = ref({ ...initialState })
function reset() {
  return initialState();
}
function resetState() {
  state.value = reset();
  deleteSelectedUser.value = null
  editSelectedUser.value = null
  selected.value = [users[0]]
}
//////////////////////////
// Variables
//////////////////////////
const filterInput = ref('')
const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const isDeleteOpen = ref(false)
const selected = ref([users[0]])
const deleteSelectedUser = ref('')
const editSelectedUser = ref('')
const toast = useToast()
//////////////////////////
// Table columns
//////////////////////////
const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'created', label: 'Created', sortable: true },
  { key: 'modified', label: 'Updated', sortable: true },
  { key: 'actions' }
]
//////////////////////////
// Table actions
//////////////////////////
const items = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => (isEditOpen.value = true) && (editSelectedUser.value = row)
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => (isDeleteOpen.value = true) && (deleteSelectedUser.value = row.username)
  }]
]
//////////////////////////
// Select functions
//////////////////////////
function select(row) {
  const index = selected.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}
//////////////////////////
// Filter functions
//////////////////////////
const filteredRows = computed(() => {
  if (!users.value) {
    return []
  }
  if (!filterInput.value) {
    return users.value
  }
  return users.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(filterInput.value.toLowerCase())
    })
  })
})
//////////////////////////
// Validation schemas
//////////////////////////
const createUserSchema = object({
  username: string([minLength(1, 'Minimum 1 character'), maxLength(32, 'Maximum 32 characters')]),
  email: string([email(1, 'Invalid email')]),
  password: string([minLength(4, 'Minimum 4 characters')]),
})
//////////////////////////
// User functions
//////////////////////////
async function createUser() {
  const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/usermanage/user', {
    method: 'POST',
    body: JSON.stringify({ username: state.value.username, email: state.value.email, password: state.value.password }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'User create error', description: error.value.error + '', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
  }
  if (data.value) {
    isCreateOpen.value = false
    fetchUsers()
    toast.add({ title: 'User successfully created', description: state.value.username + ' created', icon: 'i-heroicons-check-circle-20-solid' })
    resetState()
  }
}
async function updateUser() {
  if (state.value.email === undefined) {
    state.value.email = editSelectedUser.value.email
  }
  if (state.value.password === undefined) {
    state.value.password = ''
  }
  const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/usermanage/user', {
    method: 'PUT',
    body: JSON.stringify({ username: editSelectedUser.value.username, email: state.value.email, password: state.value.password }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'User update error', description: error.value.error + '', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
  }
  if (data.value) {
    isEditOpen.value = false
    fetchUsers()
    toast.add({ title: 'User successfully updated', description: editSelectedUser.value.username + ' updated', icon: 'i-heroicons-check-circle-20-solid' })
    resetState()
  }
}
async function deleteUser() {
  if (selected.value.length > 1) {
    for (let i = 1; i < selected.value.length; i++) {
      const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/usermanage/user', {
        method: 'DELETE',
        body: JSON.stringify({ username: selected.value[i].username }),
        headers: useRequestHeaders(['authorization', 'cookie',]),
        credentials: 'include',
      })
      if (error.value) {
        toast.add({ title: 'User delete error', description: error.value.error + '', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
        return
      }
      toast.add({ title: 'User successfully deleted', description: selected.value[i].username + ' deleted', icon: 'i-heroicons-check-circle-20-solid' })
    }
    isDeleteOpen.value = false
    fetchUsers()
    resetState()
  }
  else {
    const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/usermanage/user', {
      method: 'DELETE',
      body: JSON.stringify({ username: deleteSelectedUser.value }),
      headers: useRequestHeaders(['authorization', 'cookie',]),
      credentials: 'include',
    })
    if (error.value) {
      toast.add({ title: 'User delete error', description: error.value.error + '', icon: 'i-heroicons-no-symbol-20-solid' })
      return
    }
    isDeleteOpen.value = false
    fetchUsers()
    toast.add({ title: 'User successfully deleted', description: deleteSelectedUser.value + ' deleted', icon: 'i-heroicons-check-circle-20-solid' })
  }
}
//////////////////////////
// Page meta
//////////////////////////
useHead({
  title: `User Management`,
  link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
definePageMeta({
  middleware: checkCookie
})
</script>