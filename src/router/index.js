import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MainLayout from '../layouts/MainLayout.vue'
import OrderList from '../views/Orders/OrderList.vue'
import SubWalletList from '../views/SubWallet/SubWalletList.vue'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/dashboard',
            component: MainLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    redirect: '/dashboard/orders'
                },
                {
                    path: 'orders',
                    name: 'order-list',
                    component: OrderList
                },
                {
                    path: 'subwallets',
                    name: 'subwallet-list',
                    component: SubWalletList
                },
                {
                    path: 'settings',
                    name: 'merchant-settings',
                    component: () => import('../views/Merchant/MerchantSettings.vue')
                },

            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('merchant_token')

    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && token) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
