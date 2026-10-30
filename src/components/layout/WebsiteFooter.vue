<template>
    <footer class="footer pt-5 pb-4 text-light" style="background-color: #0d1b2a;">
        <div class="container">
            <div class="row g-4 mb-4">
                <!-- Col 1: Brand & About -->
                <div class="col-lg-4 col-md-6">
                    <div class="footer-brand mb-3">
                        <div class="bg-white p-2 rounded d-inline-block">
                            <img src="@/assets/images/logo/img.png" alt="Tripoint Logo" style="height: 40px; object-fit: contain;">
                        </div>
                    </div>
                    <p class="small text-slate-300 mb-4" style="line-height: 1.8; color: #CBD5E1;">
                        TRIPOINT LIMITED is a Tanzanian-registered diversified service provider headquartered in Dar es Salaam. We specialize in premium Car Rental and Real Estate solutions, alongside reliable logistics services.
                    </p>
                    <div class="social-icons d-flex gap-2">
                        <a href="#" class="btn btn-outline-light rounded-circle p-2"><i class="fab fa-facebook-f fa-sm"></i></a>
                        <a href="#" class="btn btn-outline-light rounded-circle p-2"><i class="fab fa-twitter fa-sm"></i></a>
                        <a href="#" class="btn btn-outline-light rounded-circle p-2"><i class="fab fa-instagram fa-sm"></i></a>
                        <a href="#" class="btn btn-outline-light rounded-circle p-2"><i class="fab fa-linkedin-in fa-sm"></i></a>
                    </div>
                </div>

                <!-- Col 2: Quick Links -->
                <div class="col-lg-2 col-md-6">
                    <h6 class="fw-bold text-white mb-4">Quick Links</h6>
                    <ul class="list-unstyled small">
                        <li class="mb-3"><router-link to="/" class="text-decoration-none text-slate-300" style="color: #94A3B8;">Home</router-link></li>
                        <li class="mb-3"><router-link to="/about" class="text-decoration-none text-slate-300" style="color: #94A3B8;">About Us</router-link></li>
                        <li class="mb-3"><router-link to="/mission" class="text-decoration-none text-slate-300" style="color: #94A3B8;">Mission & Vision</router-link></li>
                        <li class="mb-3"><router-link to="/contact" class="text-decoration-none text-slate-300" style="color: #94A3B8;">Contact Us</router-link></li>
                    </ul>
                </div>

                <!-- Col 3: Our Services -->
                <div class="col-lg-3 col-md-6">
                    <h6 class="fw-bold text-white mb-4">Our Services</h6>
                    <ul class="list-unstyled small">
                        <li class="mb-3"><router-link to="/properties" class="text-decoration-none" style="color: #94A3B8;">Car Rental</router-link></li>
                        <li class="mb-3"><router-link to="/properties" class="text-decoration-none" style="color: #94A3B8;">Land & Plots</router-link></li>
                        <li class="mb-3"><router-link to="/properties" class="text-decoration-none" style="color: #94A3B8;">Houses for Sale</router-link></li>
                        <li class="mb-3"><router-link to="/properties" class="text-decoration-none" style="color: #94A3B8;">Houses for Rent</router-link></li>
                    </ul>
                </div>

                <!-- Col 4: Contact Info -->
                <div class="col-lg-3 col-md-6">
                    <h6 class="fw-bold text-white mb-4">Contact Info</h6>
                    <ul class="list-unstyled small" style="color: #CBD5E1;">
                        <li class="mb-3 d-flex">
                            <i class="fas fa-map-marker-alt me-3 mt-1" style="color: #f38218;"></i>
                            <span>Dar es Salaam,<br>Tanzania</span>
                        </li>
                        <li class="mb-3 d-flex">
                            <i class="fas fa-envelope me-3 mt-1" style="color: #f38218;"></i>
                            <a href="mailto:info@tripointlimited.co.tz" class="text-decoration-none" style="color: #94A3B8;">info@tripointlimited.co.tz</a>
                        </li>
                        <li class="mb-4 d-flex">
                            <i class="fas fa-phone-alt me-3 mt-1" style="color: #f38218;"></i>
                            <a href="tel:+255754366104" class="text-decoration-none" style="color: #94A3B8;">+255 754 366 104</a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="border-top border-secondary border-opacity-25 pt-4 mt-2">
                <div class="row align-items-center">
                    <!-- Copyright -->
                    <div class="col-md-5 text-center text-md-start mb-2 mb-md-0">
                        <p class="small mb-0" style="color: #94A3B8;">&copy; 2026 TRIPOINT COMPANY LIMITED. All Rights Reserved.</p>
                    </div>
                    
                    <!-- Policies & Login Button -->
                    <div class="col-md-7 text-center text-md-end d-flex justify-content-center justify-content-md-end align-items-center gap-3">
                        <a href="#" class="text-decoration-none small" style="color: #94A3B8;">Privacy Policy</a>
                        <a href="#" class="text-decoration-none small" style="color: #94A3B8;">Terms of Service</a>
                        
                        <!-- KITUFE CHA LOGIN KWA INTERNAL USERS -->
                        <router-link to="/login" class="btn btn-sm btn-outline-warning fw-bold ms-2" style="color: #f38218; border-color: #f38218;">
                            <i class="fas fa-sign-in-alt me-1"></i> Staff Login
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>