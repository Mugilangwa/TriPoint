// router.js
import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
    // ==========================================
    // 1. PUBLIC WEBSITE ROUTES
    // ==========================================
    {
        path: '/',
        name: 'home',
        component: () => import('../views/website/Home.vue'),
        meta: { layout: 'website', requiresAuth: false },
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/website/About.vue'),
        meta: { layout: 'website', requiresAuth: false },
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/website/Contact.vue'),
        meta: { layout: 'website', requiresAuth: false },
    },
    {
        path: '/mission',
        name: 'mission',
        component: () => import('../views/website/Mission.vue'),
        meta: { layout: 'website', requiresAuth: false },
    },
    {
        path: '/cars',
        name: 'cars',
        component: () => import('../views/website/Cars.vue'),
        meta: { layout: 'website', requiresAuth: false },
    },
    {
        path: '/properties',
        name: 'properties',
        component: () => import('../views/website/Properties.vue'),
        meta: { layout: 'website', requiresAuth: false },
    },
    {
        path: '/properties/:type/:id',
        name: 'property-detail',
        component: () => import('../views/website/PropertyDetail.vue'),
        meta: { layout: 'website', requiresAuth: false },
    },

    // ==========================================
    // 2. AUTH ROUTES
    // ==========================================
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/authentication/Login.vue'),
        meta: { layout: 'auth', requiresAuth: false },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/authentication/Register.vue'),
        meta: { layout: 'auth', requiresAuth: false },
    },

    // ==========================================
    // 3. PROTECTED ROUTES (Dashboard)
    // ==========================================
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/Index.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },

    // --- Car Rental ---
    {
        path: '/dashboard/vehicles',
        name: 'manage-vehicles',
        component: () => import('../views/dashboard/Vehicles.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/vehicles/:id',
        name: 'vehicle-detail',
        component: () => import('../views/dashboard/VehicleDetail.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/vehicle-models',
        name: 'manage-vehicle-models',
        component: () => import('../views/dashboard/VehicleModels.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/bookings',
        name: 'manage-bookings',
        component: () => import('../views/dashboard/Bookings.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/bookings/form/:id?',
        name: 'booking-form',
        component: () => import('../views/dashboard/BookingForm.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/clients',
        name: 'manage-clients',
        component: () => import('../views/dashboard/Clients.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/properties/:type/:id',
        name: 'admin-property-detail',
        component: () => import('../views/dashboard/PropertyDetail.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },

    // --- Real Estate ---
    {
        path: '/dashboard/plots',
        name: 'manage-plots',
        component: () => import('../views/dashboard/Plots.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/apartments',
        name: 'manage-apartments',
        component: () => import('../views/dashboard/Apartments.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/inquiries',
        name: 'manage-inquiries',
        component: () => import('../views/dashboard/Inquiries.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/inquiries/form/:id?',
        name: 'inquiry-form',
        component: () => import('../views/dashboard/InquiryForm.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },

    // --- Settings ---
    {
        path: '/dashboard/suppliers',
        name: 'manage-suppliers',
        component: () => import('../views/dashboard/Suppliers.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },
    {
        path: '/dashboard/users',
        name: 'manage-users',
        component: () => import('../views/dashboard/Users.vue'),
        meta: { layout: 'app', requiresAuth: true },
    },

    // ==========================================
    // 4. ERROR ROUTES
    // ==========================================
    {
        path: '/not-found',
        name: 'not-found',
        component: () => import('../views/authentication/error404.vue'),
        meta: { layout: 'auth', requiresAuth: false },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/not-found',
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Kurasa zinapobadilika, inarudi juu
        if (savedPosition) {
            return savedPosition;
        } else if (to.hash) {
            return { el: to.hash, behavior: 'smooth' }; // Kwa ajili ya #contact-form
        } else {
            return { left: 0, top: 0 };
        }
    },
});

// =======================
// NAVIGATION GUARD
// =======================
router.beforeEach((to, from, next) => {
    // Set Layout
    if (to.meta && to.meta.layout) {
        store.commit('setLayout', to.meta.layout);
    } else {
        store.commit('setLayout', 'website');
    }

    // Check authentication
    const isAuthenticated = localStorage.getItem('access_token') !== null;

    // Kama ukurasa unahitaji login, na mtu hajaingia
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({
            name: 'login',
            query: { redirect: to.fullPath }
        });
        return;
    }

    // Kama mtu ameingia na anataka kwenda kwenye Login/Register, mpeleke Dashboard
    if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
        next({ name: 'dashboard' });
        return;
    }

    // Ruhusu
    next();
});

// Optional: Handle errors
router.onError((error) => {
    console.error('Router error:', error);
});

export default router;