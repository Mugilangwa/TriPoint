<template>
    <div class="layout-px-spacing">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">Dashboard</router-link></li>
                                <li class="breadcrumb-item active"><span>Vehicle Bookings</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row layout-top-spacing">
            <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div class="panel br-6 p-4 shadow-sm bg-white rounded-4 border-0">
                    
                    <!-- Header & Buttons -->
                    <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                        <div>
                            <h4 class="fw-bold mb-1" style="color: #0b57a4;">Vehicle Bookings & Hires</h4>
                            <p class="text-muted small mb-0">Manage all vehicle rental bookings, dates, and payments.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <!-- Kitufe cha Refresh -->
                            <button class="btn btn-outline-primary px-4 py-2 fw-bold rounded-2 shadow-sm" @click="loadBookings" :disabled="loading">
                                <i class="fas fa-sync me-2" :class="{ 'fa-spin': loading }"></i> Refresh
                            </button>
                            <!-- Kitufe cha Kuongeza Booking -->
                            <router-link to="/dashboard/bookings/form" class="btn btn-warning px-4 py-2 fw-bold text-white rounded-2 shadow-sm" style="background-color: #f38218; border: none;">
                                <i class="fas fa-plus me-2"></i> Add New Booking
                            </router-link>
                        </div>
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="custom-table">
                        <v-client-table :data="bookings" :columns="columns" :options="table_options">
                            
                            <template #client="props">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-circle me-2">
                                        {{ getInitial(props.row.client_name) }}
                                    </div>
                                    <span class="fw-bold">{{ props.row.client_name }}</span>
                                </div>
                            </template>

                            <template #vehicle="props">
                                <span class="text-muted small">{{ props.row.vehicle_details }}</span>
                            </template>

                            <template #dates="props">
                                <div class="small">
                                    <div><i class="fas fa-calendar-alt text-primary me-1"></i> <strong>From:</strong> {{ props.row.pickup_date }}</div>
                                    <div>
                                        <i class="fas fa-calendar-check text-success me-1"></i> <strong>To:</strong> {{ props.row.return_date }}
                                        <!-- HAPA: Kuangalia kama muda umepita (Overdue) -->
                                        <span v-if="isOverdue(props.row.return_date, props.row.status)" class="badge bg-danger ms-2">
                                            Overdue
                                        </span>
                                    </div>
                                </div>
                            </template>

                            <template #payment="props">
                                <span class="badge bg-light text-dark border">{{ props.row.payment }}</span>
                            </template>

                            <template #status="props">
                                <span :class="getStatusClass(props.row.status)" class="badge text-uppercase">
                                    {{ props.row.status }}
                                </span>
                            </template>

                            <template #actions="props">
                                <div class="d-flex gap-2 justify-content-center">
                                    <button class="btn btn-sm btn-outline-primary" @click="editBooking(props.row)" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(props.row.booking_id)" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </template>
                        </v-client-table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Confirmation Delete Modal -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 text-center">
                    <div class="modal-body p-4">
                        <div class="mb-3">
                            <i class="fas fa-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                        </div>
                        <h5 class="fw-bold mb-2">Are you sure?</h5>
                        <p class="text-muted small mb-4">This action cannot be undone. Do you really want to delete this booking?</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger px-4" @click="deleteBooking" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { axiosInstance } from '@/services/axios';
import { useMeta } from '@/composables/use-meta';
import { useNotification } from '@/composables/swal';

const { showNotification } = useNotification();
const router = useRouter();

useMeta({ title: 'Manage Bookings' });

const bookings = ref([]);
const loading = ref(false);
let deleteModal = null;
let deleteId = ref(null);

const columns = ref(['client', 'vehicle', 'dates', 'payment', 'status', 'actions']);
const table_options = ref({
    perPage: 10,
    perPageValues: [10, 25, 50, 100],
    skin: 'table table-hover table-bordered mb-0',
    columnsClasses: {
        actions: 'text-center',
        status: 'text-center',
        payment: 'text-center'
    },
    sortable: ['status', 'pickup_date'],
    filterable: ['client_name', 'vehicle_details'],
    headings: {
        client: 'Client',
        vehicle: 'Vehicle',
        dates: 'Hire Dates',
        payment: 'Payment',
        status: 'Status',
        actions: 'Actions'
    }
});

const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'C';
};

// HAPA: Kazi ya kuangalia kama tarehe imepita
const isOverdue = (returnDate, status) => {
    if (status === 'completed' || status === 'cancelled') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Weka muda kuwa 00:00 ili kulinganisha tarehe tu
    
    const returnD = new Date(returnDate);
    return returnD < today;
};

const loadBookings = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/vehicle-hires');
        bookings.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading bookings:', error);
        showNotification('error', 'Error', 'Failed to load bookings.');
    } finally {
        loading.value = false;
    }
};

const editBooking = (booking) => {
    router.push({ path: `/dashboard/bookings/form/${booking.booking_id}` });
};

const confirmDelete = (id) => {
    deleteId.value = id;
    deleteModal.show();
};

const deleteBooking = async () => {
    loading.value = true;
    try {
        await axiosInstance.delete(`/vehicle-hires/${deleteId.value}`);
        await loadBookings();
        deleteModal.hide();
        showNotification('success', 'Deleted!', 'Booking deleted successfully.');
    } catch (error) {
        console.error('Error deleting booking:', error);
        showNotification('error', 'Error', 'Failed to delete booking.');
    } finally {
        loading.value = false;
    }
};

const getStatusClass = (status) => {
    if (status === 'approved') return 'bg-success';
    if (status === 'pending') return 'bg-warning text-dark';
    if (status === 'completed') return 'bg-info text-dark';
    if (status === 'cancelled') return 'bg-danger';
    return 'bg-secondary';
};

onMounted(() => {
    loadBookings();
    deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
});
</script>

<style scoped>
/* Avatar (Mduara) */
.avatar-circle {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #0b57a4;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
}
</style>