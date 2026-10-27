<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2">
        <div class="container">
            <!-- HAPA: Nimebadilisha href kuwa to -->
            <router-link class="navbar-brand" to="/">
                <img src="@/assets/images/logo/img.png" alt="Tripoint Logo" style="height: 60px; object-fit: contain;">
            </router-link>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-center fw-semibold">
                    <li class="nav-item"><router-link class="nav-link text-dark" to="/">Home</router-link></li>
                    <li class="nav-item"><router-link class="nav-link text-dark" to="/about">About Us</router-link></li>
                    <li class="nav-item"><router-link class="nav-link text-dark" to="/mission">Mission & Vision</router-link></li>
                    <li class="nav-item"><router-link class="nav-link text-dark" to="/contact">Contact</router-link></li>
                    <li class="nav-item ms-lg-4 mt-3 mt-lg-0">
                        <router-link to="/contact#contact-form" class="btn btn-warning px-4 py-2 fw-bold text-white rounded-1" style="background-color: #f38218; border: none;">
                            Get a Quote
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>