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

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    }
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
        const subtotal = Number((producto.precio * producto.cantidad).toFixed(2));
        total += subtotal;

        // Creamos un nuevo elemento <li> para la lista
        const itemLi = document.createElement('li');
        itemLi.className = 'flex items-center justify-between gap-3 bg-white/10 dark:bg-zinc-950/20 p-3 rounded-xl w-full border border-blue-400 dark:border-lime-500';
        
        itemLi.innerHTML = `
            <div class="flex items-center gap-3 flex-1 min-w-0">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-12 h-12 object-cover rounded-md flex-shrink-0">
                <div class="min-w-0 flex-1">
                    <h4 class="font-medium text-sm break-words line-clamp-2 leading-tight">
                        ${producto.nombre}
                    </h4>
                    <p class="text-xs text-blue-400 dark:text-lime-500 mt-0.5">
                        S/ ${producto.precio}
                    </p>
                </div>
            </div>
            
            <div class="flex flex-col items-end gap-2 flex-shrink-0">
                <span class="font-bold text-sm  whitespace-nowrap">S/ ${subtotal}</span>
                
                <div class="flex items-center gap-2 bg-transparent rounded-lg px-2 py-0.5">

                    <button onclick="cambiarCantidad(${producto.id}, -1)" class="text-blue-400 hover:text-blue-300 dark:text-lime-500 dark:hover:text-lime-400 font-bold px-2 py-0.5 cursor-pointer">
                    -
                    </button>

                    <span class=" text-xs font-bold min-w-[16px] text-center">
                    ${producto.cantidad}
                    </span>

                    <button onclick="cambiarCantidad(${producto.id}, 1)" class="text-blue-400 hover:text-blue-300 dark:text-lime-500 dark:hover:text-lime-400 font-bold px-2 py-0.5 cursor-pointer">
                    +
                    </button>
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
// ABRIR INFO PINK
function abrirModalGeneral(producto) {
    document.getElementById('modal-nombre').textContent = producto.nombre;
    document.getElementById('modal-precio').textContent = `S/ ${producto.precio.toFixed(2)}`;
    document.getElementById('modal-categoria').textContent = producto.categoria;
    document.getElementById('modal-descripcion').textContent = producto.descripcion;
    
    cambiarImagenPrincipal(producto.imagenes[0]);

    const listaCaracteristicas = document.getElementById('modal-caracteristicas');
    listaCaracteristicas.innerHTML = '';
    producto.caracteristicas.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listaCaracteristicas.appendChild(li);
    });

    const contenedorMiniaturas = document.getElementById('modal-miniaturas');
    contenedorMiniaturas.innerHTML = '';
    
    producto.imagenes.forEach(imgUrl => {
        const esVideo = imgUrl.toLowerCase().endsWith('.mp4');
        
        if (esVideo) {
            const videoThumb = document.createElement('video');
            videoThumb.src = imgUrl;
            videoThumb.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-pinkTouch carrito3 transition flex-shrink-0';
            
            videoThumb.onclick = () => {
                const botonVideo = document.getElementById('btn-video-modal');
                if (botonVideo) {
                    botonVideo.setAttribute('data-video-url', imgUrl);
                }
                reproducirVideoDelBoton();
            };
            
            contenedorMiniaturas.appendChild(videoThumb);
        } else {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-pinkTouch carrito3 transition flex-shrink-0';
            img.onclick = () => cambiarImagenPrincipal(imgUrl);
            contenedorMiniaturas.appendChild(img);
        }
    });

    const botonAgregar = document.getElementById('modal-boton-agregar');
    if (botonAgregar) {
        botonAgregar.onclick = function() {
            agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagenes[0]);
            cerrarModalProducto();
            abrirCarrito();
        };
    }

    const botonVideo = document.getElementById('btn-video-modal');
    const urlVideo = producto.imagenes.find(url => url.toLowerCase().endsWith('.mp4'));

    if (urlVideo) {
        botonVideo.setAttribute('data-video-url', urlVideo);
        botonVideo.classList.remove('hidden');
    } else {
        botonVideo.classList.add('hidden');
    }

    document.getElementById('producto-modal').classList.remove('hidden');
    document.getElementById('producto-modal-overlay').classList.remove('hidden');
}


// ABRIR INFO BLUE (INDEPENDIENTE)
function abrirModalGeneral2(producto) {
    document.getElementById('modal-nombre-2').textContent = producto.nombre;
    document.getElementById('modal-precio-2').textContent = `S/ ${producto.precio.toFixed(2)}`;
    document.getElementById('modal-categoria-2').textContent = producto.categoria;
    document.getElementById('modal-descripcion-2').textContent = producto.descripcion;
    
    cambiarImagenPrincipal2(producto.imagenes[0]); // Llama a la función independiente del modal 2

    const listaCaracteristicas = document.getElementById('modal-caracteristicas-2');
    listaCaracteristicas.innerHTML = '';
    producto.caracteristicas.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listaCaracteristicas.appendChild(li);
    });

    const contenedorMiniaturas = document.getElementById('modal-miniaturas-2');
    contenedorMiniaturas.innerHTML = '';
    
    producto.imagenes.forEach(imgUrl => {
        const esVideo = imgUrl.toLowerCase().endsWith('.mp4');
        
        if (esVideo) {
            const videoThumb = document.createElement('video');
            videoThumb.src = imgUrl;
            videoThumb.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-blueTouch carrito3 transition flex-shrink-0';
            
            videoThumb.onclick = () => {
                const botonVideo2 = document.getElementById('btn-video-modal-2');
                if (botonVideo2) {
                    botonVideo2.setAttribute('data-video-url', imgUrl);
                }
                reproducirVideoDelBoton2(); // Llama a la función del botón 2
            };
            
            contenedorMiniaturas.appendChild(videoThumb);
        } else {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-blueTouch carrito3 transition flex-shrink-0';
            // Al hacer clic cambia la imagen del modal 2
            img.onclick = () => cambiarImagenPrincipal2(imgUrl);
            contenedorMiniaturas.appendChild(img);
        }
    });

    const botonAgregar = document.getElementById('modal-boton-agregar-2');
    if (botonAgregar) {
        botonAgregar.onclick = function() {
            agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagenes[0]);
            cerrarModalProducto();
            abrirCarrito();
        };
    }

    const botonVideo2 = document.getElementById('btn-video-modal-2');
    const urlVideo = producto.imagenes.find(url => url.toLowerCase().endsWith('.mp4'));

    if (urlVideo && botonVideo2) {
        botonVideo2.setAttribute('data-video-url', urlVideo);
        botonVideo2.classList.remove('hidden');
    } else if (botonVideo2) {
        botonVideo2.classList.add('hidden');
    }

    // Inicialización del modal 2 (Oculta el video y muestra la imagen al cargar)
    const imgElemento2 = document.getElementById('modal-imagen-2');
    const videoElemento2 = document.getElementById('modal-video-2');

    if (videoElemento2) {
        videoElemento2.classList.add('hidden');
        videoElemento2.pause();
    }

    if (imgElemento2) {
        imgElemento2.src = producto.imagenes[0];
        imgElemento2.classList.remove('hidden');
        imgElemento2.style.objectFit = 'contain';
    }

    document.getElementById('producto-modal-2').classList.remove('hidden');
    document.getElementById('producto-modal-overlay').classList.remove('hidden');
}
/////////////


// ABRIR INFO FUCHSIA (INDEPENDIENTE)
function abrirModalGeneral3(producto) {
    document.getElementById('modal-nombre-3').textContent = producto.nombre;
    document.getElementById('modal-precio-3').textContent = `S/ ${producto.precio.toFixed(2)}`;
    document.getElementById('modal-categoria-3').textContent = producto.categoria;
    document.getElementById('modal-descripcion-3').textContent = producto.descripcion;
    
    cambiarImagenPrincipal3(producto.imagenes[0]); // Llama a la función independiente del modal 2

    const listaCaracteristicas = document.getElementById('modal-caracteristicas-3');
    listaCaracteristicas.innerHTML = '';
    producto.caracteristicas.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listaCaracteristicas.appendChild(li);
    });

    const contenedorMiniaturas = document.getElementById('modal-miniaturas-3');
    contenedorMiniaturas.innerHTML = '';
    
    producto.imagenes.forEach(imgUrl => {
        const esVideo = imgUrl.toLowerCase().endsWith('.mp4');
        
        if (esVideo) {
            const videoThumb = document.createElement('video');
            videoThumb.src = imgUrl;
            videoThumb.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-pinkTouch carrito3 transition flex-shrink-0';
            
            videoThumb.onclick = () => {
                const botonVideo3 = document.getElementById('btn-video-modal-3');
                if (botonVideo3) {
                    botonVideo3.setAttribute('data-video-url', imgUrl);
                }
                reproducirVideoDelBoton3(); // Llama a la función del botón 3
            };
            
            contenedorMiniaturas.appendChild(videoThumb);
        } else {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-fuchsiaTouch carrito3 transition flex-shrink-0';
            // Al hacer clic cambia la imagen del modal 3
            img.onclick = () => cambiarImagenPrincipal3(imgUrl);
            contenedorMiniaturas.appendChild(img);
        }
    });

    const botonAgregar = document.getElementById('modal-boton-agregar-3');
    if (botonAgregar) {
        botonAgregar.onclick = function() {
            agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagenes[0]);
            cerrarModalProducto();
            abrirCarrito();
        };
    }

    const botonVideo3 = document.getElementById('btn-video-modal-3');
    const urlVideo = producto.imagenes.find(url => url.toLowerCase().endsWith('.mp4'));

    if (urlVideo && botonVideo3) {
        botonVideo3.setAttribute('data-video-url', urlVideo);
        botonVideo3.classList.remove('hidden');
    } else if (botonVideo3) {
        botonVideo3.classList.add('hidden');
    }

    // Inicialización del modal 3 (Oculta el video y muestra la imagen al cargar)
    const imgElemento3 = document.getElementById('modal-imagen-3');
    const videoElemento3 = document.getElementById('modal-video-3');

    if (videoElemento3) {
        videoElemento3.classList.add('hidden');
        videoElemento3.pause();
    }

    if (imgElemento3) {
        imgElemento3.src = producto.imagenes[0];
        imgElemento3.classList.remove('hidden');
        imgElemento3.style.objectFit = 'contain';
    }

    document.getElementById('producto-modal-3').classList.remove('hidden');
    document.getElementById('producto-modal-overlay').classList.remove('hidden');
}
/////////////


// ABRIR INFO LIME (INDEPENDIENTE)
function abrirModalGeneral4(producto) {
    document.getElementById('modal-nombre-4').textContent = producto.nombre;
    document.getElementById('modal-precio-4').textContent = `S/ ${producto.precio.toFixed(2)}`;
    document.getElementById('modal-categoria-4').textContent = producto.categoria;
    document.getElementById('modal-descripcion-4').textContent = producto.descripcion;
    
    cambiarImagenPrincipal4(producto.imagenes[0]); // Llama a la función independiente del modal 4

    const listaCaracteristicas = document.getElementById('modal-caracteristicas-4');
    listaCaracteristicas.innerHTML = '';
    producto.caracteristicas.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listaCaracteristicas.appendChild(li);
    });

    const contenedorMiniaturas = document.getElementById('modal-miniaturas-4');
    contenedorMiniaturas.innerHTML = '';
    
    producto.imagenes.forEach(imgUrl => {
        const esVideo = imgUrl.toLowerCase().endsWith('.mp4');
        
        if (esVideo) {
            const videoThumb = document.createElement('video');
            videoThumb.src = imgUrl;
            videoThumb.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-limeTouch carrito3 transition flex-shrink-0';
            
            videoThumb.onclick = () => {
                const botonVideo4 = document.getElementById('btn-video-modal-4');
                if (botonVideo4) {
                    botonVideo4.setAttribute('data-video-url', imgUrl);
                }
                reproducirVideoDelBoton4(); // Llama a la función del botón 4
            };
            
            contenedorMiniaturas.appendChild(videoThumb);
        } else {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-limeTouch carrito3 transition flex-shrink-0';
            // Al hacer clic cambia la imagen del modal 4
            img.onclick = () => cambiarImagenPrincipal4(imgUrl);
            contenedorMiniaturas.appendChild(img);
        }
    });

    const botonAgregar = document.getElementById('modal-boton-agregar-4');
    if (botonAgregar) {
        botonAgregar.onclick = function() {
            agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagenes[0]);
            cerrarModalProducto();
            abrirCarrito();
        };
    }

    const botonVideo4 = document.getElementById('btn-video-modal-4');
    const urlVideo = producto.imagenes.find(url => url.toLowerCase().endsWith('.mp4'));

    if (urlVideo && botonVideo4) {
        botonVideo4.setAttribute('data-video-url', urlVideo);
        botonVideo4.classList.remove('hidden');
    } else if (botonVideo4) {
        botonVideo4.classList.add('hidden');
    }

    // Inicialización del modal 4 (Oculta el video y muestra la imagen al cargar)
    const imgElemento4 = document.getElementById('modal-imagen-4');
    const videoElemento4 = document.getElementById('modal-video-4');

    if (videoElemento4) {
        videoElemento4.classList.add('hidden');
        videoElemento4.pause();
    }

    if (imgElemento4) {
        imgElemento4.src = producto.imagenes[0];
        imgElemento4.classList.remove('hidden');
        imgElemento4.style.objectFit = 'contain';
    }

    document.getElementById('producto-modal-4').classList.remove('hidden');
    document.getElementById('producto-modal-overlay').classList.remove('hidden');
}
/////////////


// ABRIR INFO AMBER (INDEPENDIENTE)
function abrirModalGeneral5(producto) {
    document.getElementById('modal-nombre-5').textContent = producto.nombre;
    document.getElementById('modal-precio-5').textContent = `S/ ${producto.precio.toFixed(2)}`;
    document.getElementById('modal-categoria-5').textContent = producto.categoria;
    document.getElementById('modal-descripcion-5').textContent = producto.descripcion;
    
    cambiarImagenPrincipal5(producto.imagenes[0]); // Llama a la función independiente del modal 4

    const listaCaracteristicas = document.getElementById('modal-caracteristicas-5');
    listaCaracteristicas.innerHTML = '';
    producto.caracteristicas.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listaCaracteristicas.appendChild(li);
    });

    const contenedorMiniaturas = document.getElementById('modal-miniaturas-5');
    contenedorMiniaturas.innerHTML = '';
    
    producto.imagenes.forEach(imgUrl => {
        const esVideo = imgUrl.toLowerCase().endsWith('.mp4');
        
        if (esVideo) {
            const videoThumb = document.createElement('video');
            videoThumb.src = imgUrl;
            videoThumb.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-amberTouch carrito3 transition flex-shrink-0';
            
            videoThumb.onclick = () => {
                const botonVideo5 = document.getElementById('btn-video-modal-5');
                if (botonVideo5) {
                    botonVideo5.setAttribute('data-video-url', imgUrl);
                }
                reproducirVideoDelBoton5(); // Llama a la función del botón 4
            };
            
            contenedorMiniaturas.appendChild(videoThumb);
        } else {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-amberTouch carrito3 transition flex-shrink-0';
            // Al hacer clic cambia la imagen del modal 4
            img.onclick = () => cambiarImagenPrincipal5(imgUrl);
            contenedorMiniaturas.appendChild(img);
        }
    });

    const botonAgregar = document.getElementById('modal-boton-agregar-5');
    if (botonAgregar) {
        botonAgregar.onclick = function() {
            agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagenes[0]);
            cerrarModalProducto();
            abrirCarrito();
        };
    }

    const botonVideo5 = document.getElementById('btn-video-modal-5');
    const urlVideo = producto.imagenes.find(url => url.toLowerCase().endsWith('.mp4'));

    if (urlVideo && botonVideo5) {
        botonVideo5.setAttribute('data-video-url', urlVideo);
        botonVideo5.classList.remove('hidden');
    } else if (botonVideo5) {
        botonVideo5.classList.add('hidden');
    }

    // Inicialización del modal 4 (Oculta el video y muestra la imagen al cargar)
    const imgElemento5 = document.getElementById('modal-imagen-5');
    const videoElemento5 = document.getElementById('modal-video-5');

    if (videoElemento5) {
        videoElemento5.classList.add('hidden');
        videoElemento5.pause();
    }

    if (imgElemento5) {
        imgElemento5.src = producto.imagenes[0];
        imgElemento5.classList.remove('hidden');
        imgElemento5.style.objectFit = 'contain';
    }

    document.getElementById('producto-modal-5').classList.remove('hidden');
    document.getElementById('producto-modal-overlay').classList.remove('hidden');
}
/////////////


// ABRIR INFO PURPLE (INDEPENDIENTE)
function abrirModalGeneral6(producto) {
    document.getElementById('modal-nombre-6').textContent = producto.nombre;
    document.getElementById('modal-precio-6').textContent = `S/ ${producto.precio.toFixed(2)}`;
    document.getElementById('modal-categoria-6').textContent = producto.categoria;
    document.getElementById('modal-descripcion-6').textContent = producto.descripcion;
    
    cambiarImagenPrincipal6(producto.imagenes[0]); // Llama a la función independiente del modal 4

    const listaCaracteristicas = document.getElementById('modal-caracteristicas-6');
    listaCaracteristicas.innerHTML = '';
    producto.caracteristicas.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listaCaracteristicas.appendChild(li);
    });

    const contenedorMiniaturas = document.getElementById('modal-miniaturas-6');
    contenedorMiniaturas.innerHTML = '';
    
    producto.imagenes.forEach(imgUrl => {
        const esVideo = imgUrl.toLowerCase().endsWith('.mp4');
        
        if (esVideo) {
            const videoThumb = document.createElement('video');
            videoThumb.src = imgUrl;
            videoThumb.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-purpleTouch carrito3 transition flex-shrink-0';
            
            videoThumb.onclick = () => {
                const botonVideo6 = document.getElementById('btn-video-modal-6');
                if (botonVideo6) {
                    botonVideo6.setAttribute('data-video-url', imgUrl);
                }
                reproducirVideoDelBoton6(); // Llama a la función del botón 6
            };
            
            contenedorMiniaturas.appendChild(videoThumb);
        } else {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'w-[64px] h-[64px] object-cover rounded-xl border infoOculta card-purpleTouch carrito3 transition flex-shrink-0';
            // Al hacer clic cambia la imagen del modal 4
            img.onclick = () => cambiarImagenPrincipal6(imgUrl);
            contenedorMiniaturas.appendChild(img);
        }
    });

    const botonAgregar = document.getElementById('modal-boton-agregar-6');
    if (botonAgregar) {
        botonAgregar.onclick = function() {
            agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagenes[0]);
            cerrarModalProducto();
            abrirCarrito();
        };
    }

    const botonVideo6 = document.getElementById('btn-video-modal-6');
    const urlVideo = producto.imagenes.find(url => url.toLowerCase().endsWith('.mp4'));

    if (urlVideo && botonVideo6) {
        botonVideo6.setAttribute('data-video-url', urlVideo);
        botonVideo6.classList.remove('hidden');
    } else if (botonVideo6) {
        botonVideo6.classList.add('hidden');
    }

    // Inicialización del modal 4 (Oculta el video y muestra la imagen al cargar)
    const imgElemento6 = document.getElementById('modal-imagen-6');
    const videoElemento6 = document.getElementById('modal-video-6');

    if (videoElemento6) {
        videoElemento6.classList.add('hidden');
        videoElemento6.pause();
    }

    if (imgElemento6) {
        imgElemento6.src = producto.imagenes[0];
        imgElemento6.classList.remove('hidden');
        imgElemento6.style.objectFit = 'contain';
    }

    document.getElementById('producto-modal-6').classList.remove('hidden');
    document.getElementById('producto-modal-overlay').classList.remove('hidden');
}
/////////////



//////////////////////////////

/////////////
// 1. Cambia de imagen - Modal 1 - PINK
function cambiarImagenPrincipal(nuevaSrc) {
    const imgElemento = document.getElementById('modal-imagen');
    const videoElemento = document.getElementById('modal-video');

    if (videoElemento) {
        videoElemento.classList.add('hidden');
        videoElemento.pause();
    }

    if (imgElemento) {
        imgElemento.classList.remove('hidden');
        imgElemento.src = nuevaSrc;
        imgElemento.style.objectFit = 'contain';
    }
}
// 2. Cambia de imagen - Modal 2 (Independiente) - BLUE
function cambiarImagenPrincipal2(nuevaSrc) {
    const imgElemento2 = document.getElementById('modal-imagen-2');
    const videoElemento2 = document.getElementById('modal-video-2');

    if (videoElemento2) {
        videoElemento2.classList.add('hidden');
        videoElemento2.pause();
    }

    if (imgElemento2) {
        imgElemento2.classList.remove('hidden');
        imgElemento2.src = nuevaSrc;
        imgElemento2.style.objectFit = 'contain';
    }
}

// 3. Cambia de imagen - Modal 3 (Independiente) - FUCHSIA
function cambiarImagenPrincipal3(nuevaSrc) {
    const imgElemento3 = document.getElementById('modal-imagen-3');
    const videoElemento3 = document.getElementById('modal-video-3');

    if (videoElemento3) {
        videoElemento3.classList.add('hidden');
        videoElemento3.pause();
    }

    if (imgElemento3) {
        imgElemento3.classList.remove('hidden');
        imgElemento3.src = nuevaSrc;
        imgElemento3.style.objectFit = 'contain';
    }
}

// 4. Cambia de imagen - Modal 4 (Independiente) - FUCHSIA
function cambiarImagenPrincipal4(nuevaSrc) {
    const imgElemento4 = document.getElementById('modal-imagen-4');
    const videoElemento4 = document.getElementById('modal-video-4');

    if (videoElemento4) {
        videoElemento4.classList.add('hidden');
        videoElemento4.pause();
    }

    if (imgElemento4) {
        imgElemento4.classList.remove('hidden');
        imgElemento4.src = nuevaSrc;
        imgElemento4.style.objectFit = 'contain';
    }
}

// 5. Cambia de imagen - Modal 5 (Independiente) - FUCHSIA
function cambiarImagenPrincipal5(nuevaSrc) {
    const imgElemento5 = document.getElementById('modal-imagen-5');
    const videoElemento5 = document.getElementById('modal-video-5');

    if (videoElemento5) {
        videoElemento5.classList.add('hidden');
        videoElemento5.pause();
    }

    if (imgElemento5) {
        imgElemento5.classList.remove('hidden');
        imgElemento5.src = nuevaSrc;
        imgElemento5.style.objectFit = 'contain';
    }
}

// 6. Cambia de imagen - Modal 6 (Independiente) - FUCHSIA
function cambiarImagenPrincipal6(nuevaSrc) {
    const imgElemento6 = document.getElementById('modal-imagen-6');
    const videoElemento6 = document.getElementById('modal-video-6');

    if (videoElemento6) {
        videoElemento6.classList.add('hidden');
        videoElemento6.pause();
    }

    if (imgElemento6) {
        imgElemento6.classList.remove('hidden');
        imgElemento6.src = nuevaSrc;
        imgElemento6.style.objectFit = 'contain';
    }
}
/////////////


/////////////
// Reproduce el video del botón - Modal 1 - PINK
function reproducirVideoDelBoton() {
    const botonVideo = document.getElementById('btn-video-modal');
    const urlVideo = botonVideo.getAttribute('data-video-url');

    if (!urlVideo) return;

    const imgElemento = document.getElementById('modal-imagen');
    const videoElemento = document.getElementById('modal-video');
    const videoSource = document.getElementById('modal-video-source');

    imgElemento.classList.add('hidden');
    videoSource.src = urlVideo;
    videoElemento.load();
    
    videoElemento.classList.remove('hidden');
    videoElemento.play().catch(error => {
        console.log("Reproducción automática bloqueada por el navegador.");
        videoElemento.controls = true;
    });
}
// Reproduce el video del botón - Modal 2 (Independiente) - BLUE
function reproducirVideoDelBoton2(botonId = 'btn-video-modal-2') {
    const botonVideo = document.getElementById(botonId);
    const urlVideo = botonVideo ? botonVideo.getAttribute('data-video-url') : null;

    if (!urlVideo) return;

    const imgElemento = document.getElementById('modal-imagen-2');
    const videoElemento = document.getElementById('modal-video-2');
    const videoSource = document.getElementById('modal-video-source-2');

    imgElemento.classList.add('hidden');
    
    if (videoSource) {
        videoSource.src = urlVideo;
    }
    
    if (videoElemento) {
        videoElemento.load();
        videoElemento.classList.remove('hidden');
        videoElemento.play().catch(error => {
            console.log("Reproducción automática bloqueada en modal 2.");
            videoElemento.controls = true;
        });
    }
}

// Reproduce el video del botón - Modal 3 (Independiente) - FUCHSIA
function reproducirVideoDelBoton3(botonId = 'btn-video-modal-3') {
    const botonVideo = document.getElementById(botonId);
    const urlVideo = botonVideo ? botonVideo.getAttribute('data-video-url') : null;

    if (!urlVideo) return;

    const imgElemento = document.getElementById('modal-imagen-3');
    const videoElemento = document.getElementById('modal-video-3');
    const videoSource = document.getElementById('modal-video-source-3');

    imgElemento.classList.add('hidden');
    
    if (videoSource) {
        videoSource.src = urlVideo;
    }
    
    if (videoElemento) {
        videoElemento.load();
        videoElemento.classList.remove('hidden');
        videoElemento.play().catch(error => {
            console.log("Reproducción automática bloqueada en modal 3.");
            videoElemento.controls = true;
        });
    }
}

// Reproduce el video del botón - Modal 4 (Independiente) - FUCHSIA
function reproducirVideoDelBoton4(botonId = 'btn-video-modal-4') {
    const botonVideo = document.getElementById(botonId);
    const urlVideo = botonVideo ? botonVideo.getAttribute('data-video-url') : null;

    if (!urlVideo) return;

    const imgElemento = document.getElementById('modal-imagen-4');
    const videoElemento = document.getElementById('modal-video-4');
    const videoSource = document.getElementById('modal-video-source-4');

    imgElemento.classList.add('hidden');
    
    if (videoSource) {
        videoSource.src = urlVideo;
    }
    
    if (videoElemento) {
        videoElemento.load();
        videoElemento.classList.remove('hidden');
        videoElemento.play().catch(error => {
            console.log("Reproducción automática bloqueada en modal 4.");
            videoElemento.controls = true;
        });
    }
}

// Reproduce el video del botón - Modal 5 (Independiente) - LIME
function reproducirVideoDelBoton5(botonId = 'btn-video-modal-5') {
    const botonVideo = document.getElementById(botonId);
    const urlVideo = botonVideo ? botonVideo.getAttribute('data-video-url') : null;

    if (!urlVideo) return;

    const imgElemento = document.getElementById('modal-imagen-5');
    const videoElemento = document.getElementById('modal-video-5');
    const videoSource = document.getElementById('modal-video-source-5');

    imgElemento.classList.add('hidden');
    
    if (videoSource) {
        videoSource.src = urlVideo;
    }
    
    if (videoElemento) {
        videoElemento.load();
        videoElemento.classList.remove('hidden');
        videoElemento.play().catch(error => {
            console.log("Reproducción automática bloqueada en modal 5.");
            videoElemento.controls = true;
        });
    }
}

// Reproduce el video del botón - Modal 6 (Independiente) - LIME
function reproducirVideoDelBoton6(botonId = 'btn-video-modal-6') {
    const botonVideo = document.getElementById(botonId);
    const urlVideo = botonVideo ? botonVideo.getAttribute('data-video-url') : null;

    if (!urlVideo) return;

    const imgElemento = document.getElementById('modal-imagen-6');
    const videoElemento = document.getElementById('modal-video-6');
    const videoSource = document.getElementById('modal-video-source-6');

    imgElemento.classList.add('hidden');
    
    if (videoSource) {
        videoSource.src = urlVideo;
    }
    
    if (videoElemento) {
        videoElemento.load();
        videoElemento.classList.remove('hidden');
        videoElemento.play().catch(error => {
            console.log("Reproducción automática bloqueada en modal 6.");
            videoElemento.controls = true;
        });
    }
}
///////////////////////


// Cierra cualquier modal y pausa todos los videos activos
function cerrarModalProducto() {
    document.getElementById('producto-modal').classList.add('hidden');
    document.getElementById('producto-modal-2').classList.add('hidden');
    document.getElementById('producto-modal-3').classList.add('hidden');
    document.getElementById('producto-modal-4').classList.add('hidden');
    document.getElementById('producto-modal-5').classList.add('hidden');
    document.getElementById('producto-modal-6').classList.add('hidden');
  
    document.getElementById('producto-modal-overlay').classList.add('hidden');

    const videoElemento1 = document.getElementById('modal-video');
    const videoElemento2 = document.getElementById('modal-video-2');
    const videoElemento3 = document.getElementById('modal-video-3');
    const videoElemento4 = document.getElementById('modal-video-4');
    const videoElemento5 = document.getElementById('modal-video-5');
    const videoElemento6 = document.getElementById('modal-video-6');


    if (videoElemento1) videoElemento1.pause();
    if (videoElemento2) videoElemento2.pause();
    if (videoElemento3) videoElemento3.pause();
    if (videoElemento4) videoElemento4.pause();
    if (videoElemento5) videoElemento5.pause();
    if (videoElemento6) videoElemento6.pause();
    
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

// /////////////////////////////////////////////////




// /////////////////////////////////////////////////
// ======== ZOOM TIPO AMAZON ==========

document.addEventListener("DOMContentLoaded", () => {

    const containers = document.querySelectorAll('.zoomEpic');

    containers.forEach(container => {
        const img = container.querySelector('.zoomPro');

        if (!img) return;

        function actualizarZoom(e, rect) {
            let clientX, clientY;

            if (e.type.startsWith('touch')) {
                clientX = e.targetTouches[0].clientX;
                clientY = e.targetTouches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        }

        // PC
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            actualizarZoom(e, rect);
        });

        container.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(2.5)';
        });

        container.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            img.style.transformOrigin = 'center center';
        });

        // Móvil
        container.addEventListener('touchstart', (e) => {
            img.style.transform = 'scale(2.5)';
            const rect = container.getBoundingClientRect();
            actualizarZoom(e, rect);
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            const rect = container.getBoundingClientRect();
            actualizarZoom(e, rect);
        }, { passive: true });

        container.addEventListener('touchend', () => {
            img.style.transform = 'scale(1)';
            img.style.transformOrigin = 'center center';
        });

    });

});

// /////////////////////////////////////////////////



// /////////////////////////////////////////////////

// ====== POSICIONAR SCROLL DE SECTIONS =========
let isScrolling;

window.addEventListener('wheel', (event) => {
    window.clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {
        const secciones = document.querySelectorAll('.seccion-snap');
        let seccionActual = secciones[0];
        let menorDistancia = Infinity;

        // 1. Detectar en qué sección estamos (basado en el centro de la pantalla)
        const centroPantalla = window.scrollY + (window.innerHeight / 2);

        secciones.forEach((seccion) => {
            const distancia = Math.abs(centroPantalla - (seccion.offsetTop + seccion.offsetHeight / 2));
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                seccionActual = seccion;
            }
        });

        const altoSeccion = seccionActual.offsetHeight;
        const altoPantalla = window.innerHeight;
        const inicioSeccion = seccionActual.offsetTop;
        const finSeccion = inicioSeccion + altoSeccion;

        // 2. Lógica de posicionamiento inteligente
        if (altoSeccion > altoPantalla + 50) {
            // SI LA SECCIÓN ES GRANDE:
            // Si el usuario scrolleó cerca del final, imantamos al fondo.
            if (window.scrollY + altoPantalla > finSeccion - 150) {
                window.scrollTo({ top: finSeccion - altoPantalla, behavior: 'smooth' });
            } 
            // Si está cerca del inicio, imantamos al principio.
            else if (window.scrollY < inicioSeccion + 150) {
                window.scrollTo({ top: inicioSeccion, behavior: 'smooth' });
            }
            // Si está en el medio, NO hacemos nada (lo dejamos leer tranquilo).
        } else {
            // SI LA SECCIÓN ES NORMAL (h-screen):
            window.scrollTo({ top: inicioSeccion, behavior: 'smooth' });
        }
    }, 1000); // 200ms para que sea rápido pero deje terminar el gesto
}, { passive: true });