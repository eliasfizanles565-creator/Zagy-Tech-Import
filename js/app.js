// Asegúrate de que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('btn-color');

    // Verificamos si el botón existe para que no de error
    if (boton) {
        boton.addEventListener('click', () => {
            // Accedemos directo al elemento raíz
            document.documentElement.classList.toggle('dark');

            // Guardamos en LocalStorage
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Aplicar el tema guardado al cargar
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
});