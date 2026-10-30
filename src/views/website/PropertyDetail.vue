<template>
    <div class="property-detail-page bg-light-gray pb-5">
        
        <!-- Loading Skeleton -->
        <div v-if="loading" class="container py-5">
            <div class="skeleton-rect mb-4" style="height: 400px;"></div>
            <div class="row">
                <div class="col-lg-8">
                    <div class="skeleton-line mb-3" style="width: 50%; height: 30px;"></div>
                    <div class="skeleton-line mb-3" style="width: 30%;"></div>
                    <div class="skeleton-line" style="width: 100%; height: 150px;"></div>
                </div>
            </div>
        </div>

        <div v-else class="container py-5">
            
            <!-- Back Button & Breadcrumb -->
            <div class="d-flex align-items-center mb-4">
                <router-link to="/properties" class="btn btn-light border shadow-sm rounded-circle me-3" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-arrow-left text-dark"></i>
                </router-link>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item"><router-link to="/properties" class="text-decoration-none text-muted">Properties</router-link></li>
                        <li class="breadcrumb-item active" aria-current="page">{{ property.location }}</li>
                    </ol>
                </nav>
            </div>

            <div class="row g-4">
                <!-- Upande wa Kushoto: Picha na Maelezo -->
                <div class="col-lg-8">
                    
                    <!-- Picha Kubwa (Main Image) -->
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div class="position-relative" style="height: 500px; cursor: pointer;" @click="openLightbox(activeImage)">
                            <img :src="activeImage" class="w-100 h-100" style="object-fit: cover;" alt="Property Main Image">
                            <span class="badge position-absolute top-0 start-0 m-4 px-3 py-2 fs-6" 
                                  :class="isPlot ? 'bg-warning text-dark' : 'bg-success text-white'">
                                {{ isPlot ? 'PLOT / LAND' : 'APARTMENT' }}
                            </span>
                            <div class="position-absolute bottom-0 end-0 m-4 text-white bg-dark bg-opacity-50 rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                <i class="fas fa-expand"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Picha Nyingine (Thumbnails) -->
                    <div v-if="property.attachments && property.attachments.length > 1" class="d-flex gap-3 mb-5 overflow-auto pb-2">
                        <div v-for="(img, index) in property.attachments" :key="index" 
                             class="thumbnail-wrapper" @click="activeImage = getFullUrl(img)">
                            <img :src="getFullUrl(img)" class="rounded-3" 
                                 :class="{'border border-primary border-3': activeImage === getFullUrl(img)}"
                                 style="width: 120px; height: 80px; object-fit: cover; cursor: pointer;" alt="Thumbnail">
                        </div>
                    </div>

                    <!-- Maelezo ya Mali -->
                    <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4">
                        <div class="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h2 class="fw-bold text-dark mb-2">{{ property.location }}</h2>
                                <h3 class="fw-bold mb-0" style="color: #0b57a4;">{{ formatMoney(property.price) }}</h3>
                            </div>
                            <span class="badge bg-light text-dark border fs-6 py-2 px-3 text-uppercase">
                                For {{ property.listing_type }}
                            </span>
                        </div>

                        <div class="row g-3 mb-5">
                            <div class="col-md-4">
                                <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                    <i class="fas fa-expand-arrows-alt fs-3 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-0">Size</h6>
                                        <span class="text-muted small">{{ property.size || 'N/A' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                    <i class="fas fa-file-signature fs-3 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-0">Ownership</h6>
                                        <span class="text-muted small">{{ property.ownership_type }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="d-flex align-items-center p-3 bg-light rounded-3">
                                    <i class="fas fa-check-circle fs-3 me-3" style="color: #198754;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-0">Status</h6>
                                        <span class="text-muted small text-capitalize">{{ property.listing_status }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h4 class="fw-bold text-dark mb-3 border-bottom pb-2">Description</h4>
                        <p class="text-muted" style="line-height: 1.8; font-size: 1.05rem;">
                            {{ property.description || 'No detailed description available for this property. Please contact us for more information.' }}
                        </p>
                    </div>

                </div>

                <!-- Upande wa Kulia: Fomu ya Kuuliza (Inquiry) -->
                <div class="col-lg-4">
                    <div class="card border-0 shadow-lg rounded-4 p-4 sticky-top" style="top: 100px;">
                        <h4 class="fw-bold mb-3">Interested in this property?</h4>
                        <p class="text-muted small mb-4">Fill in your details and our team will get back to you shortly.</p>
                        
                        <!-- Fomu -->
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Full Name *</label>
                            <input type="text" v-model="inquiryForm.name" class="form-control bg-light" placeholder="e.g., Juma Ahmed" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Phone Number *</label>
                            <input type="text" v-model="inquiryForm.phone" class="form-control bg-light" placeholder="e.g., +255 754 000 000" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Email Address *</label>
                            <input type="email" v-model="inquiryForm.email" class="form-control bg-light" placeholder="e.g., juma@gmail.com" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-bold small text-muted">Message</label>
                            <textarea v-model="inquiryForm.message" class="form-control bg-light" rows="3" placeholder="I'm interested in this property..."></textarea>
                        </div>
                        
                        <!-- Vitufe viwili vya Kutuma -->
                        <div class="d-flex flex-column gap-2">
                            <!-- Kitufe cha WhatsApp -->
                            <button @click="sendWhatsApp" class="btn btn-success w-100 py-3 fw-bold text-white" :disabled="!isFormValid">
                                <i class="fab fa-whatsapp me-2"></i> Send via WhatsApp
                            </button>
                            
                            <!-- Kitufe cha Email -->
                            <button @click="sendEmail" class="btn btn-primary w-100 py-3 fw-bold text-white" :disabled="!isFormValid">
                                <i class="fas fa-envelope me-2"></i> Send via Email
                            </button>
                        </div>
                        
                        <div v-if="submitted" class="alert alert-success mt-4 border-0 small">
                            <i class="fas fa-check-circle me-2"></i> Thank you! Your inquiry has been sent successfully.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal ya Fullscreen (Lightbox) -->
        <div class="modal fade" id="lightboxModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content bg-dark">
                    <div class="modal-header border-0">
                        <h5 class="modal-title text-white">Property Image</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body d-flex align-items-center justify-content-center p-0">
                        <img :src="lightboxImage" class="img-fluid" style="max-height: 85vh; max-width: 100%; object-fit: contain;" alt="Fullscreen Image">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosInstance } from '@/services/axios';
import { BASE_URL } from '@/config/config'; // TUMIA BASE_URL

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const submitted = ref(false);
const property = ref({});
const activeImage = ref('');
const lightboxImage = ref('');
let lightboxModal = null;

// Namba ya simu ya kampuni (Badilisha hii na yako)
const COMPANY_WHATSAPP = '255754366104';
const COMPANY_EMAIL = 'info@tripointlimited.co.tz';

const inquiryForm = ref({
    name: '',
    phone: '',
    email: '',
    message: ''
});

const type = route.params.type;
const id = route.params.id;
const isPlot = computed(() => type === 'plot');

// Angalia kama fomu imejazwa vizuri
const isFormValid = computed(() => {
    return inquiryForm.value.name && inquiryForm.value.phone && inquiryForm.value.email;
});

const formatMoney = (value) => {
    if (!value) return 'TZS 0';
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(value);
};

const getFullUrl = (attachment) => {
    if (!attachment) return '';
    if (attachment.url) return attachment.url;
    if (attachment.file_path) {
        const storageBase = BASE_URL.replace('/api', '');
        return `${storageBase}/storage/${attachment.file_path}`;
    }
    return '';
};

const fetchProperty = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get(`/public-properties/${type}/${id}`);
        property.value = response.data.data || response.data;

        if (property.value.attachments && property.value.attachments.length > 0) {
            activeImage.value = getFullUrl(property.value.attachments[0]);
        } else {
            activeImage.value = isPlot.value 
                ? 'https://via.placeholder.com/800x500?text=Land+Plot' 
                : 'https://via.placeholder.com/800x500?text=Apartment';
        }
    } catch (error) {
        console.error('Error fetching property details:', error);
        router.push('/properties');
    } finally {
        loading.value = false;
    }
};

const openLightbox = (url) => {
    lightboxImage.value = url;
    lightboxModal.show();
};

// =========================================
// KUTUMA KWA WHATSAPP
// =========================================
const sendWhatsApp = () => {
    if (!isFormValid.value) return;

    // Tengeneza ujumbe wenye maelezo yote
    const message = `Habari TRIPOINT,%0A%0A*Nina nia ya mali hii:*%0A%0A*Location:* ${property.value.location}%0A*Price:* ${formatMoney(property.value.price)}%0A*Aina:* ${isPlot.value ? 'Plot / Land' : 'Apartment'}%0A%0A*Taarifa Zangu:*%0A*Jina:* ${inquiryForm.value.name}%0A*Simu:* ${inquiryForm.value.phone}%0A*Email:* ${inquiryForm.value.email}%0A%0A*Ujumbe:* ${inquiryForm.value.message || 'Nahitaji maelezo zaidi kuhusu mali hii.'}`;
    
    // Fungua WhatsApp
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${message}`, '_blank');
    
    // Onyesha ujumbe wa mafanikio
    submitted.value = true;
    setTimeout(() => { submitted.value = false; }, 5000);
};

// =========================================
// KUTUMA KWA EMAIL
// =========================================
const sendEmail = () => {
    if (!isFormValid.value) return;

    const subject = `Inquiry: ${property.value.location} (${isPlot.value ? 'Plot' : 'Apartment'})`;
    const body = `Habari TRIPOINT,%0A%0ANina nia ya mali hii:%0A%0ALocation: ${property.value.location}%0APrice: ${formatMoney(property.value.price)}%0AAina: ${isPlot.value ? 'Plot / Land' : 'Apartment'}%0A%0ATaarifa Zangu:%0AJina: ${inquiryForm.value.name}%0ASimu: ${inquiryForm.value.phone}%0AEmail: ${inquiryForm.value.email}%0A%0AUjumbe: ${inquiryForm.value.message || 'Nahitaji maelezo zaidi kuhusu mali hii.'}`;
    
    // Fungua Email App
    window.location.href = `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    submitted.value = true;
    setTimeout(() => { submitted.value = false; }, 5000);
};

onMounted(() => {
    fetchProperty();
    lightboxModal = new window.bootstrap.Modal(document.getElementById('lightboxModal'));
});
</script>

<style scoped>
.bg-light-gray {
    background-color: #f8f9fa;
}
.thumbnail-wrapper {
    transition: transform 0.2s ease;
}
.thumbnail-wrapper:hover {
    transform: scale(1.05);
}
.skeleton-rect, .skeleton-line {
    background-color: #e2e8f0;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}
.skeleton-rect::after, .skeleton-line::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
    100% { left: 100%; }
}
</style>