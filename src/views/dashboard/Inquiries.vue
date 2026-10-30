<template>
    <div class="layout-px-spacing">
        <!-- Breadcrumb -->
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">Dashboard</router-link></li>
                                <li class="breadcrumb-item active"><span>Property Inquiries</span></li>
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
                            <h4 class="fw-bold mb-1" style="color: #0b57a4;">Property Inquiries</h4>
                            <p class="text-muted small mb-0">Manage all customer questions regarding plots and apartments.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <!-- Kitufe cha Refresh -->
                            <button class="btn btn-outline-primary px-4 py-2 fw-bold rounded-2 shadow-sm" @click="loadInquiries" :disabled="loading">
                                <i class="fas fa-sync me-2" :class="{ 'fa-spin': loading }"></i> Refresh
                            </button>
                            <!-- Kitufe cha Kuongeza Inquiry -->
                            <router-link to="/dashboard/inquiries/form" class="btn btn-warning px-4 py-2 fw-bold text-white rounded-2 shadow-sm" style="background-color: #f38218; border: none;">
                                <i class="fas fa-plus me-2"></i> Add New Inquiry
                            </router-link>
                        </div>
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="custom-table">
                        <v-client-table :data="inquiries" :columns="columns" :options="table_options">
                            
                            <!-- Client (Avatar na Jina) -->
                            <template #client="props">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-circle me-2">
                                        {{ getInitial(props.row.client) }}
                                    </div>
                                    <span class="fw-bold">{{ props.row.client }}</span>
                                </div>
                            </template>

                            <!-- Property (Aina, Eneo, Bei) -->
                            <template #property="props">
                                <div class="d-flex align-items-start">
                                    <i :class="props.row.property_type === 'Plot' ? 'fas fa-map-marked-alt' : 'fas fa-building'" 
                                       class="me-2 mt-1" style="color: #0b57a4; font-size: 1.2rem;"></i>
                                    <div>
                                        <div class="fw-bold">{{ props.row.property_type }}</div>
                                        <small class="text-muted d-block">{{ props.row.property_details?.location || 'N/A' }}</small>
                                        <small class="text-muted d-block">
                                            {{ formatMoney(props.row.property_details?.price) }} 
                                            <span class="badge bg-light text-dark border ms-1 text-uppercase">
                                                {{ props.row.property_details?.listing_type }}
                                            </span>
                                        </small>
                                    </div>
                                </div>
                            </template>

                            <!-- Date -->
                            <template #date="props">
                                <span class="text-muted small">{{ props.row.date }}</span>
                            </template>

                            <!-- Status -->
                            <template #status="props">
                                <span :class="getStatusClass(props.row.status)" class="badge text-uppercase">
                                    {{ props.row.status }}
                                </span>
                            </template>

                            <!-- Actions -->
                            <template #actions="props">
                                <div class="d-flex gap-2 justify-content-center">
                                    <router-link :to="`/dashboard/inquiries/form/${props.row.inquiry_id}`" class="btn btn-sm btn-outline-primary" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(props.row.inquiry_id)" title="Delete">
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
                        <p class="text-muted small mb-4">This action cannot be undone. Do you really want to delete this inquiry?</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger px-4" @click="deleteInquiry" :disabled="loading">
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
import { axiosInstance } from '@/services/axios';
import { useMeta } from '@/composables/use-meta';
import { useNotification } from '@/composables/swal';

const { showNotification } = useNotification();

useMeta({ title: 'Manage Inquiries' });

const inquiries = ref([]);
const loading = ref(false);
let deleteModal = null;
let deleteId = ref(null);

const columns = ref(['client', 'property', 'date', 'status', 'actions']);
const table_options = ref({
    perPage: 10,
    perPageValues: [10, 25, 50, 100],
    skin: 'table table-hover table-bordered mb-0',
    columnsClasses: {
        actions: 'text-center',
        status: 'text-center'
    },
    sortable: ['status', 'date'],
    filterable: ['client', 'status'],
    headings: {
        client: 'Client',
        property: 'Property Details',
        date: 'Date',
        status: 'Status',
        actions: 'Actions'
    }
});

const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'C';
};

// Kazi ya kuformat bei
const formatMoney = (value) => {
    if (!value) return 'TZS 0';
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(value);
};

const loadInquiries = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/property-inquiries');
        inquiries.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading inquiries:', error);
        showNotification('error', 'Error', 'Failed to load inquiries.');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = (id) => {
    deleteId.value = id;
    deleteModal.show();
};

const deleteInquiry = async () => {
    loading.value = true;
    try {
        await axiosInstance.delete(`/property-inquiries/${deleteId.value}`);
        await loadInquiries();
        deleteModal.hide();
        showNotification('success', 'Deleted!', 'Inquiry deleted successfully.');
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        showNotification('error', 'Error', 'Failed to delete inquiry.');
    } finally {
        loading.value = false;
    }
};

const getStatusClass = (status) => {
    if (status === 'pending') return 'bg-warning text-dark';
    if (status === 'responded') return 'bg-info text-dark';
    if (status === 'closed') return 'bg-success';
    return 'bg-secondary';
};

onMounted(() => {
    loadInquiries();
    deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
});
</script>

<style scoped>
/* Avatar (Mduara) */
.avatar-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: #0b57a4;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
}
</style>