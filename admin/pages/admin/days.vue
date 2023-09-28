<template>
  <NavBar />
  <UContainer>
  <div>
    <div class="flex items-center justify-between p-2">
      <div class="w-1/3">
        <UTooltip text="Create email pattern">
          <UButton icon="i-heroicons-plus-20-solid" label="Create" @click="isCreateOpen = true" />
        </UTooltip>
      </div>
      <div class="">
        <UTooltip text="Update email pattern list">
          <UButton icon="i-heroicons-arrow-path-20-solid" label="Refresh" @click="fetchEmails" />
        </UTooltip>
      </div>
      <div class="w-1/3 flex justify-end gap-2">
      </div>
    </div>
    <div class="grid grid-cols-3 gap-6 py-5 cursor-default">
      <div v-for="day in days" :key="day.id" class="">
        <div
          class="bg-gray-300 dark:bg-slate-800 text-black dark:text-white rounded border-2 border-orange-500 p-1 shadow-lg">
          <UFormGroup label="Id">
            <UInput :readonly="true" v-model="day.id" />
          </UFormGroup>
          <UFormGroup label="Year">
            <UInput :readonly="true" v-model="day.year" />
          </UFormGroup>
          <UFormGroup label="Day">
            <UInput :readonly="true" v-model="day.day" />
          </UFormGroup>
          <UFormGroup label="Title">
            <UInput :readonly="true" v-model="day.title" />
          </UFormGroup>
          <UFormGroup label="Content">
            <UInput :readonly="true" v-model="day.content" />
          </UFormGroup>
          <div class="flex items-center justify-between pb-1">
            <div class="w-1/3">
            </div>
            <div class="flex">
            </div>
            <div class="w-1/3 flex justify-end gap-1 pt-2">
              <UTooltip text="Edit email pattern">
                <UButton icon="i-heroicons-pencil-square-20-solid"
                  @click="(isEditOpen = true) && (editSelectedDay = day)" />
              </UTooltip>
              <UTooltip text="Delete email pattern">
                <UButton icon="i-heroicons-trash-20-solid"
                  @click="(isDeleteOpen = true) && (deleteSelectedDay = day.id)" />
              </UTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UModal v-model="isCreateOpen">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between ">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Create email pattern
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="(isCreateOpen = false)" />
          </div>
        </template>
          <UForm :schema="createEmailSchema" :state="state" @submit="createEmail">
            <UFormGroup size="lg" label="Name of the pattern" name="name"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <!--p>Current</p>
              <UInput :readonly="true" v-model="editSelectedEmail.name" />
              <p>New</p-->
              <UInput v-model="state.name" placeholder="Enter a pattern name..." />
            </UFormGroup>
            <UFormGroup size="lg" label="From email address" name="from" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <!--p>Current</p>
              <UInput :readonly="true" v-model="editSelectedEmail.from" />
              <p>New</p-->
              <UInput v-model="state.from" placeholder="Enter a from email address..." />
            </UFormGroup>
            <UFormGroup size="lg" label="To email address" name="to" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <!--p>Current</p>
              <UInput :readonly="true" v-model="editSelectedEmail.to" />
              <p>New</p-->
              <UInput v-model="state.to" placeholder="Enter to email address(s)..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Subject of the email" name="subject"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <!--p>Current</p>
              <UInput :readonly="true" v-model="editSelectedEmail.subject" />
              <p>New</p-->
              <UInput v-model="state.subject" placeholder="Enter a subject..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Body of the email" name="body" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              error>
              <!--p>Current</p>
              <UInput :readonly="true" v-model="editSelectedEmail.body" />
              <p>New</p-->
              <UTextarea v-model="state.body" placeholder="Enter a subject..." autoresize />
            </UFormGroup>
          </UForm>
        <template #footer>
          <div class="flex justify-between">
            <UButton type="cancel" size="xl" label="Cancel" @click="(isCreateOpen = false)">
              <template #trailing>
                <UIcon name="i-heroicons-no-symbol-20-solid" />
              </template>
            </UButton>
            <UButton type="submit" size="xl" label="Save" @click="createEmail">
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
              @click="(isDeleteOpen = false) && (deleteSelectedDay = '')" />
          </div>
        </template>
        <div v-if="deleteSelectedDay" class="flex flex-row gap-1">
          <div class="">Are you sure you want to delete</div>
          <div class="text-red-600">{{ deleteSelectedDay }}</div>
          <div class="">email pattern?</div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <UButton type="cancel" size="xl" label="Cancel" @click="(isDeleteOpen = false) && (deleteSelectedDay = '')">
              <template #trailing>
                <UIcon name="i-heroicons-no-symbol-20-solid" />
              </template>
            </UButton>
            <UButton type="submit" size="xl" label="Delete" @click="deleteDay">
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
  
<script setup >
import { ref } from 'vue'
import { string, object, email, minLength } from 'valibot'
import nuxtStorage from 'nuxt-storage'

nuxtStorage.localStorage.setData('activeNavLink', 'days')
const { data: days, error, pending, refresh: fetchEmails } = await useFetch(useRuntimeConfig().public.publicUrl + '/api/public/days', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
})

const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const isDeleteOpen = ref(false)
const deleteSelectedDay = ref('')
const editSelectedDay = ref('')
const toast = useToast()

function initialState(){
  return {
    name: undefined,
    from: undefined,
    to: undefined,
    subject: undefined,
    body: undefined
  }
}

const state = ref({ ...initialState })

function resetState(){
    Object.assign(state.value, { ...initialState });
}


const deleteEmailSchema = object({
  name: string([minLength(1, 'Name is required')]),
})

const createEmailSchema = object({
  name: string([minLength(1, 'Name is required')]),
  from: string([email('Invalid email')]),
  to: string([minLength(1, 'To email address(es) is(are) required')]),
  subject: string([minLength(1, 'Subject is required')]),
  body: string([minLength(1, 'Body is required')])
})

function showError(error) {
  toast.add({ title: 'Error', description: error, icon: 'i-heroicons-no-symbol-20-solid' })
}


async function createEmail() {
  const { data, error } = await useFetch(useRuntimeConfig().public.publicUrl + '/api/admin/public/day', {
    method: 'POST',
    body: JSON.stringify({ name: state.value.name, from: state.value.from, to: state.value.to, subject: state.value.subject, body: state.value.body }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'Day create error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid' })
  }
  if (data.value) {
    isCreateOpen.value = false
    fetchEmails()
    toast.add({ title: 'Day successfully updated', description: 'Day '+state.value.name + ' created', icon: 'i-heroicons-check-circle-20-solid' })
  }
}

async function deleteDay() {
  const { data, error } = await useFetch(useRuntimeConfig().public.publicUrl + '/api/admin/public/day', {
    method: 'DELETE',
    body: JSON.stringify({ id: deleteSelectedDay.value }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'Day delete error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid' })
    return
  }
  isDeleteOpen.value = false
  fetchEmails()
  toast.add({ title: 'Day successfully deleted', description: 'Day '+deleteSelectedDay.value + ' deleted', icon: 'i-heroicons-check-circle-20-solid' })
  deleteSelectedDay.value = ''
}

useHead({
  title: `Email Management`,
  link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})

definePageMeta({
  async validate() {
    const { data, error} = await useFetch(useRuntimeConfig().public.publicUrl + '/api/public/days', {
      method: 'GET',
      headers: useRequestHeaders(['authorization', 'cookie']),
      credentials: 'include',
    })
  if (error.value && error.value.message.includes('fetch failed')) {
    return createError({
      statusCode: 500,
      message: "Failed to connect to server"
    })
  }
  if (error.value && error.value.statusCode === 401) {
    return createError({
      statusCode: 401,
      message: "Unauthorized"
    })
  }
  return true
}
})
</script>
  