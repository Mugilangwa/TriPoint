<template>
    <div class="layout-px-spacing">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">Dashboard</router-link></li>
                                <li class="breadcrumb-item"><router-link to="/dashboard/bookings">Bookings</router-link></li>
                                <li class="breadcrumb-item active"><span>{{ isEdit ? 'Edit' : 'Create' }} Booking</span></li>
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
                            {{ isEdit ? 'Edit Booking Details' : 'Create New Vehicle Booking' }}
                        </h4>
                        <p class="text-muted small mb-0">
                            {{ isEdit ? 'Update the booking details below.' : 'Fill in the details below to hire a vehicle to a client.' }}
                        </p>
                    </div>

                    <!-- Loading Spinner (Wakati wa kufetch data kwa ajili ya Edit) -->
                    <div v-if="fetching" class="d-flex justify-content-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;"></div>
                    </div>

                    <form v-else @submit.prevent="saveBooking">
                        <div class="row g-4">
                            
                            <!-- Client Dropdown -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Client *</label>
                                <select v-model="form.client_id" class="form-select form-select-lg" required>
                                    <option :value="null" disabled>-- Select Client --</option>
                                    <option v-for="client in clients" :key="client.id" :value="client.id">
                                        {{ client.full_name }} ({{ client.phone }})
                                    </option>
                                </select>
                            </div>

                            <!-- Vehicle Dropdown -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Vehicle *</label>
                                <select v-model="form.vehicle_id" class="form-select form-select-lg" required>
                                    <option :value="null" disabled>-- Select Vehicle --</option>
                                    <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                                        {{ vehicle.registration_number }} - {{ vehicle.car_model?.make }} {{ vehicle.car_model?.model }}
                                    </option>
                                </select>
                            </div>

                            <!-- Date of Hire -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Pickup Date *</label>
                                <input type="date" v-model="form.date_of_hire" class="form-control form-control-lg" required>
                            </div>

                            <!-- Date of Return -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Return Date *</label>
                                <input type="date" v-model="form.date_of_return" class="form-control form-control-lg" required>
                            </div>

                            <!-- Payment Method -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Payment Method *</label>
                                <select v-model="form.payment_method" class="form-select form-select-lg" required>
                                    <option value="Cash">Cash</option>
                                    <option value="M-Pesa">M-Pesa</option>
                                    <option value="Tigo Pesa">Tigo Pesa</option>
                                    <option value="Airtel Money">Airtel Money</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <!-- Booking Status -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Booking Status *</label>
                                <select v-model="form.booking_status" class="form-select form-select-lg" required>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                        </div>

                        <!-- Buttons -->
                        <div class="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                            <router-link to="/dashboard/bookings" class="btn btn-light border px-4">Cancel</router-link>
                            <button type="submit" class="btn btn-warning px-5 fw-bold text-white" style="background-color: #f38218; border: none;" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ loading ? 'Saving...' : (isEdit ? 'Update Booking' : 'Save Booking') }}
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

// Angalia kama kuna ID kwenye URL (Kama ipo, ni Edit. Kama haipo, ni Create)
const bookingId = route.params.id;
const isEdit = computed(() => !!bookingId);

useMeta({ title: computed(() => isEdit.value ? 'Edit Booking' : 'Create Booking') });

const clients = ref([]);
const vehicles = ref([]);
const loading = ref(false);
const fetching = ref(true); // Loading ya kuchukua data mwanzoni

const form = ref({
    client_id: null,
    vehicle_id: null,
    date_of_hire: '',
    date_of_return: '',
    payment_method: 'Cash',
    booking_status: 'pending'
});

// Pakia Wateja na Magari
const loadInitialData = async () => {
    try {
        const [clientsRes, vehiclesRes] = await Promise.all([
            axiosInstance.get('/clients'),
            axiosInstance.get('/vehicles')
        ]);
        clients.value = clientsRes.data.data || clientsRes.data;
        
        // Kama ni Edit, chukua magari yote. Kama ni Create, chukua yaliyopo tu.
        const allVehicles = vehiclesRes.data.data || vehiclesRes.data;
        vehicles.value = isEdit.value ? allVehicles : allVehicles.filter(v => v.status === 'available');
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('error', 'Error', 'Failed to load data.');
    }
};

// Kama ni Edit, pakia taarifa za Booking
const loadBooking = async () => {
    if (!isEdit.value) return;
    
    try {
        const response = await axiosInstance.get(`/vehicle-hires/${bookingId}`);
        const data = response.data.data || response.data;
        
        // Jaza fomu na data ya booking husika
        form.value = {
            client_id: data.client_name ? clients.value.find(c => c.full_name === data.client_name)?.id : null,
            vehicle_id: data.vehicle_details ? vehicles.value.find(v => data.vehicle_details.includes(v.registration_number))?.id : null,
            date_of_hire: data.pickup_date,
            date_of_return: data.return_date,
            payment_method: data.payment,
            booking_status: data.status
        };
    } catch (error) {
        console.error('Error loading booking:', error);
        showNotification('error', 'Error', 'Failed to load booking details.');
        router.push('/dashboard/bookings');
    }
};

const saveBooking = async () => {
    if (!form.value.client_id || !form.value.vehicle_id || !form.value.date_of_hire || !form.value.date_of_return) {
        showNotification('warning', 'Validation Error', 'Please fill in all required fields.');
        return;
    }

    loading.value = true;
    try {
        if (isEdit.value) {
            await axiosInstance.put(`/vehicle-hires/${bookingId}`, form.value);
            showNotification('success', 'Updated!', 'Booking updated successfully.');
        } else {
            await axiosInstance.post('/vehicle-hires', form.value);
            showNotification('success', 'Created!', 'Booking created successfully.');
        }
        router.push('/dashboard/bookings');
    } catch (error) {
        console.error('Error saving booking:', error);
        showNotification('error', 'Error', error.response?.data?.message || 'Failed to save booking.');
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await loadInitialData();
    await loadBooking();
    fetching.value = false;
});
</script>