<template>
    <div>
        <header class="py-5 text-center" style="background: linear-gradient(135deg, rgba(13, 27, 42, 0.9), rgba(11, 87, 164, 0.8)), url('@/assets/images/images/img5.jpeg') center/cover;">
            <div class="container py-4">
                <h1 class="text-white display-4 fw-bold mb-3">Contact Us</h1>
                <p class="text-light mb-0 fs-5">We are here to answer your questions.</p>
            </div>
        </header>

        <section class="py-5" style="background-color: #f8f9fa;">
            <div class="container">
                <div class="row g-5">
                    <!-- Info -->
                    <div class="col-lg-4">
                        <h3 class="fw-bold text-dark mb-4">Get In Touch</h3>
                        <div class="d-flex align-items-center mb-4">
                            <div class="d-flex align-items-center justify-content-center rounded-circle me-3" style="width: 50px; height: 50px; background: white; color: #0b57a4;">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Our Location</h6>
                                <p class="text-muted small mb-0">Dar es Salaam, Tanzania</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mb-4">
                            <div class="d-flex align-items-center justify-content-center rounded-circle me-3" style="width: 50px; height: 50px; background: white; color: #0b57a4;">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Email Us</h6>
                                <p class="text-muted small mb-0">info@tripointlimited.co.tz</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mb-4">
                            <div class="d-flex align-items-center justify-content-center rounded-circle me-3" style="width: 50px; height: 50px; background: white; color: #0b57a4;">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Call Us</h6>
                                <p class="text-muted small mb-0">+255 754 366 104</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form -->
                    <div class="col-lg-8">
                        <!-- HAPA: Nimeongeza id="contact-form" -->
                        <div id="contact-form" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                            <h4 class="fw-bold text-dark mb-4">Send Us a Message</h4>
                            <form @submit.prevent="handleSubmit">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold text-muted">Full Name</label>
                                        <input type="text" class="form-control bg-light" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold text-muted">Email Address</label>
                                        <input type="email" class="form-control bg-light" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label small fw-bold text-muted">Message</label>
                                        <textarea class="form-control bg-light" rows="5" required></textarea>
                                    </div>
                                    <div class="col-12 mt-4">
                                        <button type="submit" class="btn btn-warning px-5 py-2 fw-bold text-white rounded-1 w-100" style="background-color: #f38218; border: none;">Send Message <i class="fas fa-paper-plane ms-2"></i></button>
                                    </div>
                                </div>
                            </form>
                            <div v-if="submitted" class="alert alert-success mt-4 border-0">
                                <i class="fas fa-check-circle me-2"></i> Thank you! Your message has been sent.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const submitted = ref(false);

const handleSubmit = () => {
    submitted.value = true;
    setTimeout(() => {
        submitted.value = false;
    }, 5000);
};
</script>