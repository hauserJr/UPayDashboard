<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Merchant Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-300">
          Or
          <router-link to="/register" class="font-medium text-secondary hover:text-emerald-400 transition-colors duration-200">
            register a new account
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label for="account" class="sr-only">Account</label>
            <input
              id="account"
              name="account"
              type="text"
              required
              v-model="form.account"
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
              placeholder="Account"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="form.password"
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Heroicon name: solid/lock-closed -->
              <svg class="h-5 w-5 text-emerald-200 group-hover:text-white transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../api/auth'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
  account: '',
  password: ''
})

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    const response = await authApi.login(form.value)
    const token = response.data.token // Adjust based on actual API response structure
    
    if (token) {
      localStorage.setItem('merchant_token', token)
      router.push('/dashboard') 
    } else {
      // Fallback if token is not directly in data.token, inspect response
      console.log('Login response full:', response)
      console.log('Login response data:', response.data)
      
      // Assuming response.data might be the token string itself or wrapped differently
       if (response.data && response.data.data && response.data.data.token) {
           localStorage.setItem('merchant_token', response.data.data.token)
           localStorage.setItem('merchant_account', form.value.account)
           router.push('/dashboard')
           alert('Login successful!')
       } else {
           console.error('Token not found in response', response.data)
           alert('Login failed: Token not received.')
       }
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>
