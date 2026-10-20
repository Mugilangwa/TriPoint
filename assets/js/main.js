// =========================================
// Tripoint Limited Custom JavaScript
// =========================================

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Fomu ya Mawasiliano (Contact Form Simulation)
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Kuzuia ukurasa kurudi juu (refresh)
            
            // Hapa unaweza kuongeza namba yako ya EmailJS au PHP backend baadaye
            
            // Ficha fomu na uonyeshe ujumbe wa mafanikio
            contactForm.classList.add('d-none');
            successMessage.classList.remove('d-none');
            
            // Rudisha fomu baada ya sekunde 5 (Hiari)
            setTimeout(() => {
                contactForm.reset();
                contactForm.classList.remove('d-none');
                successMessage.classList.add('d-none');
            }, 5000);
        });
    }
});