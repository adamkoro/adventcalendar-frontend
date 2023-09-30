<template>
  <NavBar />
  <UContainer>
    <div>
      <div class="flex items-center justify-between p-2">
        <div class="w-1/3">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" v-model="filterInput" placeholder="Search for day..." />
        </div>
        <div class="">
          <UTooltip text="Update day list">
            <UButton icon="i-heroicons-arrow-path-20-solid" label="Refresh" @click="fetchEmails" />
          </UTooltip>
        </div>
        <div class="w-1/3 flex justify-end gap-2">
          <UTooltip text="Create day ">
            <UButton icon="i-heroicons-plus-20-solid" label="Create" @click="isCreateOpen = true" />
          </UTooltip>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-6 py-5 cursor-default">
        <div v-for="day in filteredRows" :key="day.id" class="">
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
                    @click="(isDeleteOpen = true) && (deleteSelectedDay = day)" />
                </UTooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-------------------------->
      <!--- Create day pattern --->
      <!-------------------------->
      <UModal v-model="isCreateOpen">
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between ">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Create day pattern
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="(isCreateOpen = false)" />
            </div>
          </template>
          <UForm :schema="createDaySchema" :state="state" @submit="createDay">
            <UFormGroup size="lg" label="Year" name="year" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <UInput v-model="yearAsNumber" placeholder="Enter the year..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Day" name="day" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <UInput v-model="dayAsNumber" placeholder="Enter the day..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Title" name="title" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <UInput v-model="state.title" placeholder="Enter the title..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Content" name="content"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <UTextarea v-model="state.content" placeholder="Enter the content..." autoresize />
            </UFormGroup>
          </UForm>
          <template #footer>
            <div class="flex justify-between">
              <UButton type="cancel" size="xl" label="Cancel" @click="(isCreateOpen = false)">
                <template #trailing>
                  <UIcon name="i-heroicons-no-symbol-20-solid" />
                </template>
              </UButton>
              <UButton type="submit" size="xl" label="Save" @click="createDay">
                <template #trailing>
                  <UIcon name="i-heroicons-check-20-solid" />
                </template>
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
      <!-------------------------->
      <!--- Delete day pattern --->
      <!-------------------------->
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
          <div v-if="deleteSelectedDay" class="flex flex-wrap gap-1">
            <div class="">Are you sure you want to delete</div>
            <div class="font-semibold">Year:</div>
            <div class="text-red-600">{{ deleteSelectedDay.year }}</div>
            <div class="font-semibold">Day:</div>
            <div class="text-red-600">{{ deleteSelectedDay.day }}</div>
            <div class="font-semibold">Title:</div>
            <div class="text-red-600">{{ deleteSelectedDay.title }}</div>
            <div class="">day?</div>
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
  
<script setup>
import { ref } from 'vue'
import { string, object, minLength, number, maxLength, minValue, maxValue, value, any } from 'valibot'
import nuxtStorage from 'nuxt-storage'
import checkCookie from '~/middleware/checkCookie'
//////////////////////////
// Set local storage value
//////////////////////////
nuxtStorage.localStorage.setData('activeNavLink', 'days')
//////////////////////////
// Fetch data
//////////////////////////
const { data: days, error, pending, refresh: fetchEmails } = await useFetch(useRuntimeConfig().public.publicUrl + '/api/public/days', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
})
//////////////////////////
// Variables
//////////////////////////
const filterInput = ref('')
const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const isDeleteOpen = ref(false)
const deleteSelectedDay = ref(any())
const editSelectedDay = ref('')
const toast = useToast()
//////////////////////////
// Day state
//////////////////////////
function initialState() {
  return {
    year: undefined,
    day: undefined,
    title: undefined,
    content: undefined,
  }
}
const state = ref({ ...initialState })
function resetState() {
  Object.assign(state.value, { ...initialState });
}
//////////////////////////
// Filter data
//////////////////////////
const filteredRows = computed(() => {
  if (!filterInput.value) {
    return days.value;
  }
  return days.value.filter((day) => {
    return (
      day.id.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      day.year.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      day.day.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      day.title.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      day.content.toLowerCase().includes(filterInput.value.toLowerCase())
    )
  })
})
//////////////////////////
// Convert input string
//////////////////////////
const yearAsNumber = computed({
  get: () => state.value.year,
  set: (newValue) => { state.value.year = Number(newValue) }
})
const dayAsNumber = computed({
  get: () => state.value.day,
  set: (newValue) => { state.value.day = Number(newValue) }
})
//////////////////////////
// Day schema validation
//////////////////////////
const createDaySchema = object({
  year: number([minValue(1900, 'Minimum value is: 1900'),maxValue(9999, 'Maximum value is: 9999')]),
  day: number([minValue(1, 'Minimum value is: 1'),maxValue(31, 'Maximum value is: 31')]),
  title: string([minLength(1, 'Minimum length is: 1 character'), maxLength(255, 'Maximum length is: 255 characters')]),
  content: string([minLength(1, 'Minimum length is: 1 character'), maxLength(65555, 'Maximum length is: 65555 characters')])
})
//////////////////////////
// Day functions
//////////////////////////
async function createDay() {
  const { data, error } = await useFetch(useRuntimeConfig().public.publicUrl + '/api/admin/public/day', {
    method: 'POST',
    body: JSON.stringify({ year: yearAsNumber.value, day: dayAsNumber.value, title: state.value.title, content: state.value.content }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'Day create error', description: error.value.error + '', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
  }
  if (data.value) {
    isCreateOpen.value = false
    fetchEmails()
    toast.add({ title: 'Day successfully created', description: 'Year: '+yearAsNumber.value+' day: '+dayAsNumber.value+' title: '+state.value.title+' created', icon: 'i-heroicons-check-circle-20-solid' })
  }
}
async function deleteDay() {
  const { data, error } = await useFetch(useRuntimeConfig().public.publicUrl + '/api/admin/public/day', {
    method: 'DELETE',
    body: JSON.stringify({ id: deleteSelectedDay.value.id }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'Day delete error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
    return
  }
  isDeleteOpen.value = false
  fetchEmails()
  toast.add({ title: 'Day successfully deleted', description: 'Year: '+yearAsNumber.value+' day: '+dayAsNumber.value+' title: '+state.value.title+' deleted', icon: 'i-heroicons-check-circle-20-solid' })
  deleteSelectedDay.value = ''
}
//////////////////////////
// Page meta
//////////////////////////
useHead({
  title: `Days Management`,
  link: [{ hid: 'icon', rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
})
definePageMeta({
  middleware: checkCookie,
})
</script>