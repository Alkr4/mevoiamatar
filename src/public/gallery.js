// ====== GESTIÓN DE SESIÓN Y CIBERSEGURIDAD ======
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const logout = () => { localStorage.removeItem('token'); location.reload(); };

document.addEventListener('DOMContentLoaded', () => {
    actualizarNavbar();
    mostrarSeccion('publicas'); // Por defecto carga las públicas

    // Eventos de Formularios
    document.getElementById('form-login').addEventListener('submit', handleLogin);
    document.getElementById('form-register').addEventListener('submit', handleRegister);
    document.getElementById('form-galeria').addEventListener('submit', handleCrearGaleria);
    document.getElementById('form-photo').addEventListener('submit', handleAñadirFoto);
});

// ====== RENDERIZADO DE INTERFAZ ======
function actualizarNavbar() {
    const navButtons = document.getElementById('nav-buttons');
    const controles = document.getElementById('dashboard-controls');
    
    if (getToken()) {
        navButtons.innerHTML = `<button class="btn btn-outline-light btn-sm" onclick="logout()">Cerrar Sesión</button>`;
        controles.classList.remove('hidden');
    } else {
        navButtons.innerHTML = `
            <button class="btn btn-outline-light btn-sm me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Ingresar</button>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#registerModal">Registro</button>`;
        controles.classList.add('hidden');
    }
}

function mostrarSeccion(seccion) {
    const contenedor = document.getElementById('galeria-container');
    const titulo = document.getElementById('seccion-titulo');
    contenedor.innerHTML = '<div class="spinner-border text-primary mx-auto mt-5"></div>';
    
    if (seccion === 'publicas') {
        titulo.innerText = 'Galerías Públicas';
        cargarGalerias('/api/galleries/public', false);
    } else if (seccion === 'mis-galerias') {
        titulo.innerText = 'Mi Panel de Galerías Privadas';
        cargarGalerias('/api/galleries/my', true);
    }
}

// ====== LÓGICA CRUD API ======

async function cargarGalerias(url, esPrivado) {
    const container = document.getElementById('galeria-container');
    const cabeceras = esPrivado ? { 'Authorization': `Bearer ${getToken()}` } : {};

    try {
        const res = await fetch(url, { headers: cabeceras });
        const resData = await res.json();
        const galerias = resData.data.galleries || [];

        container.innerHTML = '';
        if (galerias.length === 0) {
            container.innerHTML = `<div class="alert alert-info w-100 text-center">No hay galerías para mostrar.</div>`;
            return;
        }

        galerias.forEach(gal => {
            // Buscamos la URL de la primera foto (similar a tu lógica anterior)
            let srcS3 = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
            if (gal.photos && gal.photos.length > 0) srcS3 = gal.photos[0].imageUrl;

            // Renderizado de Tarjeta
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card h-100 shadow-sm border-0 rounded-3">
                    <img src="${srcS3}" class="card-img-top galeria-img" alt="${gal.title}">
                    <div class="card-body text-center">
                        <h5 class="fw-bold">${gal.title}</h5>
                        <p class="text-muted small">${gal.description}</p>
                        <span class="badge ${gal.visibility === 'public' ? 'bg-success' : 'bg-secondary'} mb-3">${gal.visibility}</span>
                        ${esPrivado ? `
                            <button class="btn btn-info btn-sm w-100 mb-2 text-white fw-bold" onclick="abrirGaleria(${gal.id})">📂 Gestionar Fotos</button>
                            <button class="btn btn-outline-danger btn-sm w-100" onclick="borrarGaleria(${gal.id})">🗑️ Eliminar Galería</button>
                        ` : ''}
                    </div>
                </div>`;
            container.appendChild(col);
        });
    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger w-100 text-center">Error cargando los datos.</div>`;
    }
}

// ====== AUTENTICACIÓN ======

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (data.success) {
        setToken(data.data.token);
        location.reload();
    } else {
        alert(data.message || 'Error al iniciar sesión');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    
    const data = await res.json();
    if (data.success) {
        setToken(data.data.token);
        location.reload();
    } else {
        alert('Error en registro: Verifica los datos.');
    }
}

// ====== CREAR Y BORRAR (PROTEGIDO) ======

async function handleCrearGaleria(e) {
    e.preventDefault();
    const title = document.getElementById('gal-titulo').value;
    const description = document.getElementById('gal-desc').value;
    const visibility = document.getElementById('gal-visibilidad').value;

    const res = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ title, description, visibility })
    });

    if (res.ok) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('crearGaleriaModal'));
        modal.hide();
        mostrarSeccion('mis-galerias'); // Recarga la vista
    } else {
        alert('Error al crear galería');
    }
}

async function borrarGaleria(id) {
    if (!confirm('¿Seguro que deseas eliminar esta galería y todas sus fotos?')) return;

    const res = await fetch(`/api/galleries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (res.ok) {
        mostrarSeccion('mis-galerias'); // Recarga la vista tras borrar
    } else {
        alert('No tienes permiso para borrar esta galería');
    }
}

// ==========================================
// CRUD DE FOTOS DENTRO DE UNA GALERÍA
// ==========================================

async function abrirGaleria(galleryId) {
    const res = await fetch(`/api/galleries/${galleryId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    
    if (!data.success) return alert('Error cargando la galería');
    
    const galeria = data.data.gallery;
    document.getElementById('detalle-titulo').innerText = galeria.title;
    document.getElementById('photo-gallery-id').value = galeria.id; // Guardamos el ID para el formulario
    
    renderizarFotos(galeria);

    // Ocultar vista principal, mostrar detalle
    document.getElementById('galeria-container').classList.add('hidden');
    document.getElementById('dashboard-controls').classList.add('hidden');
    document.getElementById('seccion-titulo').classList.add('hidden');
    document.getElementById('detalle-vista').classList.remove('hidden');
}

function renderizarFotos(galeria) {
    const container = document.getElementById('fotos-container');
    container.innerHTML = '';
    
    if (!galeria.photos || galeria.photos.length === 0) {
        container.innerHTML = '<div class="alert alert-info w-100 text-center">No hay fotos en esta galería. ¡Añade la primera!</div>';
        return;
    }
    
    galeria.photos.forEach(foto => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 rounded-3">
                <img src="${foto.imageUrl || foto.image_url}" class="card-img-top galeria-img" alt="${foto.title}">
                <div class="card-body p-3 text-center">
                    <h6 class="fw-bold mb-1">${foto.title}</h6>
                    <button class="btn btn-sm btn-outline-danger w-100 mt-3" onclick="borrarFoto(${galeria.id}, ${foto.id})">🗑️ Eliminar Foto</button>
                </div>
            </div>`;
        container.appendChild(col);
    });
}

function volverDashboard() {
    document.getElementById('detalle-vista').classList.add('hidden');
    document.getElementById('galeria-container').classList.remove('hidden');
    document.getElementById('dashboard-controls').classList.remove('hidden');
    document.getElementById('seccion-titulo').classList.remove('hidden');
    mostrarSeccion('mis-galerias'); // Refresca las portadas
}

async function handleAñadirFoto(e) {
    e.preventDefault();
    const galleryId = document.getElementById('photo-gallery-id').value;
    const title = document.getElementById('photo-title').value;
    const description = document.getElementById('photo-desc').value;
    const file = document.getElementById('photo-file').files[0];
    const url = document.getElementById('photo-url').value;

    if (!file && !url) return alert('Debes seleccionar un archivo o proveer una URL.');

    // Usamos FormData para soportar la subida de archivos binarios (Multer en el Backend)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) formData.append('image', file);
    if (url) formData.append('imageUrl', url);

    const res = await fetch(`/api/galleries/${galleryId}/photos`, {
        method: 'POST',
        headers: { 
            // OJO: No se pone 'Content-Type' aquí, el navegador lo calcula automático por el FormData
            'Authorization': `Bearer ${getToken()}` 
        },
        body: formData
    });

    if (res.ok) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPhotoModal'));
        modal.hide();
        document.getElementById('form-photo').reset();
        abrirGaleria(galleryId); // Recarga las fotos
    } else {
        const err = await res.json();
        alert('Error al subir foto: ' + (err.message || 'Datos inválidos'));
    }
}

async function borrarFoto(galleryId, photoId) {
    if (!confirm('¿Seguro que deseas eliminar esta foto de la galería?')) return;

    const res = await fetch(`/api/galleries/${galleryId}/photos/${photoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (res.ok) {
        abrirGaleria(galleryId); // Recarga la vista de fotos
    } else {
        alert('Error al intentar borrar la foto.');
    }
}