document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECCIÓN DE ELEMENTOS
    const btnColor = document.getElementById('btn-color');
    const btnMenu = document.getElementById('btn-menu');
    const btnClose = document.getElementById('btn-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const html = document.documentElement;

    // --- LÓGICA MODO OSCURO (UNIFICADA) ---
    // Al cargar la página, aplicamos lo que esté guardado en la memoria
    if (localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
    }

    if (btnColor) {
        btnColor.addEventListener('click', () => {
            html.classList.toggle('dark');
            // Guardamos el estado actual
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // --- LÓGICA MENÚ SÁNDWICH (MÓVIL) ---
    if (btnMenu && mobileMenu) {
        // Abrir menú lateral
        btnMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });

        // Cerrar menú con la "X"
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
            });
        }

        // Cerrar menú si el usuario hace click en cualquier parte fuera del menú
        document.addEventListener('click', (e) => {
            // Si el click NO fue en el menú y NO fue en el botón de hamburguesa...
            if (!mobileMenu.contains(e.target) && !btnMenu.contains(e.target)) {
                mobileMenu.classList.add('translate-x-full');
            }
        });
    }
});