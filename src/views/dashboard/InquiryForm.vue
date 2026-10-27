<template>
    <div class="layout-px-spacing">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">Dashboard</router-link></li>
                                <li class="breadcrumb-item"><router-link to="/dashboard/inquiries">Inquiries</router-link></li>
                                <li class="breadcrumb-item active"><span>{{ isEdit ? 'Edit' : 'Create' }} Inquiry</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row layout-top-spacing">
            <div class="col-xl-8 col-lg-10 col-sm-12 mx-auto layout-spacing">
                <div class="panel br-6 p-4 shadow-sm bg-white rounded">
                    
                    <div class="mb-4 pb-3 border-bottom">
                        <h4 class="fw-bold mb-1" style="color: #0b57a4;">
                            {{ isEdit ? 'Edit Inquiry Details' : 'Create New Inquiry' }}
                        </h4>
                        <p class="text-muted small mb-0">Record a customer's inquiry about a plot or apartment.</p>
                    </div>

                    <div v-if="fetching" class="d-flex justify-content-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <form v-else @submit.prevent="saveInquiry">
                        <div class="row g-4">
                            
                            <!-- Client Dropdown -->
                            <div class="col-md-12">
                                <label class="form-label fw-bold small text-muted">Client *</label>
                                <select v-model="form.client_id" class="form-select form-select-lg" required>
                                    <option :value="null" disabled>-- Select Client --</option>
                                    <option v-for="client in clients" :key="client.id" :value="client.id">
                                        {{ client.full_name }} ({{ client.phone }})
                                    </option>
                                </select>
                            </div>

                            <!-- Property Type Toggle (Plot or Apartment) -->
                            <div class="col-md-12">
                                <label class="form-label fw-bold small text-muted">Property Type *</label>
                                <div class="d-flex gap-3 mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" value="plot" v-model="propertyType" id="typePlot">
                                        <label class="form-check-label fw-bold" for="typePlot">Land / Plot</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" value="apartment" v-model="propertyType" id="typeApartment">
                                        <label class="form-check-label fw-bold" for="typeApartment">Apartment / House</label>
                                    </div>
                                </div>

                                <!-- Plot Dropdown (Kama Plot imechaguliwa) -->
                                <select v-if="propertyType === 'plot'" v-model="form.plot_id" class="form-select form-select-lg" required>
                                    <option :value="null" disabled>-- Select Plot --</option>
                                    <option v-for="plot in plots" :key="plot.id" :value="plot.id">
                                        {{ plot.location }} ({{ plot.size }})
                                    </option>
                                </select>

                                <!-- Apartment Dropdown (Kama Apartment imechaguliwa) -->
                                <select v-if="propertyType === 'apartment'" v-model="form.apartment_id" class="form-select form-select-lg" required>
                                    <option :value="null" disabled>-- Select Apartment --</option>
                                    <option v-for="apartment in apartments" :key="apartment.id" :value="apartment.id">
                                        {{ apartment.location }}
                                    </option>
                                </select>
                            </div>

                            <!-- Date -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Inquiry Date *</label>
                                <input type="date" v-model="form.inquiry_date" class="form-control form-control-lg" required>
                            </div>

                            <!-- Status -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Status *</label>
                                <select v-model="form.inquiry_status" class="form-select form-select-lg" required>
                                    <option value="pending">Pending</option>
                                    <option value="responded">Responded</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                        </div>

                        <div class="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                            <router-link to="/dashboard/inquiries" class="btn btn-light border px-4">Cancel</router-link>
                            <button type="submit" class="btn btn-warning px-5 fw-bold text-white" style="background-color: #f38218; border: none;" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ loading ? 'Saving...' : (isEdit ? 'Update Inquiry' : 'Save Inquiry') }}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosInstance } from '@/services/axios';
import { useMeta } from '@/composables/use-meta';
import { useNotification } from '@/composables/swal';

const { showNotification } = useNotification();
const route = useRoute();
const router = useRouter();

const inquiryId = route.params.id;
const isEdit = computed(() => !!inquiryId);

useMeta({ title: computed(() => isEdit.value ? 'Edit Inquiry' : 'Create Inquiry') });

const clients = ref([]);
const plots = ref([]);
const apartments = ref([]);
const loading = ref(false);
const fetching = ref(true);
const propertyType = ref('plot'); // default ni plot

const form = ref({
    client_id: null,
    plot_id: null,
    apartment_id: null,
    inquiry_date: new Date().toISOString().split('T')[0], // Leo
    inquiry_status: 'pending'
});

const loadInitialData = async () => {
    try {
        const [clientsRes, plotsRes, apartmentsRes] = await Promise.all([
            axiosInstance.get('/clients'),
            axiosInstance.get('/plots'),
            axiosInstance.get('/apartments')
        ]);
        clients.value = clientsRes.data.data || clientsRes.data;
        plots.value = plotsRes.data.data || plotsRes.data;
        apartments.value = apartmentsRes.data.data || apartmentsRes.data;
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('error', 'Error', 'Failed to load required data.');
    }
};

const loadInquiry = async () => {
    if (!isEdit.value) return;
    
    try {
        const response = await axiosInstance.get(`/property-inquiries/${inquiryId}`);
        const data = response.data.data || response.data;
        
        form.value = {
            client_id: data.client_id,
            plot_id: data.property_type === 'Plot' ? data.inquiry_id : null,
            apartment_id: data.property_type === 'Apartment' ? data.inquiry_id : null,
            inquiry_date: data.date,
            inquiry_status: data.status
        };
        
        propertyType.value = data.property_type === 'Plot' ? 'plot' : 'apartment';
    } catch (error) {
        console.error('Error loading inquiry:', error);
        showNotification('error', 'Error', 'Failed to load inquiry details.');
        router.push('/dashboard/inquiries');
    }
};

const saveInquiry = async () => {
    // Hakikisha kwamba aidha plot_id au apartment_id imewekwa
    if (!form.value.client_id || !form.value.inquiry_date) {
        showNotification('warning', 'Validation Error', 'Please fill in all required fields.');
        return;
    }

    if (propertyType.value === 'plot' && !form.value.plot_id) {
        showNotification('warning', 'Validation Error', 'Please select a plot.');
        return;
    }

    if (propertyType.value === 'apartment' && !form.value.apartment_id) {
        showNotification('warning', 'Validation Error', 'Please select an apartment.');
        return;
    }

    loading.value = true;
    try {
        if (isEdit.value) {
            await axiosInstance.put(`/property-inquiries/${inquiryId}`, form.value);
            showNotification('success', 'Updated!', 'Inquiry updated successfully.');
        } else {
            await axiosInstance.post('/property-inquiries', form.value);
            showNotification('success', 'Created!', 'Inquiry created successfully.');
        }
        router.push('/dashboard/inquiries');
    } catch (error) {
        console.error('Error saving inquiry:', error);
        showNotification('error', 'Error', error.response?.data?.message || 'Failed to save inquiry.');
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await loadInitialData();
    await loadInquiry();
    fetching.value = false;
});
</script>