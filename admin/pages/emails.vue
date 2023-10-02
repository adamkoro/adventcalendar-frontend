<template>
  <NavBar />
  <UContainer>
    <div>
      <div class="flex items-center justify-between p-2">
        <div class="w-1/3">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" v-model="filterInput" placeholder="Search for email..." />
        </div>
        <div class="">
          <UTooltip text="Update email pattern list">
            <UButton icon="i-heroicons-arrow-path-20-solid" label="Refresh" @click="fetchEmails" />
          </UTooltip>
        </div>
        <div class="w-1/3 flex justify-end gap-2">
          <UTooltip text="Create email pattern">
            <UButton icon="i-heroicons-plus-20-solid" label="Create" @click="isCreateOpen = true" />
          </UTooltip>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-6 py-5 cursor-default">
        <div v-if="pending === false">
          <div v-for="email in filteredEmails" :key="email.key" class="">
            <div
              class="bg-gray-300 dark:bg-slate-800 text-black dark:text-white rounded border-2 border-orange-500 p-1 shadow-lg">
              <UFormGroup label="Name">
                <UInput :readonly="true" v-model="email.name" />
              </UFormGroup>
              <UFormGroup label="From">
                <UInput :readonly="true" v-model="email.from" />
              </UFormGroup>
              <UFormGroup label="To">
                <UInput :readonly="true" v-model="email.to" />
              </UFormGroup>
              <UFormGroup label="Subject">
                <UInput :readonly="true" v-model="email.subject" />
              </UFormGroup>
              <UFormGroup label="Body">
                <UInput :readonly="true" v-model="email.body" />
              </UFormGroup>
              <div class="flex items-center justify-between pb-1">
                <div class="w-1/3"></div>
                <div class="flex"></div>
                <div class="w-1/3 flex justify-end gap-1 pt-2">
                  <UTooltip text="Edit email pattern">
                    <UButton icon="i-heroicons-pencil-square-20-solid"
                      @click="(isEditOpen = true) && (editSelectedEmail = email)" />
                  </UTooltip>
                  <UTooltip text="Delete email pattern">
                    <UButton icon="i-heroicons-trash-20-solid"
                      @click="(isDeleteOpen = true) && (deleteSelectedEmail = email.name)" />
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
            <div v-if="filteredEmails.length === 0">
              <div class="flex flex-col items-center">
                <UIcon name="i-heroicons-circle-stack-20-solid" class="text-gray-500 text-2xl" />
                <p class="mt-3 text-sm">No items.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-------------------------->
      <!-- Create email pattern -->
      <!-------------------------->
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
              <UInput v-model="state.name" placeholder="Enter a pattern name..." />
            </UFormGroup>
            <UFormGroup size="lg" label="From email address" name="from"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <UInput v-model="state.from" placeholder="Enter a from email address..." />
            </UFormGroup>
            <UFormGroup size="lg" label="To email address" name="to"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <UInput v-model="state.to" placeholder="Enter to email address(s)..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Subject of the email" name="subject"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <UInput v-model="state.subject" placeholder="Enter a subject..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Body of the email" name="body"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" error>
              <UTextarea v-model="state.body" placeholder="Enter a text..." autoresize />
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
      <!-------------------------->
      <!-- Edit email pattern -->
      <!-------------------------->
      <UModal v-model="isEditOpen">
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between ">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Edit email pattern
                |
                Name: {{ editSelectedEmail.name }}
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="(isEditOpen = false)" />
            </div>
          </template>
          <UForm :schema="createEmailSchema" :state="state" @submit="updateEmail">
            <UFormGroup size="lg" label="Name of the pattern" name="name"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedEmail.name" />
              <p>New</p>
              <UInput v-model="state.name" placeholder="Enter a pattern name..." />
            </UFormGroup>
            <UFormGroup size="lg" label="From email address" name="from"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedEmail.from" />
              <p>New</p>
              <UInput v-model="state.from" placeholder="Enter a from email address..." />
            </UFormGroup>
            <UFormGroup size="lg" label="To email address" name="to"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedEmail.to" />
              <p>New</p>
              <UInput v-model="state.to" placeholder="Enter to email address(s)..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Subject of the email" name="subject"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" class="pb-4" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedEmail.subject" />
              <p>New</p>
              <UInput v-model="state.subject" placeholder="Enter a subject..." />
            </UFormGroup>
            <UFormGroup size="lg" label="Body of the email" name="body"
              :ui="{ label: { base: 'font-semibold text-black text-l' } }" error>
              <p>Current</p>
              <UInput disabled v-model="editSelectedEmail.body" />
              <p>New</p>
              <UTextarea v-model="state.body" placeholder="Enter a text..." autoresize />
            </UFormGroup>
          </UForm>
          <template #footer>
            <div class="flex justify-between">
              <UButton type="cancel" size="xl" label="Cancel" @click="(isEditOpen = false)">
                <template #trailing>
                  <UIcon name="i-heroicons-no-symbol-20-solid" />
                </template>
              </UButton>
              <UButton type="submit" size="xl" label="Save" @click="updateEmail">
                <template #trailing>
                  <UIcon name="i-heroicons-check-20-solid" />
                </template>
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
      <!-------------------------->
      <!-- Delete email pattern -->
      <!-------------------------->
      <UModal v-model="isDeleteOpen">
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between ">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Delete user
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="(isDeleteOpen = false) && (deleteSelectedEmail = '')" />
            </div>
          </template>
          <div v-if="deleteSelectedEmail" class="flex flex-wrap gap-1">
            <div class="">Are you sure you want to delete</div>
            <div class="text-red-600">{{ deleteSelectedEmail }}</div>
            <div class="">email pattern?</div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <UButton type="cancel" size="xl" label="Cancel"
                @click="(isDeleteOpen = false) && (deleteSelectedEmail = '')">
                <template #trailing>
                  <UIcon name="i-heroicons-no-symbol-20-solid" />
                </template>
              </UButton>
              <UButton type="submit" size="xl" label="Delete" @click="deleteEmail">
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
import { string, object, email, minLength, any, } from 'valibot'
import checkCookie from '~/middleware/checkCookie'
//////////////////////////
// Variables
//////////////////////////
const filterInput = ref('')
const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const isDeleteOpen = ref(false)
const deleteSelectedEmail = ref('')
const editSelectedEmail = ref(any())
const toast = useToast()
//////////////////////////
// Set local storage value
//////////////////////////
onBeforeMount(() => {
  localStorage.setItem('activeNavLink', 'emails')
})
//////////////////////////
// Fetch data
//////////////////////////
const { data: emails, error: fetchError, pending, refresh: fetchEmails } = await useFetch(useRuntimeConfig().public.mailUrl + '/api/admin/emailmanage/email', {
  method: 'GET',
  headers: useRequestHeaders(['authorization', 'cookie']),
  credentials: 'include',
})
if (fetchError.value) {
  toast.add({ title: 'Emails fetch error', description: 'Could not fetch requested data', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
}
//////////////////////////
// Email state
//////////////////////////
function initialState() {
  return {
    name: undefined,
    from: undefined,
    to: undefined,
    subject: undefined,
    body: undefined
  }
}
const state = ref({ ...initialState })
function reset() {
  return initialState();
}
function resetState() {
  state.value = reset();
  editSelectedEmail.value = null;
  deleteSelectedEmail.value = null;
}
//////////////////////////
// Filter data
//////////////////////////
const filteredEmails = computed(() => {
  if (!emails.value) {
    return [];
  }
  if (!filterInput.value) {
    return emails.value;
  }
  return emails.value.filter((email) => {
    return (
      email.name.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      email.from.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      email.to.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      email.subject.toLowerCase().includes(filterInput.value.toLowerCase()) ||
      email.body.toLowerCase().includes(filterInput.value.toLowerCase())
    )
  })
})
//////////////////////////
// Email schema validation
//////////////////////////
const createEmailSchema = object({
  name: string([minLength(1, 'Name is required')]),
  from: string([email(1, 'Invalid email')]),
  to: string([email(40, 'To email address(es) is(are) required')]),
  subject: string([minLength(1, 'Subject is required')]),
  body: string([minLength(1, 'Body is required')])
})
//////////////////////////
// Email functions
//////////////////////////
async function createEmail() {
  const { data, error } = await useFetch(useRuntimeConfig().public.mailUrl + '/api/admin/emailmanage/email', {
    method: 'POST',
    body: JSON.stringify({ name: state.value.name, from: state.value.from, to: state.value.to, subject: state.value.subject, body: state.value.body }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'Email create error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
  }
  if (data.value) {
    isCreateOpen.value = false
    fetchEmails()
    toast.add({ title: 'Email successfully updated', description: state.value.name + ' created', icon: 'i-heroicons-check-circle-20-solid' })
    resetState()
  }
}
async function updateEmail() {
  for (let key in state.value) {
    if (state.value[key] === undefined) {
      state.value[key] = editSelectedEmail.value[key];
    }
  }
  const { data, error } = await useFetch(useRuntimeConfig().public.mailUrl + '/api/admin/emailmanage/email', {
    method: 'PUT',
    body: JSON.stringify({ key: editSelectedEmail.value.key, name: state.value.name, from: state.value.from, to: state.value.to, subject: state.value.subject, body: state.value.body }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'Email create error', description: error.value.error + '', icon: 'i-heroicons-no-symbol-20-solid' })
  }
  if (data.value) {
    isEditOpen.value = false
    fetchEmails()
    toast.add({ title: 'Email successfully updated', description: editSelectedEmail.value.name + ' updated', icon: 'i-heroicons-check-circle-20-solid' })
    resetState()
  }
}
async function deleteEmail() {
  const { data, error } = await useFetch(useRuntimeConfig().public.mailUrl + '/api/admin/emailmanage/email', {
    method: 'DELETE',
    body: JSON.stringify({ name: deleteSelectedEmail.value }),
    headers: useRequestHeaders(['authorization', 'cookie',]),
    credentials: 'include',
  })
  if (error.value) {
    toast.add({ title: 'Email delete error', description: error.value.data.error + '', icon: 'i-heroicons-no-symbol-20-solid', color: 'red' })
    isDeleteOpen.value = false
    return
  }
  isDeleteOpen.value = false
  fetchEmails()
  toast.add({ title: 'Email successfully deleted', description: deleteSelectedEmail.value + ' deleted', icon: 'i-heroicons-check-circle-20-solid' })
  resetState()
}
//////////////////////////
// Page meta
//////////////////////////
useHead({
  title: `Email Management`,
})
definePageMeta({
  middleware: checkCookie,
})
</script>