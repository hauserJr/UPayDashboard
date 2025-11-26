<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-bold text-white tracking-tight">Merchant Settings</h3>
    </div>

    <!-- Settings Card -->
    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
      <div class="space-y-6">
        
        <!-- API Key Section -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">API Key</label>
          <div class="flex items-center space-x-3">
            <div class="relative flex-1">
              <input style="cursor: not-allowed;"
                type="text" 
                :value="settings.apiKey" 
                readonly
                class="w-full bg-gray-900/50 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-secondary focus:border-secondary block p-3 pr-10 font-mono"
              >
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
            <button 
              @click="copyApiKey"
              class="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center shadow-lg border border-gray-600"
              title="Copy API Key"
            >
              <svg v-if="!copied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500">This key is used to authenticate your API requests. Keep it secret.</p>
        </div>

        <!-- Callback URL Section -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Callback URL</label>
          <div class="relative">
            <input 
              v-model="settings.callbackUrl" 
              type="url" 
              placeholder="https://your-domain.com/api/callback"
              class="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-secondary focus:border-secondary block p-3 transition-colors duration-200"
              :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': error}"
            >
          </div>
          <p class="mt-2 text-xs text-gray-500">System will send payment notifications to this URL.</p>
        </div>

        <!-- Actions -->
        <div class="pt-4 flex items-center justify-end border-t border-gray-700">
          <span v-if="message" :class="{'text-green-400': success, 'text-red-400': !success}" class="mr-4 text-sm font-medium animate-pulse">
            {{ message }}
          </span>
          <button 
            @click="saveSettings" 
            :disabled="loading"
            class="px-6 py-2.5 bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { merchantApi } from '../../api/merchant'

const settings = ref({
  apiKey: '',
  callbackUrl: ''
})

const loading = ref(false)
const message = ref('')
const success = ref(false)
const error = ref(false)
const copied = ref(false)

const fetchSettings = async () => {
  try {
    const response = await merchantApi.getSettings()
    console.log(response)
    if (response.data.statusCode === 200) {
      settings.value = response.data.data
    }
  } catch (err) {
    console.error('Failed to fetch settings:', err)
    showMessage('Failed to load settings', false)
  }
}

const saveSettings = async () => {
  if (!settings.value.callbackUrl) {
    showMessage('Callback URL is required', false)
    error.value = true
    return
  }

  loading.value = true
  error.value = false
  message.value = ''

  try {
    await merchantApi.setCallbackUrl(settings.value.callbackUrl)
    showMessage('Settings saved successfully', true)
  } catch (err) {
    console.error('Failed to save settings:', err)
    showMessage(err.response?.data?.message || 'Failed to save settings', false)
  } finally {
    loading.value = false
  }
}

const copyApiKey = async () => {
  try {
    await navigator.clipboard.writeText(settings.value.apiKey)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const showMessage = (msg, isSuccess) => {
  message.value = msg
  success.value = isSuccess
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  fetchSettings()
})
</script>
