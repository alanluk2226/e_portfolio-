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
        
        // Initialize the carousel - show first slide
        function initCarousel() {
            // Set the carousel slides container width based on number of slides
            const totalSlides = slideElements.length;
            slides.style.width = `${totalSlides * 100}%`;
            
            // Set each slide width
            slideElements.forEach(slide => {
                slide.style.width = `${100 / totalSlides}%`;
            });
            
            showSlide(0);
        }
        
        function showSlide(index) {
            if (index >= slideElements.length) index = 0;
            if (index < 0) index = slideElements.length - 1;
            
            // Calculate the transform based on the number of slides in this specific carousel
            const slideWidth = 100 / slideElements.length; // Dynamic width per slide
            slides.style.transform = `translateX(-${index * slideWidth}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        // Initialize the carousel
        initCarousel();
        
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
            
            // Add error handling for images
            img.addEventListener('error', function() {
                console.error('Failed to load image:', this.src);
                this.style.backgroundColor = '#f0f0f0';
                this.alt = 'Image failed to load';
            });
            
            // Add load success handler
            img.addEventListener('load', function() {
                console.log('Image loaded successfully:', this.src);
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
// PDF.js Preview functionality
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.2;
let canvas = null;
let ctx = null;

// Initialize PDF.js
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

function openPdfPreview(pdfUrl) {
    const pdfModal = document.getElementById('pdfModal');
    const pdfLoading = document.getElementById('pdfLoading');
    const pdfError = document.getElementById('pdfError');
    const pdfModalTitle = document.getElementById('pdfModalTitle');
    const pdfCanvasContainer = document.getElementById('pdfCanvasContainer');
    
    // Show modal and loading state
    pdfModal.style.display = 'block';
    pdfLoading.style.display = 'block';
    pdfError.style.display = 'none';
    pdfCanvasContainer.style.display = 'none';
    
    // Reset state
    pageNum = 1;
    scale = 1.2;
    
    // Set title
    const fileName = pdfUrl.split('/').pop().replace(/\.[^/.]+$/, "").replace(/_/g, ' ');
    pdfModalTitle.textContent = fileName;
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Get canvas and context
    canvas = document.getElementById('pdfCanvas');
    ctx = canvas.getContext('2d');
    
    // Load PDF
    if (typeof pdfjsLib !== 'undefined') {
        loadPdfWithPdfJs(pdfUrl);
    } else {
        showPdfError();
    }
}

function loadPdfWithPdfJs(pdfUrl) {
    // Add timestamp to prevent caching issues
    const pdfUrlWithTimestamp = pdfUrl + '?t=' + Date.now();
    
    const loadingTask = pdfjsLib.getDocument({
        url: pdfUrlWithTimestamp,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true
    });
    
    loadingTask.promise.then(function(pdf) {
        pdfDoc = pdf;
        document.getElementById('pdfLoading').style.display = 'none';
        document.getElementById('pdfCanvasContainer').style.display = 'flex';
        
        // Update page info
        updatePageInfo();
        
        // Render first page
        renderPage(pageNum);
        
        // Setup controls
        setupPdfControls();
        
    }).catch(function(error) {
        console.error('Error loading PDF:', error);
        
        // Try alternative method - direct browser PDF viewer
        tryDirectPdfViewer(pdfUrl);
    });
}

function tryDirectPdfViewer(pdfUrl) {
    console.log('Trying direct PDF viewer...');
    
    // Hide canvas container and show iframe fallback
    document.getElementById('pdfCanvasContainer').style.display = 'none';
    document.getElementById('pdfLoading').style.display = 'none';
    
    // Create iframe fallback
    let iframeContainer = document.getElementById('pdfIframeContainer');
    if (!iframeContainer) {
        iframeContainer = document.createElement('div');
        iframeContainer.id = 'pdfIframeContainer';
        iframeContainer.style.cssText = 'width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;';
        
        const iframe = document.createElement('iframe');
        iframe.src = pdfUrl + '#toolbar=0&navpanes=0&scrollbar=1';
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        
        iframe.onload = function() {
            console.log('PDF loaded in iframe');
        };
        
        iframe.onerror = function() {
            console.log('Iframe failed, showing error');
            showPdfError();
        };
        
        iframeContainer.appendChild(iframe);
        document.querySelector('.pdf-viewer-container').appendChild(iframeContainer);
    }
    
    iframeContainer.style.display = 'flex';
    
    // If iframe doesn't load in 5 seconds, show error
    setTimeout(() => {
        if (iframeContainer.style.display !== 'none') {
            showPdfError();
        }
    }, 5000);
}

function renderPage(num) {
    if (!pdfDoc) return;
    
    pageRendering = true;
    
    // Get page
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page into canvas context
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
    
    // Update page counters
    updatePageInfo();
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

function onZoomIn() {
    scale += 0.2;
    queueRenderPage(pageNum);
    updateZoomInfo();
}

function onZoomOut() {
    if (scale <= 0.4) return;
    scale -= 0.2;
    queueRenderPage(pageNum);
    updateZoomInfo();
}

function updatePageInfo() {
    if (!pdfDoc) return;
    document.getElementById('pdfPageInfo').textContent = `${pageNum} / ${pdfDoc.numPages}`;
    
    // Update button states
    const prevBtn = document.getElementById('pdfPrevPage');
    const nextBtn = document.getElementById('pdfNextPage');
    
    prevBtn.disabled = pageNum <= 1;
    nextBtn.disabled = pageNum >= pdfDoc.numPages;
}

function updateZoomInfo() {
    document.getElementById('pdfZoomLevel').textContent = `${Math.round(scale * 100)}%`;
}

function setupPdfControls() {
    const prevBtn = document.getElementById('pdfPrevPage');
    const nextBtn = document.getElementById('pdfNextPage');
    const zoomInBtn = document.getElementById('pdfZoomIn');
    const zoomOutBtn = document.getElementById('pdfZoomOut');
    const fullscreenBtn = document.getElementById('pdfFullscreen');
    
    // Remove existing listeners
    prevBtn.replaceWith(prevBtn.cloneNode(true));
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    zoomInBtn.replaceWith(zoomInBtn.cloneNode(true));
    zoomOutBtn.replaceWith(zoomOutBtn.cloneNode(true));
    fullscreenBtn.replaceWith(fullscreenBtn.cloneNode(true));
    
    // Get new references
    const newPrevBtn = document.getElementById('pdfPrevPage');
    const newNextBtn = document.getElementById('pdfNextPage');
    const newZoomInBtn = document.getElementById('pdfZoomIn');
    const newZoomOutBtn = document.getElementById('pdfZoomOut');
    const newFullscreenBtn = document.getElementById('pdfFullscreen');
    
    // Add new listeners
    newPrevBtn.addEventListener('click', onPrevPage);
    newNextBtn.addEventListener('click', onNextPage);
    newZoomInBtn.addEventListener('click', onZoomIn);
    newZoomOutBtn.addEventListener('click', onZoomOut);
    newFullscreenBtn.addEventListener('click', function() {
        window.open('/assets/documents/Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf', '_blank');
    });
    
    updateZoomInfo();
}

function showPdfError() {
    document.getElementById('pdfLoading').style.display = 'none';
    document.getElementById('pdfError').style.display = 'block';
    document.getElementById('pdfCanvasContainer').style.display = 'none';
}

// PDF Modal close functionality
document.addEventListener('DOMContentLoaded', function() {
    const pdfModal = document.getElementById('pdfModal');
    const pdfModalClose = document.getElementById('pdfModalClose');
    
    function closePdfModal() {
        pdfModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset PDF state
        pdfDoc = null;
        pageNum = 1;
        scale = 1.2;
        
        // Clear canvas
        const canvas = document.getElementById('pdfCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Remove iframe fallback if it exists
        const iframeContainer = document.getElementById('pdfIframeContainer');
        if (iframeContainer) {
            iframeContainer.remove();
        }
        
        // Reset display states
        document.getElementById('pdfLoading').style.display = 'block';
        document.getElementById('pdfError').style.display = 'none';
        document.getElementById('pdfCanvasContainer').style.display = 'none';
    }
    
    // Close button
    if (pdfModalClose) {
        pdfModalClose.addEventListener('click', closePdfModal);
    }
    
    // Close when clicking outside modal content
    pdfModal.addEventListener('click', function(e) {
        if (e.target === pdfModal) {
            closePdfModal();
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (pdfModal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closePdfModal();
                    break;
                case 'ArrowLeft':
                    if (pdfDoc) onPrevPage();
                    break;
                case 'ArrowRight':
                    if (pdfDoc) onNextPage();
                    break;
                case '+':
                case '=':
                    if (pdfDoc) onZoomIn();
                    break;
                case '-':
                    if (pdfDoc) onZoomOut();
                    break;
            }
        }
    });
});
