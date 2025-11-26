<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-white">Order Management</h2>
    </div>

    <!-- Query Filter -->
    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
      <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Order Number -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Order Number</label>
          <input 
            v-model="query.OrderNum"
            type="text" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
            placeholder="Enter order number"
          >
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Status</label>
          <select 
            v-model="query.Status"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
          >
            <option value="">All Status</option>
            <option :value="0">Pending</option>
            <option :value="1">Paid</option>
            <option :value="2">Expired</option>
            <option :value="3">Failed</option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
          <div class="flex space-x-4 items-center">
            <input 
              v-model="query.StartTime"
              :key="'start-' + dateInputKey"
              type="datetime-local" 
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
            >
            <span class="text-gray-400">to</span>
            <input 
              v-model="query.EndTime"
              :key="'end-' + dateInputKey"
              type="datetime-local" 
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
            >
          </div>
        </div>

        <!-- Actions -->
        <div class="md:col-span-4 flex justify-end space-x-4">
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
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order No.</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Received</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From Address</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">To Address</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tx Hash</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction At</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-if="orders.length === 0 && !isLoading">
              <td colspan="9" class="px-6 py-12 text-center text-gray-400">
                No orders found.
              </td>
            </tr>
            <tr v-if="isLoading">
              <td colspan="9" class="px-6 py-12 text-center text-gray-400">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-8 w-8 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="ml-3">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-700/30 transition-colors duration-150">
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                <button 
                  @click="openModal(order)"
                  class="text-secondary hover:text-emerald-400 hover:underline transition-colors duration-200"
                >
                  {{ order.merchantOrderNum }}
                </button>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                {{ formatCurrency(order.amount) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-emerald-400 font-mono">
                {{ formatCurrency(order.receiveAmount) }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-400 font-mono">
                <div class="max-w-[120px] truncate" :title="order.fromAddress">
                  {{ formatAddress(order.fromAddress) }}
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-400 font-mono">
                <div class="max-w-[120px] truncate" :title="order.toAddress">
                  {{ formatAddress(order.toAddress) }}
                </div>
              </td>
              <td class="px-4 py-4 text-sm font-mono">
                <a 
                  v-if="order.txHash" 
                  :href="getExplorerUrl(order.txHash)" 
                  target="_blank"
                  class="text-secondary hover:text-emerald-400 transition-colors duration-200 flex items-center max-w-[150px]"
                  :title="order.txHash"
                >
                  <span class="truncate">{{ formatTxHash(order.txHash) }}</span>
                  <svg class="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
                <span v-else class="text-gray-500">-</span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatDate(order.transactionAt) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatDate(order.createAt) }}
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

<!-- Order Detail Modal -->
<div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

    <!-- Modal panel -->
    <div class="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-700">
      <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-white mb-4" id="modal-title">
              Order Details: {{ selectedOrder?.merchantOrderNum }}
            </h3>
            
            <!-- Callback History Table -->
            <div class="mb-6">
              <h4 class="text-md font-medium text-gray-300 mb-2">Callback History</h4>
              <div class="bg-gray-700/30 rounded-lg border border-gray-600 overflow-hidden">
                <table class="min-w-full divide-y divide-gray-600">
                  <thead class="bg-gray-700">
                    <tr>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">URL</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-600">
                    <tr v-if="callbacks.length === 0">
                      <td colspan="3" class="px-4 py-3 text-center text-sm text-gray-400">No callback records found.</td>
                    </tr>
                    <tr v-for="(callback, index) in callbacks" :key="index">
                      <td class="px-4 py-3 text-sm text-gray-300 break-all">{{ callback.callbackUrl }}</td>
                      <td class="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{{ formatDate(callback.callbackAt) }}</td>
                      <td class="px-4 py-3 text-sm whitespace-nowrap">
                        <span :class="callback.callbackStatus ? 'text-green-400' : 'text-red-400'">
                          {{ callback.callbackStatus ? 'Success' : 'Failed' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Order Remark -->
            <div>
              <h4 class="text-md font-medium text-gray-300 mb-2">Remark</h4>
              <div class="bg-gray-700/30 rounded-lg border border-gray-600 p-4 min-h-[60px]">
                <p class="text-sm text-gray-300 whitespace-pre-wrap">{{ selectedOrder?.remark || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </div>
</div>

<script setup>
import { ref, onMounted } from 'vue'
import { orderApi } from '../../api/order'
import { getExplorerUrl } from '../../config/blockchain'

const isLoading = ref(false)
const orders = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0
})
const dateInputKey = ref(0) // 用於強制重新渲染日期輸入框

// Modal State
const showModal = ref(false)
const selectedOrder = ref(null)
const callbacks = ref([])

const query = ref({
  Page: 1,
  PageSize: 10,
  OrderNum: '',
  Status: '',
  StartTime: '',
  EndTime: ''
})

const statusMap = {
  0: { label: 'Pending', class: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50' },
  1: { label: 'Paid', class: 'bg-green-900/50 text-green-300 border border-green-700/50' },
  2: { label: 'Expired', class: 'bg-gray-700/50 text-gray-300 border border-gray-600/50' },
  3: { label: 'Failed', class: 'bg-red-900/50 text-red-300 border border-red-700/50' }
}

const getStatusLabel = (status) => statusMap[status]?.label || 'Unknown'
const getStatusClass = (status) => statusMap[status]?.class || 'bg-gray-700 text-gray-400'

// Format blockchain address (show first 6 and last 4 characters)
const formatAddress = (address) => {
  if (!address) return '-'
  if (address.length <= 10) return address
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Format transaction hash
const formatTxHash = (txHash) => {
  if (!txHash) return '-'
  if (txHash.length <= 10) return txHash
  return `${txHash.substring(0, 8)}...${txHash.substring(txHash.length - 6)}`
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  // API 返回的時間是 UTC+0，需要轉換為當地時區
  // 確保正確解析 UTC 時間
  let date = new Date(dateString)
  
  // 如果日期字串沒有時區資訊，手動加上 'Z' 表示 UTC
  if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('T')) {
    date = new Date(dateString + 'Z')
  } else if (dateString.includes('T') && !dateString.endsWith('Z') && !dateString.includes('+')) {
    // 如果有 T 但沒有時區標記，加上 Z
    date = new Date(dateString + 'Z')
  }
  
  // 轉換為台灣時區 (UTC+8) 並格式化
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

const fetchOrders = async () => {
  isLoading.value = true
  try {
    // Filter out empty values
    const params = Object.fromEntries(
      Object.entries(query.value).filter(([_, v]) => v !== '')
    )

    // Handle Timezone Conversion (Local -> UTC)
    if (params.StartTime) {
      params.StartTime = new Date(params.StartTime).toISOString()
    }
    if (params.EndTime) {
      params.EndTime = new Date(params.EndTime).toISOString()
    }
    
    console.log('Fetching orders with params:', params)
    
    const response = await orderApi.getList(params)
    
    console.log('API Response:', response.data)
    
    // Handle the nested response structure: response.data.data.data
    if (response.data && response.data.data) {
      const apiData = response.data.data
      
      // Extract orders array
      if (Array.isArray(apiData.data)) {
        orders.value = apiData.data
      } else if (Array.isArray(apiData)) {
        orders.value = apiData
      } else {
        orders.value = []
      }
      
      // Update pagination info
      pagination.value = {
        page: apiData.page || query.value.Page,
        pageSize: apiData.pageSize || query.value.PageSize,
        totalCount: apiData.totalCount || 0,
        totalPages: apiData.totalPages || 0
      }
    } else {
      orders.value = []
      console.warn('Unexpected API response format:', response.data)
    }

  } catch (error) {
    console.error('Failed to fetch orders:', error)
    // alert('Failed to load orders')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  query.value.Page = 1
  fetchOrders()
}

const resetQuery = () => {
  // 清空查詢條件
  query.value.Page = 1
  query.value.PageSize = 10
  query.value.OrderNum = ''
  query.value.Status = ''
  query.value.StartTime = ''
  query.value.EndTime = ''
  
  // 強制重新渲染日期輸入框（解決 datetime-local 不清空的問題）
  dateInputKey.value++
  
  // 重新查詢
  fetchOrders()
}

const changePage = (delta) => {
  query.value.Page += delta
  fetchOrders()
}

// Modal Functions
const openModal = async (order) => {
  selectedOrder.value = order
  callbacks.value = [] // Clear previous callbacks
  showModal.value = true
  
  try {
    const response = await orderApi.getCallbacks(order.id)
    if (response.data && response.data.data) {
      callbacks.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch callbacks:', error)
  }
}

const closeModal = () => {
  showModal.value = false
  selectedOrder.value = null
  callbacks.value = []
}

onMounted(() => {
  fetchOrders()
})
</script>
