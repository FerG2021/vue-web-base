import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: () => import('../views/login/index.vue')
        },
        {
            path: '/',
            component: () => import('../views/home/index.vue')
        },
       
        
        {
            path: '/mi-cuenta',
            component: () => import('../views/miCuenta/index.vue')
        },
    ]
})

export default router