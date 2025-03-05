// Fungsi untuk mendukung swipe pada elemen slider
function addSwipeSupport(selector, onSwipeLeft, onSwipeRight) {
    const slider = document.querySelector(selector);
    let startX = 0;
    let isDragging = false;
    let startTime = 0;

    // Event saat mouse ditekan
    slider.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        startTime = new Date().getTime();
        e.preventDefault(); // Mencegah pemilihan teks
    });

    // Event saat mouse digerakkan
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.clientX;
        const diffX = startX - currentX;
        
        // Deteksi swipe jika gerakan cukup signifikan
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                onSwipeLeft(); // Geser ke kiri
            } else {
                onSwipeRight(); // Geser ke kanan
            }
            isDragging = false;
        }
    });

    // Event saat mouse dilepas
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Mencegah drag default pada gambar
    slider.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
}

// Fungsi untuk slideshow di Hero Section
function heroSlideshow() {
    const slider = document.querySelector('.hero-slider .slider-images');
    const slides = document.querySelectorAll('.hero-slider .slider-images img');
    let startX = 0;
    let isDragging = false;
    let currentSlideIndex = 0;

    // Menampilkan slide tertentu
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    // Mengubah slide berdasarkan arah
    function changeSlide(direction) {
        currentSlideIndex += direction;
        
        // Looping slide
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        }
        if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        }
        
        showSlide(currentSlideIndex);
    }

    // Dukungan swipe untuk Hero Slider
    slider.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.clientX;
        const diffX = startX - currentX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                changeSlide(1); // Geser ke kiri
            } else {
                changeSlide(-1); // Geser ke kanan
            }
            isDragging = false;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Fungsi untuk slideshow otomatis
    function autoSlide() {
        changeSlide(1);
    }

    // Jalankan slideshow otomatis setiap 5 detik
    setInterval(autoSlide, 5000);

    // Tampilkan slide pertama saat inisialisasi
    showSlide(currentSlideIndex);
}

// Fungsi untuk slideshow di Gallery Section
function gallerySlideshow() {
    const slides = document.querySelector('.gallery-section .slides');
    const slideElements = document.querySelectorAll('.gallery-section .slide');
    const prevButton = document.querySelector('.gallery-section .prev');
    const nextButton = document.querySelector('.gallery-section .next');
    const dots = document.querySelectorAll('.gallery-section .dots .dot');
    let currentSlideIndex = 0;

    // Menampilkan slide tertentu
    function showSlide(index) {
        if (index >= slideElements.length) {
            currentSlideIndex = 0;
        }
        if (index < 0) {
            currentSlideIndex = slideElements.length - 1;
        }

        // Geser slide dengan transform
        slides.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        // Update status dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlideIndex);
        });
    }

    // Mengubah slide berdasarkan arah
    function changeSlide(n) {
        currentSlideIndex += n;
        showSlide(currentSlideIndex);
    }

    // Event listener untuk tombol navigasi
    prevButton.addEventListener('click', () => {
        changeSlide(-1);
    });

    nextButton.addEventListener('click', () => {
        changeSlide(1);
    });

    // Fungsi untuk mengubah slide berdasarkan dot yang diklik
    function currentGallerySlide(n) {
        currentSlideIndex = n - 1;
        showSlide(currentSlideIndex);
    }

    // Tambahkan dukungan swipe untuk Gallery Slider
    addSwipeSupport('.gallery-section .slides', 
        () => changeSlide(1),  // Swipe kiri
        () => changeSlide(-1)  // Swipe kanan
    );

    // Event listener untuk dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentGallerySlide(index + 1);
        });
    });

    // Ekspos fungsi ke global scope
    window.currentGallerySlide = currentGallerySlide;
}

// Fungsi untuk navigasi mobile
function mobileNavigation() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    // Toggle menu saat hamburger diklik
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        
        // Animasi fade-in untuk setiap link
        links.forEach((link, index) => {
            link.style.animation = link.style.animation 
                ? '' 
                : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        });
        
        hamburger.classList.toggle('toggle');
    });

    // Tutup menu saat link diklik
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            
            links.forEach(link => {
                link.style.animation = '';
            });
        });
    });
}

// Inisialisasi semua fungsi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    heroSlideshow();
    gallerySlideshow();
    mobileNavigation();
});

document.addEventListener("DOMContentLoaded", function() {
    // Pastikan Leaflet CSS dan JS sudah dimuat
    loadLeafletCSS();
    loadLeafletJS(initMap);
    
    // Event listener untuk form
    setupContactForm();
});

// Fungsi untuk memuat Leaflet CSS
function loadLeafletCSS() {
    if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
    }
}

// Fungsi untuk memuat Leaflet JS
function loadLeafletJS(callback) {
    if (window.L) {
        // Leaflet sudah dimuat
        callback();
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = callback;
    document.body.appendChild(script);
}

// Inisialisasi OpenStreetMap dengan Leaflet
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Koordinat lokasi bisnis (ganti dengan koordinat yang sesuai)
    const lat = -6.3794550650547395;
    const lng = 106.67413227026088;
    
    // Buat peta
    const map = L.map('map').setView([lat, lng], 15);
    
    // Tambahkan tile layer (peta dasar)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Tambahkan marker dengan style kustom
    const marker = L.marker([lat, lng]).addTo(map);
    
    // Tambahkan popup
    marker.bindPopup("<div style='text-align:center;'><strong>RUMAH BARU MENANTI</strong><br>Konsultasi properti terbaik</div>").openPopup();
}

// Fungsi untuk validasi nomor WhatsApp
function validateWhatsApp(number) {
    // Hapus semua karakter non-digit
    let cleaned = number.replace(/\D/g, '');
    
    // Pastikan dimulai dengan format yang benar
    if (cleaned.startsWith('0')) {
        // Ubah format 08xx menjadi 628xx
        cleaned = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
        // Tambahkan 62 di depan jika belum ada
        cleaned = '62' + cleaned;
    }
    
    return cleaned;
}

// Fungsi untuk mengatur form kontak
function setupContactForm() {
    const contactForm = document.getElementById("contactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const whatsapp = validateWhatsApp(document.getElementById("whatsapp").value);
            const message = document.getElementById("message").value;
            
            // Nomor WhatsApp yang akan dikirimkan (ganti dengan nomor WhatsApp Anda)
            const agentNumber = "6289620069888"; // Format: kode negara (62) + nomor tanpa awalan 0
            
            // Membuat pesan untuk WhatsApp
            const whatsappMessage = 
                `*FORMULIR KONTAK DARI WEBSITE*%0A%0A` +
                `*Nama:* ${firstName} ${lastName}%0A` +
                `*WhatsApp:* ${whatsapp}%0A` +
                `*Pesan:* ${message}`;
            
            // Membuat URL WhatsApp
            const whatsappURL = `https://wa.me/${agentNumber}?text=${whatsappMessage}`;
            
            // Redirect ke WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Reset form setelah dikirim
            this.reset();
        });
    }
}

// Tambahkan di akhir script.js, setelah semua fungsi yang sudah ada
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan event listener untuk setiap .contact-card
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Dapatkan URL dari atribut data-url
            const url = card.getAttribute('data-url');
            
            // Pastikan URL ada
            if (url) {
                // Buka URL di tab baru
                window.open(url, '_blank');
            }
        });
    });
});



