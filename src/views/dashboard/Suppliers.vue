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
                                <li class="breadcrumb-item active"><span>Suppliers</span></li>
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
                            <h4 class="fw-bold mb-1" style="color: #0b57a4;">Supplier Management</h4>
                            <p class="text-muted small mb-0">Manage all individuals or companies providing properties.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <!-- Kitufe cha Refresh -->
                            <button class="btn btn-outline-primary px-4 py-2 fw-bold rounded-2 shadow-sm" @click="loadSuppliers" :disabled="loading">
                                <i class="fas fa-sync me-2" :class="{ 'fa-spin': loading }"></i> Refresh
                            </button>
                            <!-- Kitufe cha Kuongeza -->
                            <button class="btn btn-warning px-4 py-2 fw-bold text-white rounded-2 shadow-sm" style="background-color: #f38218; border: none;" @click="openModal()">
                                <i class="fas fa-plus me-2"></i> Add New Supplier
                            </button>
                        </div>
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="custom-table">
                        <v-client-table :data="suppliers" :columns="columns" :options="table_options">
                            
                            <!-- Supplier Name with Avatar -->
                            <template #supplier_name="props">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-circle me-2" :style="{ backgroundColor: getColor(props.row.id) }">
                                        {{ getInitial(props.row.name) }}
                                    </div>
                                    <div>
                                        <div class="fw-bold">{{ props.row.name }}</div>
                                        <span class="small text-muted">{{ props.row.address || 'No address provided' }}</span>
                                    </div>
                                </div>
                            </template>

                            <!-- Phone -->
                            <template #phone_number="props">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-phone-alt me-2 text-muted small"></i>
                                    <span>{{ props.row.phone }}</span>
                                </div>
                            </template>

                            <!-- Email -->
                            <template #email="props">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-envelope me-2 text-muted small"></i>
                                    <a :href="`mailto:${props.row.email}`" class="text-decoration-none">{{ props.row.email || 'N/A' }}</a>
                                </div>
                            </template>

                            <!-- Properties Count -->
                            <template #properties="props">
                                <span class="badge bg-primary rounded-pill">
                                    {{ (props.row.plots_count || 0) + (props.row.apartments_count || 0) }} Properties
                                </span>
                            </template>

                            <!-- Actions -->
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
        <div class="modal fade" id="supplierModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title fw-bold">{{ isEdit ? 'Edit Supplier Details' : 'Add New Supplier' }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body p-4">
                        <form @submit.prevent="saveSupplier">
                            <div class="row g-3">
                                <!-- Supplier Name -->
                                <div class="col-md-12">
                                    <label class="form-label fw-bold small text-muted">Supplier / Company Name *</label>
                                    <input type="text" v-model="form.supplier_name" class="form-control form-control-lg" placeholder="e.g., ABC Holdings Ltd" required>
                                </div>
                                
                                <!-- Phone Number -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Phone Number *</label>
                                    <input type="text" v-model="form.phone_number" class="form-control form-control-lg" placeholder="e.g., +255 754 000 000" required>
                                </div>
                                
                                <!-- Email -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Email Address</label>
                                    <input type="email" v-model="form.email" class="form-control form-control-lg" placeholder="e.g., contact@abcholdings.com">
                                </div>

                                <!-- Address -->
                                <div class="col-md-12">
                                    <label class="form-label fw-bold small text-muted">Physical Address</label>
                                    <textarea v-model="form.address" class="form-control" rows="3" placeholder="e.g., Plot 45, Mikocheni, Dar es Salaam"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer bg-light" style="border-radius: 0 0 1rem 1rem;">
                        <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning px-4 fw-bold text-white" style="background-color: #f38218; border: none;" @click="saveSupplier" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ loading ? 'Saving...' : 'Save Supplier' }}
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
                        <p class="text-muted small mb-4">This action cannot be undone. Do you really want to delete this supplier?</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger px-4" @click="deleteSupplier" :disabled="loading">
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

useMeta({ title: 'Manage Suppliers' });

const suppliers = ref([]);
const loading = ref(false);
const isEdit = ref(false);
let modal = null;
let deleteModal = null;
let deleteId = ref(null);

const form = ref({
    supplier_id: null,
    supplier_name: '',
    phone_number: '',
    email: '',
    address: ''
});

// V-Client-Table Configuration
const columns = ref(['supplier_name', 'phone_number', 'email', 'properties', 'actions']);
const table_options = ref({
    perPage: 10,
    perPageValues: [10, 25, 50, 100],
    skin: 'table table-hover table-bordered mb-0',
    columnsClasses: {
        actions: 'text-center',
        properties: 'text-center'
    },
    sortable: ['supplier_name', 'phone_number'],
    filterable: ['supplier_name', 'email', 'phone_number'],
    headings: {
        supplier_name: 'Supplier / Company',
        phone_number: 'Phone',
        email: 'Email',
        properties: 'Listings',
        actions: 'Actions'
    }
});

// Helper functions for Avatars
const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'S';
};

const getColor = (id) => {
    const colors = ['#0b57a4', '#f38218', '#198754', '#6c757d', '#dc3545'];
    return colors[id % colors.length];
};

const loadSuppliers = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/suppliers');
        suppliers.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading suppliers:', error);
        showNotification('error', 'Error', 'Failed to load suppliers.');
    } finally {
        loading.value = false;
    }
};

const openModal = (supplier = null) => {
    if (supplier) {
        isEdit.value = true;
        form.value = { 
            supplier_id: supplier.id,
            supplier_name: supplier.name,
            phone_number: supplier.phone,
            email: supplier.email,
            address: supplier.address
        };
    } else {
        isEdit.value = false;
        form.value = {
            supplier_id: null,
            supplier_name: '',
            phone_number: '',
            email: '',
            address: ''
        };
    }
    modal.show();
};

const saveSupplier = async () => {
    if (!form.value.supplier_name || !form.value.phone_number) {
        showNotification('warning', 'Validation Error', 'Please fill in all required fields.');
        return;
    }

    loading.value = true;
    try {
        if (isEdit.value) {
            await axiosInstance.put(`/suppliers/${form.value.supplier_id}`, form.value);
            showNotification('success', 'Updated!', 'Supplier updated successfully.');
        } else {
            await axiosInstance.post('/suppliers', form.value);
            showNotification('success', 'Added!', 'Supplier added successfully.');
        }
        
        await loadSuppliers();
        modal.hide();
    } catch (error) {
        console.error('Error saving supplier:', error);
        showNotification('error', 'Error', error.response?.data?.message || 'Failed to save supplier.');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = (id) => {
    deleteId.value = id;
    deleteModal.show();
};

const deleteSupplier = async () => {
    loading.value = true;
    try {
        await axiosInstance.delete(`/suppliers/${deleteId.value}`);
        await loadSuppliers();
        deleteModal.hide();
        showNotification('success', 'Deleted!', 'Supplier deleted successfully.');
    } catch (error) {
        console.error('Error deleting supplier:', error);
        showNotification('error', 'Error', 'Cannot delete supplier. They might have properties attached.');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadSuppliers();
    modal = new window.bootstrap.Modal(document.getElementById('supplierModal'));
    deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
});
</script>

<style scoped>
/* Muundo wa Avatar (Mduara wenye herufi) */
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