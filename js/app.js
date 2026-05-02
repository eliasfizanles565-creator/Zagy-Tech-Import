document.addEventListener('DOMContentLoaded', () => {
    const btnColor = document.getElementById('btn-color');
    const btnMenu = document.getElementById('btn-menu');
    const btnClose = document.getElementById('btn-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const html = document.documentElement;
    const body = document.body;

    // --- MODO OSCURO ---
    if (localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
    }

    if (btnColor) {
        btnColor.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    // --- MENÚ FULL SCREEN ---
    if (btnMenu && mobileMenu) {
        // Abrir: Quitamos la traslación negativa (baja desde arriba)
        btnMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('-translate-y-full');
            body.classList.add('overflow-hidden'); // Evita que la página se mueva detrás
        });

        // Cerrar: Volvemos a subirlo
        const closeMenu = () => {
            mobileMenu.classList.add('-translate-y-full');
            body.classList.remove('overflow-hidden'); // Reactiva el scroll
        };

        if (btnClose) btnClose.addEventListener('click', closeMenu);

        // Cerrar al clickear cualquier link del menú
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => link.addEventListener('click', closeMenu));
    }
});






document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.nav-card-zagi');
    
    cards.forEach(card => {
        // Bloquea el menú contextual (clic derecho / presión larga)
        card.addEventListener('contextmenu', e => e.preventDefault());
        
        // Bloquea el inicio del toque largo en móviles
        card.addEventListener('touchstart', e => {
            // Esto evita que el navegador inicie el temporizador del menú contextual
            // pero deja que el clic siga funcionando.
        }, { passive: true });
    });
});



// CARROUSEL PRODUCTOS

const swiperTestimonial = new Swiper('.testimonial__swiper', {
    // Optional parameters
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',
    spaceBetween: 16,
    grabCursor: true,
    speed: 600,
    effect: 'coverflow',
    coverflowEffect:{
        rotate: -90,
        depth: 600,
        modifier: .5,
        slideShadows: false,
    },

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    }
});