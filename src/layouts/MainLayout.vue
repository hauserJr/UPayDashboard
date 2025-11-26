<template>
  <div class="min-h-screen bg-gray-900 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-gray-700 flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-gray-700">
        <h1 class="text-xl font-bold text-white tracking-wider">Merchant<span class="text-secondary">Sys</span></h1>
      </div>

      <nav class="flex-1 py-6 px-3 space-y-2">
        <router-link 
          to="/dashboard/orders" 
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors duration-200"
          active-class="bg-gray-700/50 text-white border-l-4 border-secondary"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          Order List
        </router-link>
        
        <router-link 
          to="/dashboard/subwallets" 
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors duration-200"
          active-class="bg-gray-700/50 text-white border-l-4 border-secondary"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          SubWallet
        </router-link>
        
        <router-link 
          to="/dashboard/settings" 
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors duration-200"
          active-class="bg-gray-700/50 text-white border-l-4 border-secondary"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Settings
        </router-link>

      </nav>

      <div class="p-4 border-t border-gray-700">
        <button @click="handleLogout" class="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-red-900/20 rounded-lg transition-colors duration-200">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 flex items-center justify-between px-6">
        <h2 class="text-lg font-medium text-white">
          {{ currentRouteName }}
        </h2>
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-full bg-gradient-to-br from-secondary to-emerald-600 flex items-center justify-center text-white font-bold text-sm uppercase">
            {{ accountName.charAt(0) }}
          </div>
          <span class="ml-3 text-sm text-gray-300">{{ accountName }}</span>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const accountName = ref('Merchant')

onMounted(() => {
  const storedAccount = localStorage.getItem('merchant_account')
  if (storedAccount) {
    accountName.value = storedAccount
  }
})

const currentRouteName = computed(() => {
  switch (route.name) {
    case 'order-list': return 'Order Management'
    case 'order-create': return 'Create New Order'
    case 'subwallet-list': return 'SubWallet Management'
    case 'merchant-settings': return 'Merchant Settings'
    default: return 'Dashboard'
  }
})

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('merchant_token')
    localStorage.removeItem('merchant_account')
    router.push('/login')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
