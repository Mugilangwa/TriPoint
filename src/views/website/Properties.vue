<template>
    <div class="properties-page bg-light-gray pb-5">
        
        <!-- Page Header -->
        <header class="py-5 text-center text-white" style="background: linear-gradient(135deg, rgba(13, 27, 42, 0.9), rgba(11, 87, 164, 0.8)), url('@/assets/images/images/img15.jpeg') center/cover; min-height: 250px; display: flex; align-items: center;">
            <div class="container">
                <h1 class="display-4 fw-bold mb-2">Our Properties</h1>
                <p class="lead mb-0 text-warning">Find your dream home or prime land in Tanzania.</p>
            </div>
        </header>

        <div class="container py-5">
            
            <!-- SEARCH & FILTERS -->
            <div class="card border-0 shadow-sm rounded-4 p-4 mb-5">
                <div class="row g-3">
                    <!-- Search Input -->
                    <div class="col-lg-4">
                        <label class="form-label fw-bold small text-muted">Search Location</label>
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" v-model="searchQuery" class="form-control border-start-0" placeholder="e.g., Mikocheni, Kigamboni...">
                        </div>
                    </div>

                    <!-- Property Type Filter -->
                    <div class="col-lg-2 col-md-4">
                        <label class="form-label fw-bold small text-muted">Type</label>
                        <select v-model="filterType" class="form-select">
                            <option value="all">All Types</option>
                            <option value="plot">Plots / Land</option>
                            <option value="apartment">Apartments</option>
                        </select>
                    </div>

                    <!-- Listing Type Filter -->
                    <div class="col-lg-2 col-md-4">
                        <label class="form-label fw-bold small text-muted">Listing</label>
                        <select v-model="filterListing" class="form-select">
                            <option value="all">Any</option>
                            <option value="sale">For Sale</option>
                            <option value="rent">For Rent</option>
                        </select>
                    </div>

                    <!-- Price Range Filter -->
                    <div class="col-lg-4">
                        <label class="form-label fw-bold small text-muted">Price Range (TZS)</label>
                        <div class="d-flex gap-2">
                            <input type="number" v-model="minPrice" class="form-control" placeholder="Min">
                            <input type="number" v-model="maxPrice" class="form-control" placeholder="Max">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading Skeleton -->
            <div v-if="loading" class="row g-4">
                <div v-for="i in 6" :key="i" class="col-md-6 col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                        <div class="skeleton-rect" style="height: 220px;"></div>
                        <div class="card-body p-4">
                            <div class="skeleton-line mb-3" style="width: 70%;"></div>
                            <div class="skeleton-line mb-3" style="width: 40%;"></div>
                            <div class="skeleton-line" style="width: 100%; height: 40px;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Results -->
            <div v-else-if="filteredProperties.length === 0" class="text-center py-5">
                <i class="fas fa-search-minus text-muted display-1 mb-3"></i>
                <h4 class="fw-bold text-dark">No properties found</h4>
                <p class="text-muted">Try adjusting your search or filters.</p>
                <button class="btn btn-outline-primary mt-3" @click="resetFilters">Clear Filters</button>
            </div>

            <!-- Properties Grid -->
            <div v-else>
                <div class="row g-4">
                    <div v-for="property in paginatedProperties" :key="getPropertyId(property)" class="col-md-6 col-lg-4">
                        <div class="card property-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                            
                            <!-- Picha na Badge -->
                            <div class="position-relative" style="height: 240px;">
                                <img :src="getPropertyImage(property)" class="w-100 h-100" style="object-fit: cover;" alt="Property Image">
                                
                                <!-- Badge ya Aina (Plot au Apartment) -->
                                <span class="badge position-absolute top-0 end-0 m-3 px-3 py-2" 
                                      :class="isPlot(property) ? 'bg-warning text-dark' : 'bg-success text-white'">
                                    {{ isPlot(property) ? 'PLOT / LAND' : 'APARTMENT' }}
                                </span>
                                
                                <!-- Badge ya Listing Type (For Sale / Rent) -->
                                <span class="badge bg-dark bg-opacity-75 position-absolute bottom-0 start-0 m-3 px-3 py-2 text-uppercase">
                                    For {{ property.listing_type }}
                                </span>
                            </div>

                            <!-- Maelezo ya Mali -->
                            <div class="card-body p-4 d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="fw-bold text-dark mb-0 text-truncate">{{ property.location }}</h5>
                                </div>
                                
                                <h4 class="fw-bold mb-3" style="color: #0b57a4;">
                                    {{ formatMoney(property.price) }}
                                </h4>
                                
                                <div class="d-flex gap-3 text-muted small mb-4">
                                    <span v-if="isPlot(property)"><i class="fas fa-expand-arrows-alt me-1"></i> {{ property.size }}</span>
                                    <span><i class="fas fa-file-signature me-1"></i> {{ property.ownership_type }}</span>
                                </div>

                                <!-- Kitufe cha Kuona Zaidi -->
                                <router-link :to="`/properties/${isPlot(property) ? 'plot' : 'apartment'}/${getPropertyId(property)}`" class="btn btn-outline-primary mt-auto w-100 fw-bold py-2">
                                    View Details <i class="fas fa-arrow-right ms-2"></i>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PAGINATION -->
                <div class="d-flex justify-content-between align-items-center mt-5">
                    <div class="text-muted small">
                        Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, filteredProperties.length) }} of {{ filteredProperties.length }} properties
                    </div>
                    <nav>
                        <ul class="pagination mb-0">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="currentPage--">Previous</button>
                            </li>
                            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                                <button class="page-link" @click="currentPage = page">{{ page }}</button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button class="page-link" @click="currentPage++">Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { axiosInstance } from '@/services/axios';
import { BASE_URL } from '@/config/config'; // <--- TUNAIMPORT BASE_URL HAPA

const loading = ref(true);
const properties = ref([]);
const searchQuery = ref('');
const filterType = ref('all');
const filterListing = ref('all');
const minPrice = ref('');
const maxPrice = ref('');

const currentPage = ref(1);
const perPage = ref(6);

const fetchProperties = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/public-properties');
        properties.value = response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching properties:', error);
    } finally {
        loading.value = false;
    }
};

const filteredProperties = computed(() => {
    return properties.value.filter(property => {
        if (filterType.value !== 'all') {
            if (filterType.value === 'plot' && !isPlot(property)) return false;
            if (filterType.value === 'apartment' && isPlot(property)) return false;
        }

        if (filterListing.value !== 'all') {
            if (property.listing_type !== filterListing.value) return false;
        }

        const price = parseFloat(property.price);
        if (minPrice.value && price < parseFloat(minPrice.value)) return false;
        if (maxPrice.value && price > parseFloat(maxPrice.value)) return false;

        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            const location = property.location ? property.location.toLowerCase() : '';
            if (!location.includes(query)) return false;
        }

        return true;
    });
});

const totalPages = computed(() => Math.ceil(filteredProperties.value.length / perPage.value));
const paginatedProperties = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredProperties.value.slice(start, end);
});

watch([searchQuery, filterType, filterListing, minPrice, maxPrice], () => {
    currentPage.value = 1;
});

const isPlot = (property) => {
    return property.plot_id !== undefined || (property.size !== undefined && property.size !== null);
};

const getPropertyId = (property) => {
    return isPlot(property) ? property.plot_id : property.apartment_id;
};

// HAPA NDIPO TUNABADILISHA: Tunatumia BASE_URL kutengeneza njia ya picha
const getPropertyImage = (property) => {
    if (property.attachments && property.attachments.length > 0) {
        const attachment = property.attachments[0];
        
        // 1. Kama kuna url (kutoka backend) itumie
        if (attachment.url) return attachment.url;

        // 2. Kama hakuna url, tengeneza mwenyewe kutoka file_path kwa kutumia BASE_URL
        if (attachment.file_path) {
            // Ondoa "/api" kwenye BASE_URL kwa sababu picha ziko kwenye storage
            const storageBase = BASE_URL.replace('/api', '');
            return `${storageBase}/storage/${attachment.file_path}`;
        }
    }
    return isPlot(property) 
        ? 'https://via.placeholder.com/400x300?text=Land+Plot' 
        : 'https://via.placeholder.com/400x300?text=Apartment';
};

const formatMoney = (value) => {
    if (!value) return 'TZS 0';
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(value);
};

const resetFilters = () => {
    searchQuery.value = '';
    filterType.value = 'all';
    filterListing.value = 'all';
    minPrice.value = '';
    maxPrice.value = '';
    currentPage.value = 1;
};

onMounted(() => {
    fetchProperties();
});
</script>

<style scoped>
.bg-light-gray {
    background-color: #f8f9fa;
}
.property-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.property-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
}
.skeleton-rect, .skeleton-line {
    background-color: #e2e8f0;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
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
.pagination .page-link {
    color: #0b57a4;
    border: 1px solid #e2e8f0;
    margin: 0 3px;
    border-radius: 8px;
    cursor: pointer;
}
.pagination .page-item.active .page-link {
    background-color: #0b57a4;
    border-color: #0b57a4;
    color: white;
}
.pagination .page-item.disabled .page-link {
    color: #adb5bd;
    cursor: not-allowed;
}
</style>