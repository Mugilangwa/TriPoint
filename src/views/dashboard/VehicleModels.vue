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
                                <li class="breadcrumb-item active"><span>Vehicle Models</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row layout-top-spacing">
            <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div class="panel br-6 p-4 shadow-sm bg-white rounded-4 border-0">
                    
                    <!-- Header & Add Button -->
                    <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                        <div>
                            <h4 class="fw-bold mb-1" style="color: #0b57a4;">Vehicle Models</h4>
                            <p class="text-muted small mb-0">Manage car makes and models (e.g., Toyota Prado).</p>
                        </div>
                        <button class="btn btn-warning px-4 py-2 fw-bold text-white rounded-2 shadow-sm" style="background-color: #f38218; border: none;" @click="openModal()">
                            <i class="fas fa-plus me-2"></i> Add New Model
                        </button>
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="custom-table">
                        <!-- Nimetumia Bootstrap table classes kwenye v-client-table -->
                        <v-client-table :data="models" :columns="columns" :options="table_options">
                            
                            <!-- Brand / Make -->
                            <template #make="props">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-car me-2" style="color: #0b57a4; font-size: 1.2rem;"></i>
                                    <span class="fw-bold text-dark">{{ props.row.make }}</span>
                                </div>
                            </template>

                            <!-- Model Name -->
                            <template #model="props">
                                <span class="badge bg-light text-dark border px-3 py-2" style="font-size: 0.9rem;">
                                    {{ props.row.model }}
                                </span>
                            </template>

                            <!-- Full Name -->
                            <template #full_name="props">
                                <span class="text-muted small">
                                    {{ props.row.make }} {{ props.row.model }}
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
        <div class="modal fade" id="modelModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-md modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    
                    <div class="modal-header bg-info text-white" >
                        <h5 class="modal-title fw-bold">{{ isEdit ? 'Edit Vehicle Model' : 'Add New Vehicle Model' }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body p-4">
                        <form @submit.prevent="saveModel">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label fw-bold small text-muted">Car Make (Brand) *</label>
                                    <input type="text" v-model="form.make" class="form-control form-control-lg" placeholder="e.g., Toyota, Nissan, Ford" required>
                                    <small class="text-muted">Enter the manufacturer or brand name.</small>
                                </div>
                                
                                <div class="col-12">
                                    <label class="form-label fw-bold small text-muted">Car Model *</label>
                                    <input type="text" v-model="form.model" class="form-control form-control-lg" placeholder="e.g., Prado, Hilux, Land Cruiser" required>
                                    <small class="text-muted">Enter the specific model name.</small>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer bg-light" style="border-radius: 0 0 1rem 1rem;">
                        <button type="button" class="btn btn-light border px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning px-4 fw-bold text-white" style="background-color: #f38218; border: none;" @click="saveModel" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ loading ? 'Saving...' : 'Save Model' }}
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
                        <p class="text-muted small mb-4">This action cannot be undone. Do you really want to delete this model?</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger px-4" @click="deleteModel" :disabled="loading">
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

useMeta({ title: 'Vehicle Models' });

const models = ref([]);
const loading = ref(false);
const isEdit = ref(false);
let modal = null;
let deleteModal = null;
let deleteId = ref(null);

const form = ref({
    model_id: null,
    make: '',
    model: ''
});

// Nimetumia Bootstrap class 'table table-hover' hapa
const columns = ref(['make', 'model', 'full_name', 'actions']);
const table_options = ref({
    perPage: 10,
    perPageValues: [10, 25, 50, 100],
    skin: 'table table-hover table-bordered mb-0', // Bootstrap Table classes
    columnsClasses: {
        actions: 'text-center',
        full_name: 'text-center'
    },
    sortable: ['make', 'model'],
    filterable: ['make', 'model'],
    headings: {
        make: 'Brand / Make',
        model: 'Model Name',
        full_name: 'Full Name',
        actions: 'Actions'
    }
});

const loadModels = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/vehicle-models');
        models.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error loading models:', error);
        showNotification('error', 'Error', 'Failed to load vehicle models');
    } finally {
        loading.value = false;
    }
};

const openModal = (model = null) => {
    if (model) {
        isEdit.value = true;
        form.value = { model_id: model.id, make: model.make, model: model.model };
    } else {
        isEdit.value = false;
        form.value = { model_id: null, make: '', model: '' };
    }
    modal.show();
};

const saveModel = async () => {
    if (!form.value.make || !form.value.model) {
        showNotification('warning', 'Validation Error', 'Please fill in both Make and Model fields');
        return;
    }

    loading.value = true;
    try {
        if (isEdit.value) {
            await axiosInstance.put(`/vehicle-models/${form.value.model_id}`, form.value);
            showNotification('success', 'Updated!', 'Vehicle model updated successfully.');
        } else {
            await axiosInstance.post('/vehicle-models', form.value);
            showNotification('success', 'Added!', 'Vehicle model added successfully.');
        }
        await loadModels();
        modal.hide();
    } catch (error) {
        showNotification('error', 'Error', error.response?.data?.message || 'Failed to save vehicle model.');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = (id) => {
    deleteId.value = id;
    deleteModal.show();
};

const deleteModel = async () => {
    loading.value = true;
    try {
        await axiosInstance.delete(`/vehicle-models/${deleteId.value}`);
        await loadModels();
        deleteModal.hide();
        showNotification('success', 'Deleted!', 'Vehicle model deleted successfully.');
    } catch (error) {
        showNotification('error', 'Error', 'Cannot delete model. It might be linked to existing vehicles.');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadModels();
    modal = new window.bootstrap.Modal(document.getElementById('modelModal'));
    deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
});
</script>

<style scoped>
/* 
   Nimeondoa zile CSS zote za :deep(.VueTables...). 
   Sasa tunatumia Bootstrap classes pekee zilizowekwa kwenye 'skin' hapo juu.
   Hii inafanya kodi kuwa safi (clean) na rahisi kusoma.
*/
</style>