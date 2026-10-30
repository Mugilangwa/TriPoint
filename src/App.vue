<template>
    <div :class="[$store.state.layout_style, $store.state.menu_style]">
        <!-- HAPA: Tumia component :is iliyobadilishwa kuwa Layout maalum -->
        <component :is="currentLayout">
            <!-- Hii inaruhusu kurasa zibadilike bila Layout kuvunjwa -->
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </component>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import '@/assets/sass/app.scss';
    import '@/assets/sass/elements/breadcrumb.scss';
    import { useMeta } from '@/composables/use-meta';
    import { useStore } from 'vuex';

    useMeta({ title: 'Tripoint Limited' });

    const store = useStore();

    // Hapa tunachagua Layout kulingana na meta.layout ya router
    const currentLayout = computed(() => {
        return store.getters.layout || 'website'; // Default ni website
    });
</script>

<script>
    import appLayout from './layouts/app-layout.vue';
    import authLayout from './layouts/auth-layout.vue';
    import websiteLayout from './layouts/website-layout.vue';

    export default {
        components: {
            app: appLayout,
            auth: authLayout,
            website: websiteLayout,
        },
    };
</script>