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
                                <li class="breadcrumb-item"><router-link to="/dashboard/vehicles">Vehicles</router-link></li>
                                <li class="breadcrumb-item active"><span>Vehicle Details</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <!-- Loading Spinner -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 60vh;">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
        </div>

        <div v-else>
            <!-- PAGE HEADER -->
            <div class="d-flex justify-content-between align-items-center mb-4 mt-3 p-4 bg-info text-white rounded-4 shadow-sm">
                <div>
                    <h3 class="fw-bold mb-1">Vehicle Details</h3>
                    <p class="mb-0 text-white-50">View and manage vehicle information and images.</p>
                </div>
                <router-link to="/dashboard/vehicles" class="btn btn-light text-info fw-bold px-4 py-2 rounded-2 shadow-sm">
                    <i class="fas fa-arrow-left me-2"></i> Back to Vehicles
                </router-link>
            </div>

            <div class="row">
                <!-- Taarifa za Gari (Upande wa Kushoto) -->
                <div class="col-lg-5 mb-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h5 class="fw-bold mb-0" style="color: #0b57a4;"><i class="fas fa-info-circle me-2"></i>Vehicle Info</h5>
                                <span class="badge px-3 py-2 fs-6" :class="getStatusClass(vehicle.status)">
                                    {{ vehicle.status ? vehicle.status.toUpperCase() : 'N/A' }}
                                </span>
                            </div>
                            
                            <div class="mb-4">
                                <label class="text-muted small fw-bold text-uppercase">Registration Number</label>
                                <h3 class="fw-bold text-dark mb-0">{{ vehicle.registration_number }}</h3>
                            </div>

                            <div class="row mb-4">
                                <div class="col-6">
                                    <label class="text-muted small fw-bold text-uppercase">Car Model</label>
                                    <h6 class="fw-bold mb-0">{{ vehicle.car_model?.make }} {{ vehicle.car_model?.model }}</h6>
                                </div>
                                <div class="col-6">
                                    <label class="text-muted small fw-bold text-uppercase">Color</label>
                                    <h6 class="fw-bold mb-0">{{ vehicle.color }}</h6>
                                </div>
                            </div>

                            <div class="p-3 bg-light rounded-3 mt-4">
                                <div class="d-flex align-items-center text-muted small">
                                    <i class="fas fa-info-circle me-2 text-primary"></i>
                                    Vehicle ID: #{{ vehicle.id }}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Picha za Gari (Upande wa Kulia) -->
                <div class="col-lg-7 mb-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            
                            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h5 class="fw-bold mb-0" style="color: #0b57a4;"><i class="fas fa-images me-2"></i>Vehicle Images</h5>
                                
                                <!-- Kitufe cha Kupakia Picha Mpya -->
                                <div>
                                    <input type="file" ref="fileInput" multiple @change="uploadImages" class="d-none" accept="image/*">
                                    <button class="btn btn-outline-info px-3 py-2 fw-bold" @click="$refs.fileInput.click()" :disabled="uploading">
                                        <i class="fas fa-cloud-upload-alt me-2"></i>{{ uploading ? 'Uploading...' : 'Upload Images' }}
                                    </button>
                                </div>
                            </div>

                            <!-- Kama Hakuna Picha -->
                            <div v-if="!vehicle.attachments || vehicle.attachments.length === 0" class="text-center py-5 text-muted bg-light rounded-3">
                                <i class="fas fa-camera-retro display-3 mb-3 text-muted opacity-50"></i>
                                <h5>No images uploaded yet</h5>
                                <p class="small mb-0">Click "Upload Images" to add photos for this vehicle.</p>
                            </div>

                            <!-- HTML TABLE YA PICHA -->
                            <div v-else class="table-responsive">
                                <table class="table table-hover align-middle border">
                                    <thead class="bg-light">
                                        <tr>
                                            <th scope="col" style="width: 80px;">Image</th>
                                            <th scope="col">File Name</th>
                                            <th scope="col" style="width: 150px;" class="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="img in vehicle.attachments" :key="img.id">
                                            <!-- Column 1: Picha Ndogo -->
                                            <td>
                                                <img :src="img.url" class="rounded border shadow-sm" 
                                                     style="width: 60px; height: 45px; object-fit: cover;" 
                                                     alt="Thumbnail">
                                            </td>
                                            
                                            <!-- Column 2: Jina la Picha -->
                                            <td>
                                                <h6 class="fw-bold mb-1 text-truncate" style="max-width: 250px;" :title="img.name">
                                                    {{ img.name }}
                                                </h6>
                                                <small class="text-muted text-uppercase">{{ img.type }}</small>
                                            </td>
                                            
                                            <!-- Column 3: Vitufe vya Action -->
                                            <td class="text-center">
                                                <div class="d-flex gap-2 justify-content-center">
                                                    <!-- Kitufe cha View (Kufungua Modal) -->
                                                    <button class="btn btn-sm btn-outline-info" @click="openPreview(img)" title="Preview Image">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <!-- Kitufe cha Delete -->
                                                    <button class="btn btn-sm btn-outline-danger" @click="deleteImage(img.id)" title="Delete Image">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- =========================================
             MODAL YA KUPREVIEW PICHA (Image Preview)
             ========================================= -->
        <div class="modal fade" id="previewModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 bg-dark">
                    <div class="modal-header border-0">
                        <h6 class="modal-title text-white text-truncate">{{ previewImage.name }}</h6>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-0 text-center">
                        <img :src="previewImage.url" class="img-fluid w-100" style="max-height: 75vh; object-fit: contain;" alt="Preview Image">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { axiosInstance } from '@/services/axios';
import { useMeta } from '@/composables/use-meta';
import { useNotification } from '@/composables/swal';

const { showNotification } = useNotification();
const route = useRoute();

const loading = ref(true);
const uploading = ref(false);
const vehicle = ref({});
const fileInput = ref(null);

// Kwa ajili ya Preview Modal
const previewImage = ref({ name: '', url: '' });
let previewModal = null;

const id = route.params.id;

useMeta({ title: 'Vehicle Details' });

const fetchVehicle = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get(`/vehicles/${id}`);
        vehicle.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        showNotification('error', 'Error', 'Failed to load vehicle details.');
    } finally {
        loading.value = false;
    }
};

const openPreview = (img) => {
    previewImage.value = img;
    previewModal.show();
};

const deleteImage = async (attachmentId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
        await axiosInstance.delete(`/attachments/${attachmentId}`);
        showNotification('success', 'Deleted!', 'Image deleted successfully.');
        fetchVehicle(); 
    } catch (error) {
        console.error('Error deleting image:', error);
        showNotification('error', 'Error', 'Failed to delete image.');
    }
};

const uploadImages = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    uploading.value = true;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i]);
    }
    
    const endpoint = `/vehicles/${id}`;
    formData.append('_method', 'PUT');

    try {
        await axiosInstance.post(endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('success', 'Uploaded!', 'Images uploaded successfully.');
        await fetchVehicle(); 
        fileInput.value.value = ''; 
    } catch (error) {
        console.error('Error uploading images:', error);
        showNotification('error', 'Error', 'Failed to upload images.');
    } finally {
        uploading.value = false;
    }
};

const getStatusClass = (status) => {
    if (status === 'available') return 'bg-success text-white';
    if (status === 'rented') return 'bg-warning text-dark';
    if (status === 'maintenance') return 'bg-danger text-white';
    return 'bg-secondary text-white';
};

onMounted(() => {
    fetchVehicle();
    // Kuanzisha Modal ya Bootstrap
    previewModal = new window.bootstrap.Modal(document.getElementById('previewModal'));
});
</script>

<style scoped>


/* Muonekano wa Jedwali */
.table th {
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
    font-size: 0.85rem;
}
.table td {
    vertical-align: middle;
}
</style>