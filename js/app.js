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





///////////////////////////////////////////////////
//============ CARRITO ================

// ============ CARRITO ================

// 1. Arreglo para guardar los productos
let carrito = [];

// 2. Cargamos el carrito automáticamente cuando la página abre
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
});

// 3. Función para agregar productos
function agregarAlCarrito(id, nombre, precio, imagenUrl) {
    // Verificamos si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, lo añadimos con su imagen
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagenUrl,
            cantidad: 1
        });
    }

    // Actualizamos la vista en pantalla, el total y guardamos en el Local Storage
    actualizarCarritoUI();
    guardarCarrito();
}

// 4. Función para actualizar la interfaz (HTML)
function actualizarCarritoUI() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');

    // Verificamos que los elementos existan en el HTML para evitar errores en consola
    if (!listaCarrito || !totalCarrito) return;

    // Limpiamos la lista para no duplicar elementos al actualizar
    listaCarrito.innerHTML = '';
    
    let total = 0;

    // Recorremos cada producto del carrito
    carrito.forEach(producto => {
        // Calculamos el subtotal por producto
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        // Creamos un nuevo elemento <li> para la lista
        const itemLi = document.createElement('li');
        itemLi.className = 'flex items-center justify-between gap-3 bg-zinc-800 p-3 rounded-xl w-full';
        
        itemLi.innerHTML = `
            <div class="flex items-center gap-3 flex-1 min-w-0">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-12 h-12 object-cover rounded-md flex-shrink-0">
                <div class="min-w-0 flex-1">
                    <h4 class="font-medium text-sm text-white break-words line-clamp-2 leading-tight">
                        ${producto.nombre}
                    </h4>
                    <p class="text-xs text-gray-400 mt-0.5">
                        S/ ${producto.precio} x ${producto.cantidad}
                    </p>
                </div>
            </div>
            
            <div class="flex items-center gap-4 flex-shrink-0">
                <span class="font-bold text-sm text-white whitespace-nowrap">S/ ${subtotal}</span>
                <button onclick="eliminarProducto(${producto.id})" class="text-blue-500 hover:text-red-400 text-sm p-1">❌</button>
            </div>
        `;

        listaCarrito.appendChild(itemLi);
    });

    // Actualizamos el total general
    totalCarrito.textContent = `S/ ${total.toFixed(2)}`;
}

// 5. Función extra para eliminar productos del carrito
function eliminarProducto(id) {
    // Filtramos el carrito dejando solo los productos que no coinciden con el id a eliminar
    carrito = carrito.filter(item => item.id !== id);
    
    // Actualizamos la vista y guardamos en el Local Storage
    actualizarCarritoUI();
    guardarCarrito();
}

// 6. Funciones de Local Storage //////////////
function guardarCarrito() {
    localStorage.setItem('carritoTienda', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoTienda');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarritoUI(); // Dibujamos el carrito en pantalla con los datos cargados
    }
}