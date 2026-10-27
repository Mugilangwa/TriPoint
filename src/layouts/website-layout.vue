<template>
    <div>
        <WebsiteHeader />
        <main class="min-vh-100">
            <router-view></router-view>
        </main>
        <WebsiteFooter />

        <!-- Floating Action Buttons -->
        <div class="floating-buttons" style="position: fixed; bottom: 30px; right: 30px; display: flex; flex-direction: column; gap: 12px; z-index: 1050;">
            <a href="https://wa.me/255754366104?text=Hello%20Tripoint" target="_blank" class="btn btn-success rounded-circle shadow d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; font-size: 1.4rem;">
                <i class="fab fa-whatsapp"></i>
            </a>
            <a href="tel:+255754366104" class="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; font-size: 1.4rem;">
                <i class="fas fa-phone-alt"></i>
            </a>
        </div>
    </div>
</template>

<script setup>
import WebsiteHeader from '@/components/layout/WebsiteHeader.vue';
import WebsiteFooter from '@/components/layout/WebsiteFooter.vue';
</script>