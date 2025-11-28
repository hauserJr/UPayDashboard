<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          {{ $t('register.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-300">
          {{ $t('register.or') }}
          <router-link to="/login" class="font-medium text-secondary hover:text-emerald-400 transition-colors duration-200">
            {{ $t('register.loginLink') }}
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="account" class="sr-only">{{ $t('register.account') }}</label>
            <input
              id="account"
              name="account"
              type="text"
              required
              v-model="form.account"
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
              :placeholder="$t('register.account')"
            />
          </div>
          <div>
            <label for="name" class="sr-only">{{ $t('register.merchantName') }}</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              v-model="form.name"
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
              :placeholder="$t('register.merchantName')"
            />
          </div>

          <div>
            <label for="password" class="sr-only">{{ $t('register.password') }}</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="form.password"
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
              :placeholder="$t('register.password')"
            />
          </div>
          <div>
            <label for="confirm-password" class="sr-only">{{ $t('register.confirmPassword') }}</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              v-model="form.confirmPassword"
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
              :placeholder="$t('register.confirmPassword')"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded border border-red-500/30">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-emerald-200 group-hover:text-white transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0 1 1 0 002 0z" />
              </svg>
            </span>
            <span v-if="!isLoading">{{ $t('register.createAccount') }}</span>
            <span v-else>{{ $t('register.creating') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authApi } from '../api/auth'

const router = useRouter()
const { t } = useI18n()
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
  account: '',
  name: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  errorMessage.value = ''
  
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = t('register.passwordMismatch')
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = t('register.passwordTooShort')
    return
  }

  isLoading.value = true
  
  try {
    const payload = {
      account: form.value.account,
      merchantName: form.value.name,
      password: form.value.password,
      phone: '', // Optional
      address: '', // Optional
      notifyUrl: '' // Optional
    }
    
    await authApi.register(payload)
    
    alert(t('register.registrationSuccess'))
    router.push('/login')
  } catch (error) {
    console.error(error)

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      let msg = ''
      Object.keys(errors).forEach(key => {
        msg += `${errors[key].join(', ')}\n`
      })
      
      // Display in alert
      alert(msg)
      
      // Also display in UI for better visibility
      errorMessage.value = msg
    } else {
      errorMessage.value = error.response?.data?.message || t('register.registrationFailed')
      alert(errorMessage.value)
    }
  } finally {
    isLoading.value = false
  }
}
</script>
