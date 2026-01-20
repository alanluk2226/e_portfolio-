// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    mobileMenu.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelector('.carousel-slides');
        const slideElements = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dots = carousel.querySelectorAll('.dot');
        const zoomBtn = carousel.closest('.project-img-carousel').querySelector('.zoom-btn');
        const images = carousel.querySelectorAll('.carousel-image');
        
        let currentSlide = 0;
        
        function showSlide(index) {
            if (index >= slideElements.length) index = 0;
            if (index < 0) index = slideElements.length - 1;
            
            slides.style.transform = `translateX(-${index * 100}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        // Event listeners for carousel buttons
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
        
        // Zoom functionality for carousel
        zoomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(images[currentSlide].src, images[currentSlide].alt, currentSlide, images);
        });
        
        // Click on image to zoom
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                openModal(img.src, img.alt, index, images);
            });
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalCounter = document.getElementById('modalCounter');
    const modalDesc = document.getElementById('modalDesc');
    
    let currentImages = [];
    let currentIndex = 0;
    let isZoomed = false;
    
    function openModal(imgSrc, imgAlt, index, images) {
        modal.style.display = 'block';
        modalImg.src = imgSrc;
        modalDesc.textContent = imgAlt;
        currentImages = Array.from(images);
        currentIndex = index;
        isZoomed = false;
        modalImg.classList.remove('zoomed');
        modalImg.style.display = 'block'; // Ensure image is visible
        updateCounter();
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Ensure image loads properly
        modalImg.onload = function() {
            modalImg.style.display = 'block';
        };
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function updateCounter() {
        modalCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }
    
    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        const newImg = currentImages[currentIndex];
        modalImg.src = newImg.src;
        modalDesc.textContent = newImg.alt;
        isZoomed = false;
        modalImg.classList.remove('zoomed');
        updateCounter();
        
        // Ensure image loads properly
        modalImg.onload = function() {
            modalImg.style.display = 'block';
        };
    }
    
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        const newImg = currentImages[currentIndex];
        modalImg.src = newImg.src;
        modalDesc.textContent = newImg.alt;
        isZoomed = false;
        modalImg.classList.remove('zoomed');
        updateCounter();
        
        // Ensure image loads properly
        modalImg.onload = function() {
            modalImg.style.display = 'block';
        };
    }
    
    // Toggle zoom on image click
    modalImg.addEventListener('click', function(e) {
        e.stopPropagation();
        isZoomed = !isZoomed;
        modalImg.classList.toggle('zoomed', isZoomed);
    });
    
    // Event listeners
    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', showPrevImage);
    modalNext.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case ' ':
                    e.preventDefault();
                    isZoomed = !isZoomed;
                    modalImg.classList.toggle('zoomed', isZoomed);
                    break;
            }
        }
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-content')) {
            closeModal();
        }
    });
    
    // Swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    modal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            showNextImage();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            showPrevImage();
        }
    }
});
