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
///////////////////////////////////////////////////



///////////////////////////////////////////////////
    // ======= MENÚ FULL SCREEN ==========

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
///////////////////////////////////////////////////






///////////////////////////////////////////////////
// ======== CARROUSEL PRODUCTOS ===========

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

    // autoplay: {
    //     delay: 3000,
    //     disableOnInteraction: false,
    // }
});

///////////////////////////////////////////////////



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
                        S/ ${producto.precio}
                    </p>
                </div>
            </div>
            
            <div class="flex flex-col items-end gap-2 flex-shrink-0">
                <span class="font-bold text-sm text-white whitespace-nowrap">S/ ${subtotal}</span>
                
                <div class="flex items-center gap-2 bg-zinc-700 rounded-lg px-2 py-0.5">
                    <button onclick="cambiarCantidad(${producto.id}, -1)" class="text-blue-400 hover:text-blue-300 font-bold px-2 py-0.5">-</button>
                    <span class="text-white text-xs font-bold min-w-[16px] text-center">${producto.cantidad}</span>
                    <button onclick="cambiarCantidad(${producto.id}, 1)" class="text-blue-400 hover:text-blue-300 font-bold px-2 py-0.5">+</button>
                </div>
            </div>
        `;

        listaCarrito.appendChild(itemLi);
    });

    // Actualizamos el total general
    totalCarrito.textContent = `S/ ${total.toFixed(2)}`;
}

// 4.5. Función para cambiar la cantidad con los botones
function cambiarCantidad(id, operacion) {
    // Buscamos el producto en el arreglo
    const producto = carrito.find(item => item.id === id);

    if (producto) {
        producto.cantidad += operacion;

        // Si la cantidad llega a 0, eliminamos el producto del carrito
        if (producto.cantidad <= 0) {
            eliminarProducto(id);
            return; // Salimos de la función ya que el producto fue eliminado
        }
    }

    // Actualizamos la vista y guardamos en el Local Storage
    actualizarCarritoUI();
    guardarCarrito();
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



// 7. Obtener referencias a los elementos
const carritoPanel = document.getElementById('carrito-panel');
const carritoOverlay = document.getElementById('carrito-overlay');

function abrirCarrito() {
    carritoOverlay.classList.remove('hidden');
    // Forzar un pequeño delay para que la transición de opacidad del overlay sea suave
    setTimeout(() => {
        carritoPanel.classList.remove('-translate-y-full', 'md:translate-x-full');
    }, 10);
}

function cerrarCarrito() {
    // Primero, ocultar el panel
    carritoPanel.classList.add('-translate-y-full', 'md:translate-x-full');

    // Esperar a que termine la animación (300ms es el duration de Tailwind) para ocultar el overlay
    setTimeout(() => {
        carritoOverlay.classList.add('hidden');
    }, 300);
}

// Opcional: Cerrar con la tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !carritoPanel.classList.contains('md:translate-x-full')) {
        cerrarCarrito();
    }
});

// 8. Asignar el evento abrir al botón del header (si lo tienes)
const botonHeaderCarrito = document.getElementById('carrito');
    if (botonHeaderCarrito) {
        botonHeaderCarrito.addEventListener('click', abrirCarrito);
    }



// 9 ====== INTEGRACIÓN WHATSAPP ======

// ¡REEMPLAZA ESTO POR TU NÚMERO DE TELÉFONO!
// Debe incluir el código de país (51 para Perú) y sin espacios ni '+'
// ====== INTEGRACIÓN WHATSAPP CORREGIDA ======

const NUMERO_WHATSAPP_NEGOCIO = "51900556685"; // ¡REEMPLAZA ESTE NÚMERO!

function finalizarCompraWhatsApp() {
    if (carrito.length === 0) {
        alert("¡Tu carrito está vacío!");
        return;
    }

    // 1. Construir el mensaje
    let mensaje = `Hola *ZZAGY*, me gustaría finalizar mi pedido:%0A%0A`;
    mensaje += `--- *RESUMEN DEL PEDIDO* ---%0A`;

    let total = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        mensaje += `${index + 1}. *${producto.nombre}*%0A`;
        mensaje += `   🛒 Cantidad: ${producto.cantidad} x S/ ${producto.precio.toFixed(2)}%0A`;
        mensaje += `   💰 Subtotal: *S/ ${subtotal.toFixed(2)}*%0A`;
        mensaje += `-----------------------%0A`;
    });

    mensaje += `%0A💵 *TOTAL A PAGAR: S/ ${total.toFixed(2)}*%0A`;
    mensaje += `%0A¿Podrían confirmarme los métodos de pago y envío? ¡Gracias!`;

    // 2. Crear la URL
    const url = `https://api.whatsapp.com/send?phone=${NUMERO_WHATSAPP_NEGOCIO}&text=${mensaje}`;

    // 3. Detectar si es dispositivo móvil para abrir directo en la misma pestaña
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Redirige en la misma pestaña (evita el salto de página nueva)
        window.location.href = url;
    } else {
        // Para PC, lo seguimos abriendo en una pestaña nueva para no cerrar la tienda
        window.open(url, '_blank').focus();
    }
}

///////////////////////////////////////////////



///////////////////////////////////////////////
///////// ======= ABRIR CARRITO AL PRESIONAR EL BOTTON ======
// Seleccionamos todos los botones que tengan esta clase
const botones = document.querySelectorAll('.boton-agregar');

botones.forEach(boton => {
    boton.addEventListener('click', () => {
        // Lógica que quieres que hagan todos los botones
        abrirCarrito();
    });
});


///////////////////////////////////////////////





///////////////////////////////////////////////

//// ====== CARDS PRODUCTOS INFO EXPANSION ======
function abrirModalGeneral(producto) {
    // 1. Rellenar textos básicos
    document.getElementById('modal-nombre').textContent = producto.nombre;
    document.getElementById('modal-precio').textContent = `S/ ${producto.precio.toFixed(2)}`;
    document.getElementById('modal-categoria').textContent = producto.categoria;
    document.getElementById('modal-descripcion').textContent = producto.descripcion;
    document.getElementById('modal-imagen').src = producto.imagenes[0]; // Muestra la primera imagen por defecto

    // 2. Llenar características dinámicamente
    const listaCaracteristicas = document.getElementById('modal-caracteristicas');
    listaCaracteristicas.innerHTML = '';
    producto.caracteristicas.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listaCaracteristicas.appendChild(li);
    });

    // 3. Crear miniaturas dinámicas
    const contenedorMiniaturas = document.getElementById('modal-miniaturas');
    contenedorMiniaturas.innerHTML = '';
    
    producto.imagenes.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.className = 'w-[64px] h-[64px] object-cover rounded-xl cursor-pointer border border-zinc-700 hover:opacity-80 transition flex-shrink-0';
        img.onclick = () => cambiarImagenPrincipal(imgUrl);
        contenedorMiniaturas.appendChild(img);
    });

    // 4. Configurar botón de agregar al carrito
    const botonAgregar = document.getElementById('modal-boton-agregar');
    botonAgregar.onclick = function() {
        agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagenes[0]);
        cerrarModalProducto();
        abrirCarrito();
    };

    // 5. Mostrar modal y overlay
    document.getElementById('producto-modal').classList.remove('hidden');
    document.getElementById('producto-modal-overlay').classList.remove('hidden');
}

function cambiarImagenPrincipal(nuevaSrc) {
    document.getElementById('modal-imagen').src = nuevaSrc;
}

function cerrarModalProducto() {
    document.getElementById('producto-modal').classList.add('hidden');
    document.getElementById('producto-modal-overlay').classList.add('hidden');
}


// ////////////////////////////////////////////////






// /////////////////////////////////////////////////

// ====== BOTON AGREGAR CARRITO SIN INFO OCULTA ========


function agregarYVerCarrito(event, id, nombre, precio, imagen) {
    // 1. Detiene la propagación para que no se abra el modal de la card
    event.stopPropagation();

    // 2. Ejecuta tu función para agregar al carrito
    agregarAlCarrito(id, nombre, precio, imagen);

    // 3. Abre el carrito
    abrirCarrito();
}