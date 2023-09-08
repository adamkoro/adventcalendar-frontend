<template>
  <div>
    <NavBar />
    <div class="w-full p-2 flex justify-between items-center">
      <div class="w-auto">
        <UInput icon="i-heroicons-magnifying-glass-20-solid" v-model="filterInput" placeholder="Search for user..." />
      </div>
      <div class="w-auto">
        <UButton icon="i-heroicons-arrow-path-20-solid" label="Update" @click="fetchUsers" />
      </div>
      <div class="w-auto justify-end space-x-2">
        <UButton icon="i-heroicons-plus-20-solid" label="Create" @click="isCreateOpen = true" />
        <UButton icon="i-heroicons-pencil-square-20-solid" label="Edit" @click="isEditOpen = true" />
        <UButton icon="i-heroicons-trash-20-solid" label="Delete" @click="isDeleteOpen = true" />
      </div>
    </div>
    <UTable v-model="selected" @select="select" :rows="filteredRows" :columns="columns" :loading="pending"
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
    <UModal v-model="isCreateOpen">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between ">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Create user
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isCreateOpen = false" />
          </div>
        </template>
        <UForm :validate="validateCreateUser" :state="state" @submit="createUser">
          <UFormGroup size="xl" label="Username" name="username"
            :ui="{ label: { base: 'font-semibold text-black text-xl' } }" error>
            <UInput v-model="state.username" placeholder="Enter username..." />
          </UFormGroup>
          <UFormGroup size="xl" label="Email" name="email" :ui="{ label: { base: 'font-semibold text-black text-xl' } }"
            error>
            <UInput v-model="state.email" type="email" placeholder="Enter email..." />
          </UFormGroup>
          <UFormGroup size="xl" label="Password" name="password"
            :ui="{ label: { base: 'font-semibold text-black text-xl' } }" error>
            <UInput v-model="state.password" type="password" placeholder="Enter password..." />
          </UFormGroup>
        </UForm>
        <template #footer>
          <div class="flex justify-between">
            <UButton type="cancel" size="xl" label="Cancel" @click="isCreateOpen = false">
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
    <UModal v-model="isDeleteOpen">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between ">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Delete user
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isDeleteOpen = false" />
          </div>
        </template>
        <div>
          Are you sure you want to delete?
        </div>
        <template #footer>
          <div class="flex justify-between">
            <UButton type="cancel" size="xl" label="Cancel" @click="isDeleteOpen = false">
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
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { string, object, email, minLength, Input } from 'valibot'
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const config = useRuntimeConfig();

const { data: users, error, pending, refresh: fetchUsers } = await useFetch(config.public.apiUrl + '/api/admin/users', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'created', label: 'Created' },
  { key: 'modified', label: 'Updated' },
  { key: 'actions' }
]

const createUserSchema = object({
  username: string([minLength(1, 'Required')]),
  email: string([email('Required')]),
  password: string([minLength(1, 'Required')])
})
type UserSchema = Input<typeof createUserSchema>
const state = ref({
  username: undefined,
  email: undefined,
  password: undefined
})
const deleteUserSchema = object({
  username: string([minLength(1, 'Required')]),
})
type deleteUserSchema = Input<typeof deleteUserSchema>


const filterInput = ref('')
const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const isDeleteOpen = ref(false)
const selected = ref([users[1]])
const deleteSelectedUser = ref('')
const toast = useToast()

function select(row) {
  const index = selected.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}

const validateCreateUser = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Required' })
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors
}

const validateDeleteUser = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Required' })
  return errors
}


async function createUser(event: FormSubmitEvent<UserSchema>) {
  const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/user', {
    method: 'POST',
    body: JSON.stringify({ username: state.value.username, email: state.value.email, password: state.value.password }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'User create error', description: error.value.data.error+'', icon: 'i-heroicons-no-symbol-20-solid' })
  }
  if (data.value) {
    isCreateOpen.value = false
    fetchUsers()
    toast.add({ title: 'User successfully created', description: state.value.username+' created', icon: 'i-heroicons-check-circle-20-solid' })
  }
}

async function updateUser(event: FormSubmitEvent<UserSchema>) {
  const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/user', {
    method: 'PUT',
    body: JSON.stringify({ username: state.value.username, email: state.value.email, password: state.value.password }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
}

async function deleteUser(event: FormSubmitEvent<deleteUserSchema>) {
  const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/user', {
    method: 'DELETE',
    body: JSON.stringify({ username: deleteSelectedUser.value }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'User delete error', description: error.value.data.error+'', icon: 'i-heroicons-no-symbol-20-solid' })
  }
  isDeleteOpen.value = false
  fetchUsers()
  toast.add({ title: 'User successfully deleted', description: deleteSelectedUser.value + ' deleted', icon: 'i-heroicons-check-circle-20-solid' })
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

const items = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => (isDeleteOpen.value = true) && (deleteSelectedUser.value = row.username)
  }]
]

useHead({
  title: `User Management`,
  link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})

definePageMeta({
})
</script>
  