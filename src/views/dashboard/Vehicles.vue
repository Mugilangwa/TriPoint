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
                                <li class="breadcrumb-item active"><span>Vehicles</span></li>
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
                            <h4 class="fw-bold mb-1" style="color: #0b57a4;">Vehicle Fleet Management</h4>
                            <p class="text-muted small mb-0">Manage all vehicles, availability, and images.</p>
                        </div>
                        <button class="btn btn-light border px-4 py-2 fw-bold rounded-2 shadow-sm" @click="openModal()">
                            <i class="fas fa-plus me-2"></i> Add New Vehicle
                        </button>
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="custom-table">
                        <v-client-table :data="vehicles" :columns="columns" :options="table_options">
                                                        <!-- Picha ya Gari (Thumbnail) -->
                            <template #image="props">
                                <div class="car-thumbnail">
                                    <img 
                                        v-if="props.row.attachments && props.row.attachments.length > 0" 
                                        :src="props.row.attachments[0].url" 
                                        alt="Car Image" 
                                        class="img-fluid rounded border"
                                    >
                                    <div v-else class="no-image">
                                        <i class="fas fa-car"></i>
                                    </div>
                                </div>
                            </template>

                            <!-- Registration & Model -->
                            <template #vehicle_details="props">
                                <div class="fw-bold">{{ props.row.registration_number }}</div>
                                <small class="text-muted">{{ props.row.car_model?.make }} {{ props.row.car_model?.model }}</small>
                            </template>

                            <!-- Color -->
                            <template #color="props">
                                <span class="badge bg-light text-dark border">{{ props.row.color }}</span>
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
        <div class="modal fade" id="vehicleModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    
                    <div class="modal-header" style="background-color: #0b57a4; color: white; border-radius: 1rem 1rem 0 0;">
                        <h5 class="modal-title fw-bold">{{ isEdit ? 'Edit Vehicle Details' : 'Add New Vehicle' }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body p-4">
                        <form @submit.prevent="saveVehicle">
                            <div class="row g-3">
                                
                                <!-- Vehicle Model Dropdown -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Car Model *</label>
                                    <select v-model="form.model_id" class="form-select form-select-lg" required>
                                        <option :value="null" disabled>-- Select Car Model --</option>
                                        <option v-for="model in models" :key="model.id" :value="model.id">
                                            {{ model.make }} {{ model.model }}
                                        </option>
                                    </select>
                                </div>
                                
                                <!-- Registration Number -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Registration Number *</label>
                                    <input type="text" v-model="form.registration_number" class="form-control form-control-lg" placeholder="e.g., T123 ABC" required>
                                </div>
                                
                                <!-- Color -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Color *</label>
                                    <input type="text" v-model="form.vehicle_color" class="form-control form-control-lg" placeholder="e.g., White, Black" required>
                                </div>

                                <!-- Status -->
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted">Availability Status *</label>
                                    <select v-model="form.availability_status" class="form-select form-select-lg" required>
                                        <option value="available">Available</option>
                                        <option value="rented">Rented</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>

                                <!-- Attachments (Picha) -->
                                <div class="col-12">
                                    <div class="p-3 border rounded bg-light">
                                        <label class="form-label fw-bold small text-muted">
                                            <i class="fas fa-camera me-2"></i> Upload Vehicle Images
                                        </label>
                                        <input type="file" class="form-control" multiple @change="handleFileUpload" accept="image/*">
                                        <small class="text-muted d-block mt-1">Upload one or more images of the vehicle (JPG, PNG).</small>
                                        
                                        <!-- Preview ya Picha -->
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
                        <button type="button" class="btn btn-warning px-4 fw-bold text-white" style="background-color: #f38218; border: none;" @click="saveVehicle" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ loading ? 'Saving...' : 'Save Vehicle' }}
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
                        <p class="text-muted small mb-4">This action cannot be undone. Do you really want to delete this vehicle?</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger px-4" @click="deleteVehicle" :disabled="loading">
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

useMeta({ title: 'Manage Vehicles' });

const vehicles = ref([]);
const models = ref([]); // Kwa ajili ya dropdown ya models
const loading = ref(false);
const isEdit = ref(false);
const selectedFiles = ref([]);
let modal = null;
let deleteModal = null;
let deleteId = ref(null);

const form = ref({
    vehicle_id: null,
    model_id: null,
    registration_number: '',
    vehicle_color: '',
    availability_status: 'available'
});

const columns = ref(['image', 'vehicle_details', 'color', 'status', 'actions']);
const table_options = ref({
    perPage: 10,
    perPageValues: [10, 25, 50, 100],
    skin: 'table table-hover',
    columnsClasses: {
        actions: 'text-center',
        image: 'text-center',
        status: 'text-center',
        color: 'text-center'
    },
    sortable: ['registration_number', 'vehicle_color'],
    filterable: ['registration_number'],
    headings: {
        image: 'Photo',
        vehicle_details: 'Vehicle / Registration',
        color: 'Color',
        status: 'Status',
        actions: 'Actions'
    }
});

// Load Models kwa ajili ya Dropdown
const loadModels = async () => {
    try {
        const response = await axiosInstance.get('/vehicle-models');
        models.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading models:', error);
    }
};

const loadVehicles = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/vehicles');
        vehicles.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading vehicles:', error);
        showNotification('error', 'Error', 'Failed to load vehicles.');
    } finally {
        loading.value = false;
    }
};

const openModal = (vehicle = null) => {
    selectedFiles.value = [];
    if (vehicle) {
        isEdit.value = true;
        form.value = { ...vehicle };
    } else {
        isEdit.value = false;
        form.value = {
            vehicle_id: null,
            model_id: null,
            registration_number: '',
            vehicle_color: '',
            availability_status: 'available'
        };
    }
    modal.show();
};

const handleFileUpload = (event) => {
    selectedFiles.value = Array.from(event.target.files);
};

const saveVehicle = async () => {
    if (!form.value.model_id || !form.value.registration_number || !form.value.vehicle_color) {
        showNotification('warning', 'Validation Error', 'Please fill in all required fields.');
        return;
    }

    loading.value = true;
    
    const formData = new FormData();
    formData.append('model_id', form.value.model_id);
    formData.append('registration_number', form.value.registration_number);
    formData.append('vehicle_color', form.value.vehicle_color);
    formData.append('availability_status', form.value.availability_status);

    // Ongeza picha
    selectedFiles.value.forEach(file => {
        formData.append('images[]', file);
    });

    try {
        if (isEdit.value) {
            formData.append('_method', 'PUT');
            await axiosInstance.post(`/vehicles/${form.value.vehicle_id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showNotification('success', 'Updated!', 'Vehicle updated successfully.');
        } else {
            await axiosInstance.post('/vehicles', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showNotification('success', 'Added!', 'Vehicle added successfully.');
        }
        
        await loadVehicles();
        modal.hide();
    } catch (error) {
        console.error('Error saving vehicle:', error);
        showNotification('error', 'Error', error.response?.data?.message || 'Failed to save vehicle.');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = (id) => {
    deleteId.value = id;
    deleteModal.show();
};

const deleteVehicle = async () => {
    loading.value = true;
    try {
        await axiosInstance.delete(`/vehicles/${deleteId.value}`);
        await loadVehicles();
        deleteModal.hide();
        showNotification('success', 'Deleted!', 'Vehicle deleted successfully.');
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        showNotification('error', 'Error', 'Failed to delete vehicle.');
    } finally {
        loading.value = false;
    }
};

const getStatusClass = (status) => {
    if (status === 'available') return 'bg-success';
    if (status === 'rented') return 'bg-warning text-dark';
    if (status === 'maintenance') return 'bg-danger';
    return 'bg-secondary';
};

onMounted(() => {
    loadVehicles();
    loadModels();
    modal = new window.bootstrap.Modal(document.getElementById('vehicleModal'));
    deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
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

/* Muundo wa Picha ya Gari kwenye Table */
.car-thumbnail {
    width: 80px;
    height: 50px;
    overflow: hidden;
    border-radius: 6px;
    margin: 0 auto;
}
.car-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.no-image {
    width: 100%;
    height: 100%;
    background: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #adb5bd;
    font-size: 1.5rem;
}
</style>