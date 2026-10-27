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
                <div class="panel br-6 p-4 shadow-sm bg-white rounded">
                    
                    <!-- Header & Add Button -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 class="fw-bold mb-1" style="color: #0b57a4;">Supplier Management</h4>
                            <p class="text-muted small mb-0">Manage all individuals or companies providing properties (Land, Plots, Apartments).</p>
                        </div>
                        <button class="btn btn-warning px-4 py-2 fw-bold text-white rounded-2" style="background-color: #f38218; border: none;" @click="openModal()">
                            <i class="fas fa-plus me-2"></i> Add New Supplier
                        </button>
                    </div>

                    <!-- Data Table -->
                    <div class="custom-table">
                        <v-client-table :data="suppliers" :columns="columns" :options="table_options">
                            
                            <!-- Custom Column: Supplier Name with Avatar -->
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

                            <!-- Custom Column: Phone -->
                            <template #phone_number="props">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-phone-alt me-2 text-muted small"></i>
                                    <span>{{ props.row.phone }}</span>
                                </div>
                            </template>

                            <!-- Custom Column: Email -->
                            <template #email="props">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-envelope me-2 text-muted small"></i>
                                    <a :href="`mailto:${props.row.email}`" class="text-decoration-none">{{ props.row.email || 'N/A' }}</a>
                                </div>
                            </template>

                            <!-- Custom Column: Properties Count -->
                            <template #properties="props">
                                <span class="badge bg-primary rounded-pill">
                                    {{ (props.row.plots_count || 0) + (props.row.apartments_count || 0) }} Properties
                                </span>
                            </template>

                            <!-- Custom Column: Actions -->
                            <template #actions="props">
                                <div class="d-flex gap-2 justify-content-center">
                                    <button class="btn btn-sm btn-outline-primary" @click="openModal(props.row)" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteSupplier(props.row.id)" title="Delete">
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
                    
                    <div class="modal-header" style="background-color: #0b57a4; color: white; border-radius: 1rem 1rem 0 0;">
                        <h5 class="modal-title fw-bold">{{ isEdit ? 'Edit Supplier Details' : 'Add New Supplier' }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body p-4">
                        <form @submit.prevent="saveSupplier">
                            <div class="row g-3">
                                <!-- Supplier Name -->
                                <div class="col-md-12">
                                    <label class="form-label fw-bold small text-muted">Supplier / Company Name *</label>
                                    <input type="text" v-model="form.supplier_name" class="form-control" placeholder="e.g., ABC Holdings Ltd" required>
                                </div>
                                
                                <!-- Phone Number -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Phone Number *</label>
                                    <input type="text" v-model="form.phone_number" class="form-control" placeholder="e.g., +255 754 000 000" required>
                                </div>
                                
                                <!-- Email -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Email Address</label>
                                    <input type="email" v-model="form.email" class="form-control" placeholder="e.g., contact@abcholdings.com">
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
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning px-4 fw-bold text-white" style="background-color: #f38218; border: none;" @click="saveSupplier" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ loading ? 'Saving...' : 'Save Supplier' }}
                        </button>
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

useMeta({ title: 'Manage Suppliers' });

const suppliers = ref([]);
const loading = ref(false);
const isEdit = ref(false);
let modal = null;

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
    skin: 'table table-hover',
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
        // API inarudisha data ndani ya `data` (kutokana na Resource)
        suppliers.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading suppliers:', error);
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
    loading.value = true;
    try {
        if (isEdit.value) {
            await axiosInstance.put(`/suppliers/${form.value.supplier_id}`, form.value);
        } else {
            await axiosInstance.post('/suppliers', form.value);
        }
        
        await loadSuppliers();
        modal.hide();
        alert('Supplier saved successfully!');
    } catch (error) {
        console.error('Error saving supplier:', error);
        alert(error.response?.data?.message || 'Failed to save supplier. Check console for details.');
    } finally {
        loading.value = false;
    }
};

const deleteSupplier = async (id) => {
    if (confirm('Are you sure you want to delete this supplier? Note: This might affect properties linked to them.')) {
        try {
            await axiosInstance.delete(`/suppliers/${id}`);
            await loadSuppliers();
        } catch (error) {
            console.error('Error deleting supplier:', error);
            alert('Cannot delete supplier. They might have properties attached.');
        }
    }
};

onMounted(() => {
    loadSuppliers();
    modal = new window.bootstrap.Modal(document.getElementById('supplierModal'));
});
</script>

<style scoped>
/* Kuboresha muonekano wa Table */
:deep(.VueTables__table th) {
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #6c757d;
    background-color: #f8f9fa;
    padding: 15px;
}
:deep(.VueTables__table td) {
    vertical-align: middle;
    padding: 15px;
}
:deep(.VueTables__search-field input) {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

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