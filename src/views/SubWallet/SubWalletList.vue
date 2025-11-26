<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-white">SubWallet Management</h2>
    </div>

    <!-- Query Filter -->
    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
      <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Wallet Address -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Wallet Address</label>
          <input 
            v-model="query.Address"
            type="text" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
            placeholder="Enter wallet address"
          >
        </div>

        <!-- Actions -->
        <div class="md:col-span-3 flex justify-end space-x-4">
          <button 
            type="button" 
            @click="resetQuery"
            class="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Reset
          </button>
          <button 
            type="submit" 
            class="px-6 py-2.5 bg-primary hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200 flex items-center"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Search
          </button>
        </div>
      </form>
    </div>

    <!-- Data Table -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700/50">
            <tr>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Wallet Address</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Receive Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-if="subwallets.length === 0 && !isLoading">
              <td colspan="2" class="px-6 py-12 text-center text-gray-400">
                No subwallets found.
              </td>
            </tr>
            <tr v-if="isLoading">
              <td colspan="2" class="px-6 py-12 text-center text-gray-400">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-8 w-8 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="ml-3">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-for="wallet in subwallets" :key="wallet.id" class="hover:bg-gray-700/30 transition-colors duration-150">
              <td class="px-4 py-4 text-sm text-gray-300 font-mono">
                <div class="flex items-center">
                  <span class="max-w-[300px] truncate" :title="wallet.address">
                    {{ wallet.address }}
                  </span>
                  <button 
                    @click="copyToClipboard(wallet.address)" 
                    class="ml-2 text-secondary hover:text-emerald-400 transition-colors duration-200"
                    title="Copy address"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-emerald-400 font-mono font-semibold">
                {{ formatCurrency(wallet.totalReceiveAmount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-gray-700/30 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-400">
          Showing page <span class="font-medium text-white">{{ pagination.page }}</span> of 
          <span class="font-medium text-white">{{ pagination.totalPages }}</span>
          <span class="mx-2">•</span>
          Total <span class="font-medium text-white">{{ pagination.totalCount }}</span> records
        </div>
        <div class="flex space-x-2">
          <button 
            @click="changePage(-1)" 
            :disabled="pagination.page === 1 || isLoading"
            class="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <button 
            @click="changePage(1)" 
            :disabled="pagination.page >= pagination.totalPages || isLoading"
            class="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { subwalletApi } from '../../api/subwallet'

const isLoading = ref(false)
const subwallets = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0
})

const query = ref({
  Page: 1,
  PageSize: 10,
  Address: ''
})

const statusMap = {
  0: { label: 'Inactive', class: 'bg-gray-700/50 text-gray-300 border border-gray-600/50' },
  1: { label: 'Active', class: 'bg-green-900/50 text-green-300 border border-green-700/50' },
  2: { label: 'Suspended', class: 'bg-red-900/50 text-red-300 border border-red-700/50' }
}

const getStatusLabel = (status) => statusMap[status]?.label || 'Unknown'
const getStatusClass = (status) => statusMap[status]?.class || 'bg-gray-700 text-gray-400'

const formatCurrency = (value) => {
  // Handle null, undefined, or NaN values
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00'
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  let date = new Date(dateString)
  
  if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('T')) {
    date = new Date(dateString + 'Z')
  } else if (dateString.includes('T') && !dateString.endsWith('Z') && !dateString.includes('+')) {
    date = new Date(dateString + 'Z')
  }
  
  return date.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
    alert('Address copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const fetchSubWallets = async () => {
  isLoading.value = true
  try {
    const params = Object.fromEntries(
      Object.entries(query.value).filter(([_, v]) => v !== '')
    )
    
    const response = await subwalletApi.getList(params)
    
    if (response.data && response.data.data) {
      const apiData = response.data.data
      
      if (Array.isArray(apiData.data)) {
        subwallets.value = apiData.data
      } else if (Array.isArray(apiData)) {
        subwallets.value = apiData
      } else {
        subwallets.value = []
      }
      
      pagination.value = {
        page: apiData.page || query.value.Page,
        pageSize: apiData.pageSize || query.value.PageSize,
        totalCount: apiData.totalCount || 0,
        totalPages: apiData.totalPages || 0
      }
    } else {
      subwallets.value = []
    }

  } catch (error) {
    console.error('Failed to fetch subwallets:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  query.value.Page = 1
  fetchSubWallets()
}

const resetQuery = () => {
  query.value.Page = 1
  query.value.PageSize = 10
  query.value.Address = ''
  
  fetchSubWallets()
}

const changePage = (delta) => {
  query.value.Page += delta
  fetchSubWallets()
}

onMounted(() => {
  fetchSubWallets()
})
</script>
