<template>
    <div class="layout-px-spacing">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">Dashboard</router-link></li>
                                <li class="breadcrumb-item active"><span>Apartments</span></li>
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
                            <h4 class="fw-bold mb-1" style="color: #0b57a4;">Apartments Management</h4>
                            <p class="text-muted small mb-0">Manage all available apartments, prices, and images.</p>
                        </div>
                        <button class="btn btn-light border px-4 py-2 fw-bold rounded-2 shadow-sm" @click="openModal()">
                            <i class="fas fa-plus me-2"></i> Add New Apartment
                        </button>
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="custom-table">
                        <v-client-table :data="apartments" :columns="columns" :options="table_options">
                            
                            <template #location="props">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-building me-2" style="color: #0b57a4;"></i>
                                    <span class="fw-semibold">{{ props.row.location }}</span>
                                </div>
                            </template>

                            <template #price="props">
                                <span class="fw-bold" style="color: #0b57a4;">
                                    {{ formatMoney(props.row.price) }}
                                </span>
                            </template>

                            <template #listing_type="props">
                                <span class="badge bg-secondary text-uppercase">{{ props.row.listing_type }}</span>
                            </template>

                            <template #listing_status="props">
                                <span :class="getStatusClass(props.row.listing_status)" class="badge text-uppercase">
                                    {{ props.row.listing_status }}
                                </span>
                            </template>

                            <template #attachments="props">
                                <div v-if="props.row.attachments && props.row.attachments.length > 0" class="d-flex">
                                    <span class="badge bg-primary rounded-pill">
                                        <i class="fas fa-camera me-1"></i> {{ props.row.attachments.length }} Files
                                    </span>
                                </div>
                                <span v-else class="text-muted small">No Images</span>
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

        <!-- Add / Edit Modal (Ndogo - Modal LG) -->
        <div class="modal fade" id="apartmentModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    
                    <div class="modal-header" style="background-color: #0b57a4; color: white; border-radius: 1rem 1rem 0 0;">
                        <h5 class="modal-title fw-bold">{{ isEdit ? 'Edit Apartment Details' : 'Add New Apartment' }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body p-4">
                        <form @submit.prevent="saveApartment">
                            <div class="row g-3">
                                
                                <!-- Supplier Dropdown -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Supplier *</label>
                                    <select v-model="form.supplier_id" class="form-select form-select-lg" required>
                                        <option :value="null" disabled>-- Select Supplier --</option>
                                        <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                                            {{ supplier.name }} ({{ supplier.phone }})
                                        </option>
                                    </select>
                                </div>
                                
                                <!-- Location -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Location *</label>
                                    <input type="text" v-model="form.location" class="form-control form-control-lg" placeholder="e.g., Mikocheni, Dar es Salaam" required>
                                </div>
                                
                                <!-- Price -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Price (TZS) *</label>
                                    <input type="number" v-model="form.price" class="form-control form-control-lg" placeholder="e.g., 500000" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Ownership Type</label>
                                    <input type="text" v-model="form.ownership_type" class="form-control form-control-lg" placeholder="e.g., Freehold, Lease">
                                </div>

                                <!-- Listing Type & Status -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Listing Type *</label>
                                    <select v-model="form.listing_type" class="form-select form-select-lg" required>
                                        <option value="sale">For Sale</option>
                                        <option value="rent">For Rent</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Status *</label>
                                    <select v-model="form.listing_status" class="form-select form-select-lg" required>
                                        <option value="available">Available</option>
                                        <option value="pending">Pending</option>
                                        <option value="sold">Sold</option>
                                        <option value="rented">Rented</option>
                                    </select>
                                </div>

                                <!-- Description (Fupi) -->
                                <div class="col-12">
                                    <label class="form-label fw-bold small text-muted">Description</label>
                                    <textarea v-model="form.description" class="form-control" rows="2" placeholder="Describe the apartment details..."></textarea>
                                </div>

                                <!-- Attachments (Picha) -->
                                <div class="col-12">
                                    <div class="p-3 border rounded bg-light">
                                        <label class="form-label fw-bold small text-muted">
                                            <i class="fas fa-camera me-2"></i> Upload Images & Documents
                                        </label>
                                        <input type="file" class="form-control" multiple @change="handleFileUpload" accept="image/*,.pdf">
                                        <small class="text-muted d-block mt-1">You can upload multiple images (JPG, PNG) or PDFs.</small>
                                        
                                        <div v-if="selectedFiles.length > 0" class="mt-2 d-flex flex-wrap gap-2">
                                            <div v-for="(file, index) in selectedFiles" :key="index" class="border p-1 rounded bg-white shadow-sm d-flex align-items-center" style="font-size: 0.8rem;">
                                                <i class="fas fa-file-image text-primary me-1"></i>
                                                <span class="text-muted text-truncate" style="max-width: 100px;">{{ file.name }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer bg-light" style="border-radius: 0 0 1rem 1rem;">
                        <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning px-4 fw-bold text-white" style="background-color: #f38218; border: none;" @click="saveApartment" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ loading ? 'Saving...' : 'Save Apartment' }}
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
                        <p class="text-muted small mb-4">This action cannot be undone. Do you really want to delete this apartment?</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger px-4" @click="deleteApartment" :disabled="loading">
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

useMeta({ title: 'Manage Apartments' });

const apartments = ref([]);
const suppliers = ref([]);
const loading = ref(false);
const isEdit = ref(false);
const selectedFiles = ref([]);
let modal = null;
let deleteModal = null;
let deleteId = ref(null);

const form = ref({
    id: null,
    supplier_id: null,
    location: '',
    price: '',
    description: '',
    listing_type: 'sale',
    listing_status: 'available',
    ownership_type: 'Freehold'
});

const columns = ref(['location', 'price', 'listing_type', 'listing_status', 'attachments', 'actions']);
const table_options = ref({
    perPage: 10,
    perPageValues: [10, 25, 50, 100],
    skin: 'table table-hover',
    columnsClasses: {
        actions: 'text-center',
        attachments: 'text-center',
        listing_status: 'text-center',
        listing_type: 'text-center'
    },
    sortable: ['location', 'price'],
    filterable: ['location', 'description'],
    headings: {
        location: 'Location',
        price: 'Price (TZS)',
        listing_type: 'Type',
        listing_status: 'Status',
        attachments: 'Media',
        actions: 'Actions'
    }
});

const loadSuppliers = async () => {
    try {
        const response = await axiosInstance.get('/suppliers');
        suppliers.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading suppliers:', error);
    }
};

const loadApartments = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/apartments');
        apartments.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading apartments:', error);
        showNotification('error', 'Error', 'Failed to load apartments.');
    } finally {
        loading.value = false;
    }
};

const openModal = (apartment = null) => {
    selectedFiles.value = [];
    if (apartment) {
        isEdit.value = true;
        form.value = { ...apartment };
    } else {
        isEdit.value = false;
        form.value = {
            id: null,
            supplier_id: null,
            location: '',
            price: '',
            description: '',
            listing_type: 'sale',
            listing_status: 'available',
            ownership_type: 'Freehold'
        };
    }
    modal.show();
};

const handleFileUpload = (event) => {
    selectedFiles.value = Array.from(event.target.files);
};

const saveApartment = async () => {
    if (!form.value.supplier_id || !form.value.location || !form.value.price) {
        showNotification('warning', 'Validation Error', 'Please fill in all required fields.');
        return;
    }

    loading.value = true;
    
    const formData = new FormData();
    formData.append('supplier_id', form.value.supplier_id);
    formData.append('location', form.value.location);
    formData.append('price', form.value.price);
    formData.append('description', form.value.description || '');
    formData.append('listing_type', form.value.listing_type);
    formData.append('listing_status', form.value.listing_status);
    formData.append('ownership_type', form.value.ownership_type);

    selectedFiles.value.forEach(file => {
        formData.append('images[]', file);
    });

    try {
        if (isEdit.value) {
            formData.append('_method', 'PUT');
            await axiosInstance.post(`/apartments/${form.value.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showNotification('success', 'Updated!', 'Apartment updated successfully.');
        } else {
            await axiosInstance.post('/apartments', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showNotification('success', 'Added!', 'Apartment added successfully.');
        }
        
        await loadApartments();
        modal.hide();
    } catch (error) {
        console.error('Error saving apartment:', error);
        showNotification('error', 'Error', error.response?.data?.message || 'Failed to save apartment.');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = (id) => {
    deleteId.value = id;
    deleteModal.show();
};

const deleteApartment = async () => {
    loading.value = true;
    try {
        await axiosInstance.delete(`/apartments/${deleteId.value}`);
        await loadApartments();
        deleteModal.hide();
        showNotification('success', 'Deleted!', 'Apartment deleted successfully.');
    } catch (error) {
        console.error('Error deleting apartment:', error);
        showNotification('error', 'Error', 'Failed to delete apartment.');
    } finally {
        loading.value = false;
    }
};

const formatMoney = (value) => {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(value);
};

const getStatusClass = (status) => {
    if (status === 'available') return 'bg-success';
    if (status === 'sold') return 'bg-danger';
    if (status === 'pending') return 'bg-warning text-dark';
    return 'bg-secondary';
};

onMounted(() => {
    loadApartments();
    loadSuppliers();
    modal = new window.bootstrap.Modal(document.getElementById('apartmentModal'));
    deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
});
</script>

<style scoped>
:deep(.VueTables__table th) {
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #6c757d;
    background-color: #f8f9fa;
    padding: 15px;
    border-bottom: 2px solid #e9ecef;
}
:deep(.VueTables__table td) {
    vertical-align: middle;
    padding: 15px;
    border-bottom: 1px solid #e9ecef;
}
:deep(.VueTables__search-field input) {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
}
:deep(.VueTables__limit-field select) {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
}
</style>