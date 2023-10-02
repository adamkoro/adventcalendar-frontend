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
            <UButton icon="i-heroicons-arrow-path-20-solid" label="Refresh" @click="fetchDays" />
          </UTooltip>
        </div>
        <div class="w-1/3 flex justify-end gap-2">
          <UTooltip text="Create day ">
            <UButton icon="i-heroicons-plus-20-solid" label="Create" @click="isCreateOpen = true" />
          </UTooltip>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-6 py-5 cursor-default">
        <div v-if="pending === false">
          <div v-for="day in filteredDays" :key="day.id" class="">
            <div
              class="bg-gray-300 dark:bg-slate-800 text-black dark:text-white rounded border-2 border-orange-500 p-1 shadow-lg">
              <UFormGroup label="Id" class="">
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
                  <UTooltip text="Edit day pattern">
                    <UButton icon="i-heroicons-pencil-square-20-solid"
                      @click="(isEditOpen = true) && (editSelectedDay = day)" />
                  </UTooltip>
                  <UTooltip text="Delete day pattern">
                    <UButton icon="i-heroicons-trash-20-solid"
                      @click="(isDeleteOpen = true) && (deleteSelectedDay = day)" />
                  </UTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-3 mt-20">
          <div v-if="pending">
            <div class="flex flex-col items-center mt-6">
              <UIcon name="i-heroicons-arrow-path-20-solid" class="text-gray-500 text-2xl animate-spin" />
              <p class="mt-3 text-sm">Loading...</p>
            </div>
          </div>
          <div v-else>
            <div v-if="filteredDays.length === 0">
              <div class="flex flex-col items-center">
                <UIcon name="i-heroicons-circle-stack-20-solid" class="text-gray-500 text-2xl" />
                <p class="mt-3 text-sm">No items.</p>
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
      <!---- Edit day pattern ---->
      <!-------------------------->
      <UModal v-model="isEditOpen">
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between ">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Edit day pattern
                |
                Id: {{ editSelectedDay.id }}
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="(isEditOpen = false)" />
            </div>
          </template>
          <UForm :schema="createDaySchema" :state="state" @submit="updateDay">
            <UFormGroup size="lg" label="Year" name="year" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedDay.year" />
              <p>New</p>
              <UInput v-model="yearAsNumber" placeholder="Enter year..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Day" name="to" :ui="{ label: { base: 'font-semibold text-black text-l' } }"
              class="pb-4" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedDay.day" />
              <p>New</p>
              <UInput v-model="dayAsNumber" placeholder="Enter day..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Title" name="subject"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedDay.title" />
              <p>New</p>
              <UInput v-model="state.title" placeholder="Enter title..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Content" name="content"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedDay.content" />
              <p>New</p>
              <UTextarea v-model="state.content" placeholder="Enter text..." autoresize />
            </UFormGroup>
          </UForm>
          <template #footer>
            <div class="flex justify-between">
              <UButton type="cancel" size="xl" label="Cancel" @click="(isEditOpen = false)">
                <template #trailing>
                  <UIcon name="i-heroicons-no-symbol-20-solid" />
                </template>
              </UButton>
              <UButton type="submit" size="xl" label="Save" @click="updateDay">
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
import checkCookie from '~/middleware/checkCookie'
//////////////////////////
// Variables
//////////////////////////
const filterInput = ref('')
const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const isDeleteOpen = ref(false)
const deleteSelectedDay = ref(any())
const editSelectedDay = ref(any())
const toast = useToast()
//////////////////////////
//////////////////////////
// Set local storage value
//////////////////////////
onBeforeMount(() => {
  localStorage.setItem('activeNavLink', 'days')
})
//////////////////////////
// Fetch data
//////////////////////////
const { data: days, error: fetchError, pending, refresh: fetchDays } = await useFetch(useRuntimeConfig().public.publicUrl + '/api/public/days', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
  lazy: true,
})
if (fetchError.value) {
  toast.add({ title: 'Days fetch error', description: 'Could not fetch requested data', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
}
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
function reset() {
  return initialState();
}
function resetState() {
  state.value = reset();
  deleteSelectedDay.value = null;
  editSelectedDay.value = null;
}
//////////////////////////
// Filter data
//////////////////////////
const filteredDays = computed(() => {
  if (!days.value) {
    return [];
  }
  if (!filterInput.value) {
    return days.value;
  }
  return days.value.filter((day) => {
    // TODO Fix this search function, it's not working properly when searching for numbers
    const stYear = new Date(day.year).toLocaleDateString('en-US', { year: 'numeric' });
    const stDay = new Date(day.day).toLocaleDateString('en-US', { day: 'numeric' });
    return (
      day.id.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      stYear.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      stDay.toLowerCase().includes(filterInput.value.toLowerCase()) ||
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
  year: number([minValue(1900, 'Minimum value is: 1900'), maxValue(9999, 'Maximum value is: 9999')]),
  day: number([minValue(1, 'Minimum value is: 1'), maxValue(31, 'Maximum value is: 31')]),
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
    fetchDays()
    toast.add({ title: 'Day successfully created', description: 'Year: ' + yearAsNumber.value + ' day: ' + dayAsNumber.value + ' title: ' + state.value.title + ' created', icon: 'i-heroicons-check-circle-20-solid' })
    resetState()
  }
}
async function updateDay() {
  const localYear = ref('')
  const localDay = ref('')
  if (yearAsNumber.value === undefined) {
    localYear.value = Number(editSelectedDay.value.year)
  } else {
    localYear.value = yearAsNumber.value
  }
  if (dayAsNumber.value === undefined) {
    localDay.value = Number(editSelectedDay.value.day)
  } else {
    localDay.value = dayAsNumber.value
  }
  if (state.value.title === undefined) {
    state.value.title = editSelectedDay.value.title
  }
  if (state.value.content === undefined) {
    state.value.content = editSelectedDay.value.content
  }
  const { data, error } = await useFetch(useRuntimeConfig().public.publicUrl + '/api/admin/public/day', {
    method: 'PUT',
    body: JSON.stringify({ id: editSelectedDay.value.id, year: localYear.value, day: localDay.value, title: state.value.title, content: state.value.content }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'Day update error', description: error.value.data + '', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
    return
  }
  if (data.value) {
    isEditOpen.value = false
    fetchDays()
    toast.add({ title: 'Day successfully updated', description: 'Year: ' + localYear.value + ' day: ' + localDay.value + ' id: ' + editSelectedDay.value.id + ' updated', icon: 'i-heroicons-check-circle-20-solid' })
    resetState()
  }
}
async function deleteDay() {
  for (let key in state.value) {
    if (state.value[key] === undefined) {
      state.value[key] = deleteSelectedDay.value[key];
    }
  }
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
  if (data.value) {
    isDeleteOpen.value = false
    fetchDays()
    toast.add({ title: 'Day successfully deleted', description: 'Year: ' + state.value.year + ' day: ' + state.value.day + ' title: ' + state.value.title + ' deleted', icon: 'i-heroicons-check-circle-20-solid' })
    resetState()
  }
}
//////////////////////////
// Page meta
//////////////////////////
useHead({
  title: `Days Management`,
})
definePageMeta({
  middleware: checkCookie,
})
</script>