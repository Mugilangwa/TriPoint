<template>
    <div class="layout-px-spacing">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">Dashboard</router-link></li>
                                <li class="breadcrumb-item active"><span>Clients</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row layout-top-spacing">
            <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div class="panel br-6 p-4 shadow-sm bg-white rounded">
                    
                    <!-- Header & Add Button -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 class="fw-bold mb-1" style="color: #0b57a4;">Client Directory</h4>
                            <p class="text-muted small mb-0">Manage all clients and their contact information.</p>
                        </div>
                        <button class="btn btn-warning border px-4 py-2 fw-bold rounded-2 shadow-sm" @click="openModal()">
                            <i class="fas fa-plus me-2"></i> Add New Client
                        </button>
                    </div>

                    <hr>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="custom-table">
                        <v-client-table :data="clients" :columns="columns" :options="table_options">
                            
                            <template #client_name="props">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-circle me-2" :style="{ backgroundColor: getColor(props.row.id) }">
                                        {{ getInitial(props.row.full_name) }}
                                    </div>
                                    <div>
                                        <div class="fw-bold">{{ props.row.full_name }}</div>
                                        <span class="small text-muted">{{ props.row.email }}</span>
                                    </div>
                                </div>
                            </template>

                            <template #phone="props">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-phone-alt me-2 text-muted small"></i>
                                    <span>{{ props.row.phone }}</span>
                                </div>
                            </template>

                            <template #bookings="props">
                                <span class="badge bg-primary rounded-pill">
                                    {{ (props.row.bookings || []).length }} Bookings
                                </span>
                            </template>

                            <template #actions="props">
                                <div class="d-flex gap-2 justify-content-center">
                                    <button class="btn btn-sm btn-outline-primary" @click="openModal(props.row)" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(props.row.id)" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </template>
                        </v-client-table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add / Edit Modal -->
        <div class="modal fade" id="clientModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-md modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    
                    <div class="modal-header bg-info" >
                        <h5 class="modal-title fw-bold">{{ isEdit ? 'Edit Client Details' : 'Add New Client' }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body p-4">
                        <form @submit.prevent="saveClient">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label fw-bold small text-muted">Client Name *</label>
                                    <input type="text" v-model="form.client_name" class="form-control form-control-lg" placeholder="e.g., Juma Ahmed" required>
                                </div>
                                
                                <div class="col-12">
                                    <label class="form-label fw-bold small text-muted">Phone Number *</label>
                                    <input type="text" v-model="form.phone_number" class="form-control form-control-lg" placeholder="e.g., +255 754 000 000" required>
                                </div>
                                
                                <div class="col-12">
                                    <label class="form-label fw-bold small text-muted">Email Address *</label>
                                    <input type="email" v-model="form.email" class="form-control form-control-lg" placeholder="e.g., juma@gmail.com" required>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer bg-light" style="border-radius: 0 0 1rem 1rem;">
                        <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning px-4 fw-bold text-white" style="background-color: #f38218; border: none;" @click="saveClient" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ loading ? 'Saving...' : 'Save Client' }}
                        </button>
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
                        <p class="text-muted small mb-4">This action cannot be undone. Do you really want to delete this client?</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger px-4" @click="deleteClient" :disabled="loading">
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

useMeta({ title: 'Manage Clients' });

const clients = ref([]);
const loading = ref(false);
const isEdit = ref(false);
let modal = null;
let deleteModal = null;
let deleteId = ref(null);

const form = ref({
    client_id: null,
    client_name: '',
    phone_number: '',
    email: ''
});

const columns = ref(['client_name', 'phone', 'bookings', 'actions']);
const table_options = ref({
    perPage: 10,
    perPageValues: [10, 25, 50, 100],
    skin: 'table table-hover',
    columnsClasses: {
        actions: 'text-center',
        bookings: 'text-center'
    },
    sortable: ['client_name'],
    filterable: ['client_name', 'email'],
    headings: {
        client_name: 'Client Name',
        phone: 'Phone Number',
        bookings: 'Bookings',
        actions: 'Actions'
    }
});

const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'C';
};

const getColor = (id) => {
    const colors = ['#0b57a4', '#f38218', '#198754', '#6c757d', '#dc3545'];
    return colors[id % colors.length];
};

const loadClients = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/clients');
        clients.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading clients:', error);
        showNotification('error', 'Error', 'Failed to load clients.');
    } finally {
        loading.value = false;
    }
};

const openModal = (client = null) => {
    if (client) {
        isEdit.value = true;
        form.value = {
            client_id: client.id,
            client_name: client.full_name,
            phone_number: client.phone,
            email: client.email
        };
    } else {
        isEdit.value = false;
        form.value = {
            client_id: null,
            client_name: '',
            phone_number: '',
            email: ''
        };
    }
    modal.show();
};

const saveClient = async () => {
    if (!form.value.client_name || !form.value.phone_number || !form.value.email) {
        showNotification('warning', 'Validation Error', 'Please fill in all required fields.');
        return;
    }

    loading.value = true;
    try {
        if (isEdit.value) {
            await axiosInstance.put(`/clients/${form.value.client_id}`, form.value);
            showNotification('success', 'Updated!', 'Client updated successfully.');
        } else {
            await axiosInstance.post('/clients', form.value);
            showNotification('success', 'Added!', 'Client added successfully.');
        }
        
        await loadClients();
        modal.hide();
    } catch (error) {
        console.error('Error saving client:', error);
        showNotification('error', 'Error', error.response?.data?.message || 'Failed to save client.');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = (id) => {
    deleteId.value = id;
    deleteModal.show();
};

const deleteClient = async () => {
    loading.value = true;
    try {
        await axiosInstance.delete(`/clients/${deleteId.value}`);
        await loadClients();
        deleteModal.hide();
        showNotification('success', 'Deleted!', 'Client deleted successfully.');
    } catch (error) {
        console.error('Error deleting client:', error);
        showNotification('error', 'Error', 'Failed to delete client.');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadClients();
    modal = new window.bootstrap.Modal(document.getElementById('clientModal'));
    deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
});
</script>

<style scoped>
.avatar-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
}
</style>