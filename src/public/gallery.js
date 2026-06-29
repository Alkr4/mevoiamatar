document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('galeria-container');
    const spinner = document.getElementById('loading-spinner');

    try {
        const response = await fetch('/api/galleries/public');
        if (!response.ok) throw new Error('Error en la respuesta de la API');

        const responseData = await response.json();
        if (spinner) spinner.remove();

        // Extracción exacta según el JSON del backend del profesor
        const galerias = responseData.data && responseData.data.galleries ? responseData.data.galleries : [];

        if (galerias.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-info shadow-sm border-0 rounded-3 bg-white">
                        <h4 class="alert-heading fw-bold text-secondary mb-2">Conexión con RDS Exitosa</h4>
                        <p class="mb-0 text-muted">La API responde correctamente, pero la tabla <code>galleries</code> no tiene registros públicos creados aún.</p>
                    </div>
                </div>`;
            return;
        }

        galerias.forEach(galeria => {
            // Lógica para interceptar la URL de la foto en S3
            let urlImagen = galeria.image_url || galeria.imageUrl || '';
            
            // Si la URL viene anidada dentro de las fotos de la galería, la sacamos de ahí
            if (!urlImagen && galeria.photos && galeria.photos.length > 0) {
                urlImagen = galeria.photos[0].image_url || galeria.photos[0].imageUrl;
            } else if (!urlImagen && galeria.Photos && galeria.Photos.length > 0) {
                urlImagen = galeria.Photos[0].image_url || galeria.Photos[0].imageUrl;
            }

            // Fallback por si la URL llega vacía para que no se rompa el diseño web
            const srcS3 = urlImagen || 'https://via.placeholder.com/300x200?text=URL+de+S3+No+Encontrada';

            const col = document.createElement('div');
            col.className = 'col';
            
            // HTML Restaurado (¡Con la imagen y el card-body de vuelta!)
            col.innerHTML = `
                <div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden bg-white">
                    <img src="${srcS3}" class="card-img-top galeria-img" alt="${galeria.title || galeria.titulo}">
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-dark text-center mb-1">${galeria.title || galeria.titulo}</h5>
                        <p class="card-text text-muted text-center small">${galeria.description || galeria.descripcion || 'Imagen almacenada en Amazon S3'}</p>
                    </div>
                </div>`;
                
            container.appendChild(col);
        });

    } catch (error) {
        console.error(error);
        if (spinner) spinner.remove();
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger shadow-sm">Error al conectar con la API de la base de datos remota.</div>
            </div>`;
    }
});
