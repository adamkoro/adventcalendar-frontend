<template>
  <NavBar />
  <div>
    <div class="flex items-center justify-between p-2">
      <div class="w-1/3">
        <UInput icon="i-heroicons-magnifying-glass-20-solid" v-model="filterInput" placeholder="Search for user..."/>
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
    <UModal v-model="isCreateOpen">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between ">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Create user
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="(isCreateOpen = false) && resetState()" />
          </div>
        </template>
        <UForm :schema="createUserSchema" :state="state" @submit="createUser">
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
    <UModal v-model="isEditOpen">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between ">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Edit user
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="(isEditOpen = false) && (editSelectedUser = '')" />
          </div>
        </template>
        <UForm :schema="editUserSchema" :state="state" @submit="updateUser">
          <UFormGroup size="xl" label="Username" name="username"
            :ui="{ label: { base: 'font-semibold text-black text-xl' } }" error>
            {{ editSelectedUser.username }}
          </UFormGroup>
          <UFormGroup size="xl" label="Email" name="email" :ui="{ label: { base: 'font-semibold text-black text-xl' } }"
            error>
            <div> Current email: {{ editSelectedUser.email }}</div>
            <UInput v-model="state.email" type="email" placeholder="Enter new email..." />
          </UFormGroup>
          <UFormGroup size="xl" label="Password" name="password"
            :ui="{ label: { base: 'font-semibold text-black text-xl' } }" error>
            <UInput v-model="state.password" type="password" placeholder="Enter password..." />
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
    <UModal v-model="isDeleteOpen">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between ">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Delete user
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="(isDeleteOpen = false) && (deleteSelectedUser = '')" />
          </div>
        </template>
        <div v-if="deleteSelectedUser" class="flex flex-row gap-1">
          <div class="">Are you sure you want to delete</div>
          <div class="text-red-600">{{ deleteSelectedUser }}</div>
          <div class="">?</div>
        </div>
        <div v-else>
          <div v-if="selected && selected.length > 1" class="flex flex-row gap-1">
            <div class="">Are you sure you want to delete</div>
            <div class="text-red-600">{{ selected.length - 1 }} user(s)</div>
            <div class="">?</div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <UButton type="cancel" size="xl" label="Cancel" @click="(isDeleteOpen = false) && (deleteSelectedUser = '')">
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
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const config = useRuntimeConfig();
const { data: users, error, pending, refresh: fetchUsers } = await useFetch(config.public.apiUrl + '/api/admin/users', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
})

function initialState(){
  return {
    username: undefined,
    email: undefined,
    password: undefined
  }
}

const state = ref({ ...initialState })
function resetState(){
    Object.assign(state.value, { ...initialState });
}

const filterInput = ref('')
const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const isDeleteOpen = ref(false)
const selected = ref([users[0]])
const deleteSelectedUser = ref('')
const editSelectedUser = ref('')
const toast = useToast()

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'created', label: 'Created', sortable: true },
  { key: 'modified', label: 'Updated', sortable: true },
  { key: 'actions' }
]


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
    click: () => (isEditOpen.value = true) && (editSelectedUser.value = row)
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => (isDeleteOpen.value = true) && (deleteSelectedUser.value = row.username)
  }]
]


const createUserSchema = object({
  username: string([minLength(1, 'Required')]),
  email: string([email('Invalid email')]),
  password: string([minLength(1, 'Required')])
})
type UserSchema = Input<typeof createUserSchema>


const deleteUserSchema = object({
  username: string([minLength(1, 'Required')]),
})
type deleteUserSchema = Input<typeof deleteUserSchema>

const editUserSchema = object({
  email: string([email('Invalid email')]),
})
type editUserSchema = Input<typeof editUserSchema>

function select(row) {
  const index = selected.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}

function showError(error) {
  toast.add({ title: 'Error', description: error, icon: 'i-heroicons-no-symbol-20-solid' })
}

async function createUser(event: FormSubmitEvent<UserSchema>) {
  const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/user', {
    method: 'POST',
    body: JSON.stringify({ username: state.value.username, email: state.value.email, password: state.value.password }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'User create error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid' })
  }
  if (data.value) {
    isCreateOpen.value = false
    state.value = {
      username: undefined,
      email: undefined,
      password: undefined
    }
    fetchUsers()
    toast.add({ title: 'User successfully created', description: state.value.username + ' created', icon: 'i-heroicons-check-circle-20-solid' })
  }
}

async function updateUser(event: FormSubmitEvent<editUserSchema>) {
  const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/user', {
    method: 'PUT',
    body: JSON.stringify({ username: editSelectedUser.value.username, email: state.value.email, password: state.value.password }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'User update error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid' })
  }
  if (data.value) {
    isEditOpen.value = false
    state.value = {
      username: undefined,
      email: undefined,
      password: undefined
    }
    editSelectedUser.value = ''
    fetchUsers()
    toast.add({ title: 'User successfully updated', description: editSelectedUser.value.username + ' created', icon: 'i-heroicons-check-circle-20-solid' })
  }
}

async function deleteUser(event: FormSubmitEvent<deleteUserSchema>) {
  if (selected.value.length > 1) {
    for (let i = 1; i < selected.value.length; i++) {
      const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/user', {
        method: 'DELETE',
        body: JSON.stringify({ username: selected.value[i].username }),
        headers: useRequestHeaders(['authorization', 'cookie',]),
        credentials: 'include',
      })
      if (error.value) {
        toast.add({ title: 'User delete error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid' })
        return
      }
      toast.add({ title: 'User successfully deleted', description: selected.value[i].username + ' deleted', icon: 'i-heroicons-check-circle-20-solid' })
    }
    isDeleteOpen.value = false
    fetchUsers()
  }
  else {
    const { data, error } = await useFetch(useRuntimeConfig().public.apiUrl + '/api/admin/user', {
      method: 'DELETE',
      body: JSON.stringify({ username: deleteSelectedUser.value }),
      headers: useRequestHeaders(['authorization', 'cookie',]),
      credentials: 'include',
    })
    if (error.value) {
      toast.add({ title: 'User delete error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid' })
      return
    }
    isDeleteOpen.value = false
    deleteSelectedUser.value = ''
    fetchUsers()
    toast.add({ title: 'User successfully deleted', description: deleteSelectedUser.value + ' deleted', icon: 'i-heroicons-check-circle-20-solid' })
  }
}

useHead({
  title: `User Management`,
  link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})

definePageMeta({
  middleware: [
        function (to, from) {
          const token = useCookie('token')
            if (!token.value) {
                navigateTo('/admin/login',{ redirect: true })
            }
        }
    ],
  async validate({ params }) {
    const config = useRuntimeConfig();
    const { data, error } = await useFetch(config.public.apiUrl + '/api/admin/users', {
      method: 'GET',
      headers: useRequestHeaders(['authorization', 'cookie']),
      credentials: 'include',
    })
    if (error.value) {
      return createError({
        statusCode: error.value.status,
        message: error.value.data.error,
      })
    }
    return true
  },
})
</script>
  