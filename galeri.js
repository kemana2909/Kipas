// Inisialisasi saat DOM dimuat
document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    initGalleryDropdown();
    mobileNavigation();
    preloadImages();
});

// Fungsi untuk Lightbox
function initLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-image img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let images = [];

    // Memperbarui daftar gambar yang terlihat
    function updateVisibleImages() {
        images = [];
        document.querySelectorAll('.gallery-item:not([style*="display: none"]) .gallery-image img').forEach(img => {
            const item = img.closest('.gallery-item');
            images.push({
                src: img.src,
                title: item.querySelector('h3').textContent,
                description: item.querySelector('p').textContent
            });
        });
    }

    // Event listener untuk membuka lightbox
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            updateVisibleImages();
            currentImageIndex = images.findIndex(image => image.src === img.src);

            if (currentImageIndex !== -1) {
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                const item = img.closest('.gallery-item');
                lightboxCaption.innerHTML = `<h3>${item.querySelector('h3').textContent}</h3><p>${item.querySelector('p').textContent}</p>`;
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Tutup lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Navigasi ke gambar berikutnya
    lightboxNext.addEventListener('click', () => {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightbox();
        }
    });

    // Navigasi ke gambar sebelumnya
    lightboxPrev.addEventListener('click', () => {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightbox();
        }
    });

    // Tutup lightbox saat klik di luar gambar
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Kontrol lightbox dengan keyboard
    document.addEventListener('keydown', e => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowRight') {
                lightboxNext.click();
            } else if (e.key === 'ArrowLeft') {
                lightboxPrev.click();
            }
        }
    });

    // Fungsi pembantu untuk memperbarui konten lightbox
    function updateLightbox() {
        lightboxImg.src = images[currentImageIndex].src;
        lightboxCaption.innerHTML = `<h3>${images[currentImageIndex].title}</h3><p>${images[currentImageIndex].description}</p>`;
    }
}

// Fungsi untuk preload gambar
function preloadImages() {
    const imagesToPreload = [
        'img/rumah1-desktop.webp',
        'img/rumah2-desktop.webp',
        'img/rumah3-desktop.webp',
        'img/rumah4-desktop.webp'
    ];

    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Fungsi untuk dropdown filter galeri
function initGalleryDropdown() {
    const dropdownWrapper = document.querySelector('.dropdown-wrapper');
    const dropdownSelect = document.querySelector('.dropdown-select');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const selectedCategory = document.querySelector('.selected-category');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Toggle dropdown saat diklik
    dropdownSelect.addEventListener('click', () => {
        dropdownWrapper.classList.toggle('active');
    });

    // Tutup dropdown saat klik di luar
    document.addEventListener('click', event => {
        if (!dropdownWrapper.contains(event.target)) {
            dropdownWrapper.classList.remove('active');
        }
    });

    // Filter galeri berdasarkan kategori
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownItems.forEach(cat => cat.classList.remove('active'));
            item.classList.add('active');
            selectedCategory.textContent = item.textContent;
            dropdownWrapper.classList.remove('active');

            const filterValue = item.getAttribute('data-filter');
            galleryItems.forEach(galleryItem => {
                galleryItem.style.display = filterValue === 'all' || galleryItem.classList.contains(filterValue) ? 'block' : 'none';
            });

            setTimeout(initLightbox, 100); // Perbarui lightbox setelah filter
        });
    });
}

// Fungsi untuk navigasi mobile
function mobileNavigation() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');

        links.forEach((link, index) => {
            link.style.animation = link.style.animation
                ? ''
                : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        });
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            links.forEach(link => link.style.animation = '');
        });
    });
}