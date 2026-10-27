<template>
    <div>
        <!-- =========================================
             HERO SECTION (Picha na Maneno Yanabadilika)
             ========================================= -->
        <header class="position-relative p-0" style="min-height: 650px; overflow: hidden;">
            <!-- Carousel ya Picha -->
            <div id="heroCarousel" class="carousel slide carousel-fade position-absolute w-100 h-100" data-bs-ride="carousel" data-bs-interval="4000" data-bs-pause="false" data-bs-touch="true" style="top: 0; left: 0; z-index: 0;">
                <div class="carousel-inner h-100">
                    <div class="carousel-item active h-100">
                        <img src="@/assets/images/images/img18.jpeg" class="d-block w-100 h-100" style="object-fit: cover;" alt="Logistics">
                    </div>
                    <div class="carousel-item h-100">
                        <img src="@/assets/images/images/img15.jpeg" class="d-block w-100 h-100" style="object-fit: cover;" alt="Real Estate">
                    </div>
                    <div class="carousel-item h-100">
                        <img src="@/assets/images/images/img20.jpeg" class="d-block w-100 h-100" style="object-fit: cover;" alt="Fleet">
                    </div>
                </div>
            </div>

            <!-- Overlay ya Bluu -->
            <div class="position-absolute w-100 h-100" style="background: linear-gradient(90deg, rgba(11, 87, 164, 0.95) 0%, rgba(11, 87, 164, 0.6) 100%); top: 0; left: 0; z-index: 1;"></div>

            <!-- Maandishi -->
            <div class="container position-relative d-flex align-items-center" style="z-index: 2; min-height: 650px;">
                <div class="row">
                    <div class="col-lg-9 col-md-11">
                        <h1 class="display-3 fw-bold text-white mb-2 lh-sm">
                            TRIPOINT <br>
                            <!-- Vue Transition kwa ajili ya Fade Effect -->
                            <Transition name="fade" mode="out-in">
                                <span :key="currentIndex" :class="currentColorClass" style="font-weight: 800; display: inline-block; min-height: 80px;">
                                    {{ words[currentIndex] }}
                                </span>
                            </Transition>
                        </h1>
                        
                        <!-- Paragrafu Fupi yenye Nguvu -->
                        <p class="text-light mb-4 fs-5 mt-3" style="max-width: 650px; font-weight: 400; line-height: 1.6;">
                            Your ultimate partner for <strong>Premium Car Rentals</strong>, <strong>Logistics Solutions</strong>, and <strong>Verified Real Estate</strong>. We serve UN agencies, NGOs, and corporate clients with unmatched reliability across Tanzania.
                        </p>
                        
                        <div class="d-flex gap-3 flex-wrap mt-4">
                            <router-link to="/cars" class="btn btn-warning px-4 py-3 fw-bold text-white rounded-1" style="background-color: #f38218; border: none; letter-spacing: 0.5px;">Explore Fleet</router-link>
                            <router-link to="/properties" class="btn btn-outline-light px-4 py-3 fw-bold rounded-1" style="letter-spacing: 0.5px;">View Properties</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Features Bar -->
        <div class="py-3" style="background-color: #0b57a4; border-bottom: 3px solid #f38218;">
            <div class="container">
                <div class="row text-center text-white fw-bold small">
                    <div class="col-6 col-md-3 mb-2 mb-md-0 border-end border-white border-opacity-25"><i class="fas fa-truck me-2"></i> Logistics & Fleet</div>
                    <div class="col-6 col-md-3 mb-2 mb-md-0 border-end border-white border-opacity-25"><i class="fas fa-building me-2"></i> Real Estate</div>
                    <div class="col-6 col-md-3 mb-2 mb-md-0 border-end border-white border-opacity-25"><i class="fas fa-globe me-2"></i> International Missions</div>
                    <div class="col-6 col-md-3"><i class="fas fa-calendar-alt me-2"></i> National Events</div>
                </div>
            </div>
        </div>

        <!-- =========================================
             ABOUT BRIEF SECTION
             ========================================= -->
        <section class="py-5 bg-white text-center">
            <div class="container">
                <h2 class="fw-bold mb-3 text-dark">Trusted Partner in Dar es Salaam</h2>
                <p class="text-muted mx-auto" style="max-width: 850px; font-size: 1.05rem;">
                    TRIPOINT LIMITED is your one-stop partner for Logistics & Fleet Solutions and Real Estate. We specialize in supporting UN agencies, NGOs, Embassies, and corporate clients with reliable transport and verified properties.
                </p>
            </div>
        </section>

        <!-- =========================================
             WHAT WE OFFER (Logistics & Real Estate Columns)
             ========================================= -->
        <section class="py-5" style="background-color: #f8f9fa;">
            <div class="container">
                <div class="row g-4 align-items-stretch"> 
                    
                    <!-- Logistics & Fleet Solutions -->
                    <div class="col-lg-6 mb-4 mb-lg-0">
                        <div class="card h-100 border-0 shadow-sm p-4 rounded-4">
                            <div class="d-flex align-items-center mb-4">
                                <i class="fas fa-truck-moving fs-1 me-3" style="color: #0b57a4;"></i>
                                <h2 class="fw-bold text-dark mb-0" style="font-size: 1.8rem;">LOGISTICS & FLEET</h2>
                            </div>
                            
                            <ul class="list-unstyled flex-grow-1">
                                <li class="mb-3 d-flex">
                                    <i class="fas fa-check-circle mt-1 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-1">4x4 Landcruisers</h6>
                                        <p class="text-muted small mb-0">Rugged, reliable for field missions.</p>
                                    </div>
                                </li>
                                <li class="mb-3 d-flex">
                                    <i class="fas fa-check-circle mt-1 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-1">Prado & Hilux</h6>
                                        <p class="text-muted small mb-0">For field missions and heavy duty.</p>
                                    </div>
                                </li>
                                <li class="mb-3 d-flex">
                                    <i class="fas fa-check-circle mt-1 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-1">Executive SUVs</h6>
                                        <p class="text-muted small mb-0">Comfortable, professional transport.</p>
                                    </div>
                                </li>
                                <li class="mb-3 d-flex">
                                    <i class="fas fa-check-circle mt-1 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-1">Coaster & Hiace</h6>
                                        <p class="text-muted small mb-0">Staff transport & group travel.</p>
                                    </div>
                                </li>
                            </ul>
                            
                            <div class="mt-auto">
                                <img src="@/assets/images/images/img20.jpeg" class="img-fluid rounded w-100 shadow-sm" style="height: 250px; object-fit: cover;" alt="Fleet">
                            </div>
                        </div>
                    </div>

                    <!-- Real Estate -->
                    <div class="col-lg-6">
                        <div class="card h-100 border-0 shadow-sm p-4 rounded-4">
                            <div class="d-flex align-items-center mb-4">
                                <i class="fas fa-city fs-1 me-3" style="color: #0b57a4;"></i>
                                <h2 class="fw-bold text-dark mb-0" style="font-size: 1.8rem;">REAL ESTATE</h2>
                            </div>
                            
                            <ul class="list-unstyled flex-grow-1">
                                <li class="mb-3 d-flex">
                                    <i class="fas fa-check-circle mt-1 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-1">Furnished Houses</h6>
                                        <p class="text-muted small mb-0">Comfortable, secure, fully furnished homes.</p>
                                    </div>
                                </li>
                                <li class="mb-3 d-flex">
                                    <i class="fas fa-check-circle mt-1 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-1">Apartments for Expatriates</h6>
                                        <p class="text-muted small mb-0">Modern apartments near embassies & business hubs.</p>
                                    </div>
                                </li>
                                <li class="mb-3 d-flex">
                                    <i class="fas fa-check-circle mt-1 me-3" style="color: #f38218;"></i>
                                    <div>
                                        <h6 class="fw-bold mb-1">Offices for Expatriates</h6>
                                        <p class="text-muted small mb-0">Serviced offices & workspaces available.</p>
                                    </div>
                                </li>
                            </ul>
                            
                            <div class="mt-auto">
                                <img src="@/assets/images/images/img15.jpeg" class="img-fluid rounded w-100 shadow-sm" style="height: 250px; object-fit: cover;" alt="Real Estate">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- =========================================
             WHY TRIPOINT? (Rows Layout)
             ========================================= -->
        <section class="py-5 bg-white">
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="fw-bold text-dark">WHY TRIPOINT?</h2>
                    <p class="text-muted">We go the extra mile to ensure your mission succeeds.</p>
                </div>
                
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    <div class="col">
                        <div class="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
                            <div class="card-body">
                                <div class="mx-auto mb-3" style="width: 60px; height: 60px; background: rgba(11, 87, 164, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-headset fs-3" style="color: #0b57a4;"></i>
                                </div>
                                <h5 class="fw-bold text-dark mb-2">One Contact</h5>
                                <h6 class="text-warning mb-2">Zero Stress</h6>
                                <p class="text-muted small mb-0">Single point of contact for all your needs. We handle the complexities with transparent pricing.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
                            <div class="card-body">
                                <div class="mx-auto mb-3" style="width: 60px; height: 60px; background: rgba(11, 87, 164, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-globe-africa fs-3" style="color: #0b57a4;"></i>
                                </div>
                                <h5 class="fw-bold text-dark mb-2">NGO & UN</h5>
                                <h6 class="text-warning mb-2">Mission Ready</h6>
                                <p class="text-muted small mb-0">Extensive experience working with UN agencies, NGOs, and diplomatic missions.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
                            <div class="card-body">
                                <div class="mx-auto mb-3" style="width: 60px; height: 60px; background: rgba(11, 87, 164, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-user-shield fs-3" style="color: #0b57a4;"></i>
                                </div>
                                <h5 class="fw-bold text-dark mb-2">Vetted</h5>
                                <h6 class="text-warning mb-2">Drivers</h6>
                                <p class="text-muted small mb-0">Professional, trained, and security-conscious drivers for your safety on all terrains.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
                            <div class="card-body">
                                <div class="mx-auto mb-3" style="width: 60px; height: 60px; background: rgba(11, 87, 164, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-tools fs-3" style="color: #0b57a4;"></i>
                                </div>
                                <h5 class="fw-bold text-dark mb-2">24/7</h5>
                                <h6 class="text-warning mb-2">Replacement Guarantee</h6>
                                <p class="text-muted small mb-0">Immediate vehicle replacement and dedicated support in the event of a breakdown.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================
             OTHER DIVERSIFIED SERVICES
             ========================================= -->
        <section class="py-5" style="background-color: #f8f9fa;">
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="fw-bold text-dark">OTHER DIVERSIFIED SERVICES</h2>
                    <p class="text-muted">Beyond fleet and real estate, we offer a wide range of support services.</p>
                </div>
                
                <div class="row g-3 justify-content-center">
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100 border-0 shadow-sm service-card rounded-3 border-bottom border-warning border-3">
                            <div class="card-body p-4 text-center">
                                <div class="icon-box mx-auto mb-3 text-warning fs-4"><i class="fas fa-box-open"></i></div>
                                <h5 class="fw-bold text-dark mb-2">Cargo & Logistics</h5>
                                <p class="text-muted small mb-0">Efficient cargo and logistics services to transport your goods safely and on time.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100 border-0 shadow-sm service-card rounded-3 border-bottom border-warning border-3">
                            <div class="card-body p-4 text-center">
                                <div class="icon-box mx-auto mb-3 text-warning fs-4"><i class="fas fa-gas-pump"></i></div>
                                <h5 class="fw-bold text-dark mb-2">Fuel Transport</h5>
                                <p class="text-muted small mb-0">Safe and compliant fuel transportation services across Tanzania.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100 border-0 shadow-sm service-card rounded-3 border-bottom border-warning border-3">
                            <div class="card-body p-4 text-center">
                                <div class="icon-box mx-auto mb-3 text-warning fs-4"><i class="fas fa-truck-moving"></i></div>
                                <h5 class="fw-bold text-dark mb-2">Fleet Hire & Transport</h5>
                                <p class="text-muted small mb-0">Flexible fleet hire solutions for corporate and personal transit needs.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100 border-0 shadow-sm service-card rounded-3 border-bottom border-warning border-3">
                            <div class="card-body p-4 text-center">
                                <div class="icon-box mx-auto mb-3 text-warning fs-4"><i class="fas fa-headset"></i></div>
                                <h5 class="fw-bold text-dark mb-2">24/7 Support</h5>
                                <p class="text-muted small mb-0">Dedicated customer support available around the clock to assist you.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================
             STATS SECTION
             ========================================= -->
        <section class="py-4 text-white" style="background-color: #0b57a4;">
            <div class="container">
                <div class="row text-center">
                    <div class="col-6 col-md-3 mb-3 mb-md-0">
                        <h2 class="fw-bold display-6 text-white mb-1">500+</h2>
                        <p class="mb-0 small text-light">Missions Supported</p>
                    </div>
                    <div class="col-6 col-md-3 mb-3 mb-md-0">
                        <h2 class="fw-bold display-6 text-white mb-1">50+</h2>
                        <p class="mb-0 small text-light">Premium Vehicles</p>
                    </div>
                    <div class="col-6 col-md-3 mb-3 mb-md-0">
                        <h2 class="fw-bold display-6 text-white mb-1">100+</h2>
                        <p class="mb-0 small text-light">Properties Listed</p>
                    </div>
                    <div class="col-6 col-md-3">
                        <h2 class="fw-bold display-6 text-white mb-1">24/7</h2>
                        <p class="mb-0 small text-light">Support Available</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================
             SECTORS WE SERVE
             ========================================= -->
        <section class="py-5 text-center" style="background-color: #f38218; color: white;">
            <div class="container">
                <h2 class="fw-bold mb-3">International Missions and National Events</h2>
                <p class="mb-4">We support UN, NGOs, Embassies, Government Projects, and Conferences across Tanzania.</p>
                
                <div class="d-flex justify-content-center flex-wrap gap-4 mt-4 fw-bold fs-5">
                    <div class="d-flex flex-column align-items-center">
                        <i class="fas fa-globe fs-1 mb-2"></i>
                        <span>UN & NGOs</span>
                    </div>
                    <div class="d-flex flex-column align-items-center">
                        <i class="fas fa-handshake fs-1 mb-2"></i>
                        <span>Embassies</span>
                    </div>
                    <div class="d-flex flex-column align-items-center">
                        <i class="fas fa-landmark fs-1 mb-2"></i>
                        <span>Government</span>
                    </div>
                    <div class="d-flex flex-column align-items-center">
                        <i class="fas fa-users fs-1 mb-2"></i>
                        <span>Conferences</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// =========================================
// Logic ya Maneno Yanayobadilika (Fade Effect)
// =========================================

// Maneno yenye nguvu zaidi
const words = [
    "Prime Real Estate & Properties", 
    "Heavy Duty Logistics & Fleet", 
    "Premium Car Rental Services"
];

// Rangi zitakazobadilika
const colors = [
    "text-warning",     // Chungwa
    "text-orange",        // Bluu wazi
    "text-warning"      // Kijani
];

const currentIndex = ref(0);
const currentColorClass = ref(colors[0]);
let interval = null;

onMounted(() => {
    // Kila baada ya sekunde 3.5 (3500ms), badilisha neno
    interval = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % words.length;
        currentColorClass.value = colors[currentIndex.value];
    }, 3500); 
});

onUnmounted(() => {
    clearInterval(interval);
});
</script>

<style scoped>
/* Efekti ya kufifia (Fade) inapobadilisha maneno */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px); /* Inatokea ikiwa imeshuka chini kidogo */
}
</style>