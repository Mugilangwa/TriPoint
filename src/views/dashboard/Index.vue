<template>
    <div class="layout-px-spacing">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item active"><span>Dashboard Overview</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <!-- Loading Spinner -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 60vh;">
            <div class="spinner-border spinner-border-sm  text-primary " role="status" style="width: 3rem; height: 3rem;"></div>
        </div>

        <div v-else class="row layout-top-spacing">
            
            <!-- Kadi za Takwimu (Stats Cards) -->
            <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 mb-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="icon-shape bg-primary text-white rounded-circle me-3" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-car fs-3"></i>
                        </div>
                        <div>
                            <h6 class="text-muted mb-1">Total Vehicles</h6>
                            <h3 class="fw-bold mb-0">{{ stats.total_vehicles }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 mb-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="icon-shape bg-success text-white rounded-circle me-3" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-building fs-3"></i>
                        </div>
                        <div>
                            <h6 class="text-muted mb-1">Properties Listed</h6>
                            <h3 class="fw-bold mb-0">{{ stats.total_properties }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 mb-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="icon-shape bg-warning text-white rounded-circle me-3" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-users fs-3"></i>
                        </div>
                        <div>
                            <h6 class="text-muted mb-1">Total Clients</h6>
                            <h3 class="fw-bold mb-0">{{ stats.total_clients }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 mb-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="icon-shape bg-danger text-white rounded-circle me-3" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-calendar-check fs-3"></i>
                        </div>
                        <div>
                            <h6 class="text-muted mb-1">Active Bookings</h6>
                            <h3 class="fw-bold mb-0">{{ stats.active_bookings }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chati Kubwa (Revenue / Bookings) -->
            <div class="col-xl-8 col-lg-12 mb-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body">
                        <h5 class="fw-bold mb-4">Bookings Trend (This Year)</h5>
                        <apex-chart v-if="chartOptions" height="320" type="area" :options="chartOptions" :series="chartSeries"></apex-chart>
                    </div>
                </div>
            </div>

            <!-- Recent Activities -->
            <div class="col-xl-4 col-lg-12 mb-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body">
                        <h5 class="fw-bold mb-4">Recent Activities</h5>
                        <div class="timeline-container">
                            <div v-for="(activity, index) in activities" :key="index" class="timeline-item d-flex mb-3">
                                <div class="timeline-icon me-3">
                                    <div :class="activity.type === 'booking' ? 'bg-primary' : 'bg-success'" class="rounded-circle text-white d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                                        <i :class="activity.type === 'booking' ? 'fas fa-car' : 'fas fa-home'" class="small"></i>
                                    </div>
                                </div>
                                <div class="timeline-content flex-grow-1">
                                    <h6 class="fw-bold mb-1">{{ activity.title }}</h6>
                                    <p class="text-muted small mb-1">{{ activity.description }}</p>
                                    <span class="badge bg-light text-dark border">{{ activity.date }}</span>
                                </div>
                            </div>
                            <div v-if="activities.length === 0" class="text-center text-muted py-4">
                                No recent activities.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Inquiries & Revenue Quick View -->
            <div class="col-xl-6 col-lg-12 mb-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body">
                        <h5 class="fw-bold mb-4">Property Inquiries</h5>
                        <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                            <div class="d-flex align-items-center">
                                <div class="bg-warning text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                    <i class="fas fa-question-circle fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="fw-bold mb-0">Pending Inquiries</h6>
                                    <p class="text-muted small mb-0">Requires your attention</p>
                                </div>
                            </div>
                            <h3 class="fw-bold mb-0">{{ stats.pending_inquiries }}</h3>
                        </div>
                        <div class="mt-4 text-center">
                            <router-link to="/dashboard/inquiries" class="btn btn-outline-primary w-100">Manage Inquiries</router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-6 col-lg-12 mb-4">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body">
                        <h5 class="fw-bold mb-4">Estimated Revenue</h5>
                        <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                            <div class="d-flex align-items-center">
                                <div class="bg-success text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                    <i class="fas fa-money-bill-wave fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="fw-bold mb-0">Total Revenue</h6>
                                    <p class="text-muted small mb-0">From completed bookings</p>
                                </div>
                            </div>
                            <h3 class="fw-bold mb-0">{{ formatMoney(stats.total_revenue) }}</h3>
                        </div>
                        <div class="mt-4 text-center">
                            <router-link to="/dashboard/bookings" class="btn btn-outline-primary w-100">View Bookings</router-link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { axiosInstance } from '@/services/axios';
import { useMeta } from '@/composables/use-meta';
import { useNotification } from '@/composables/swal';
import ApexChart from 'vue3-apexcharts';

const { showNotification } = useNotification();

useMeta({ title: 'Dashboard Overview' });

const loading = ref(true);
const stats = ref({
    total_vehicles: 0,
    total_properties: 0,
    total_clients: 0,
    active_bookings: 0,
    pending_inquiries: 0,
    total_revenue: 0,
    chart_data: { bookings_per_month: [] }
});
const activities = ref([]);

// Chati ya ApexCharts
const chartSeries = ref([]);
const chartOptions = ref(null);

const formatMoney = (value) => {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(value);
};

const loadDashboardData = async () => {
    loading.value = true;
    try {
        const [statsRes, activitiesRes] = await Promise.all([
            axiosInstance.get('/dashboard/stats'),
            axiosInstance.get('/dashboard/activities')
        ]);

        stats.value = statsRes.data.data;
        activities.value = activitiesRes.data.data;

        // Weka Chati
        chartSeries.value = [{
            name: 'Bookings',
            data: stats.value.chart_data.bookings_per_month
        }];

        chartOptions.value = {
            chart: { toolbar: { show: false }, zoom: { enabled: false } },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            colors: ['#0b57a4'],
            fill: {
                type: 'gradient',
                gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] }
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            yaxis: { labels: { formatter: (val) => Math.round(val) } }
        };

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('error', 'Error', 'Failed to load dashboard data.');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadDashboardData();
});
</script>

<style scoped>
/* Kuboresha muonekano wa Kadi */
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

/* Timeline ya Shughuli */
.timeline-item:last-child {
    margin-bottom: 0 !important;
}
.timeline-content h6 {
    color: #0d1b2a;
}
</style>