import { sequelize } from '../config/database.js';
import '../models/index.js';
import { User, Gallery, Photo } from '../models/index.js';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });

    const admin = await User.create({
      name: 'Administrador Demo',
      email: 'admin@demo.cl',
      password: 'Admin123',
      role: 'admin'
    });

    const user = await User.create({
      name: 'Usuario Demo',
      email: 'usuario@demo.cl',
      password: 'User1234',
      role: 'user'
    });

    const publicGallery = await Gallery.create({
      title: 'Galería pública de prueba',
      description: 'Esta galería puede ser vista por cualquier visitante.',
      visibility: 'public',
      userId: user.id
    });

    const privateGallery = await Gallery.create({
      title: 'Galería privada de prueba',
      description: 'Esta galería solo puede ser vista por su dueño.',
      visibility: 'private',
      userId: user.id
    });

    await Photo.bulkCreate([
      {
        title: 'Montaña',
        description: 'Imagen pública de ejemplo.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        galleryId: publicGallery.id
      },
      {
        title: 'Ciudad',
        description: 'Otra imagen pública de ejemplo.',
        imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
        galleryId: publicGallery.id
      },
      {
        title: 'Foto privada',
        description: 'Imagen privada de ejemplo.',
        imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        galleryId: privateGallery.id
      }
    ]);

    console.log('Seed ejecutado correctamente');
    console.log('Admin: admin@demo.cl / Admin123');
    console.log('Usuario: usuario@demo.cl / User1234');
    process.exit(0);
  } catch (error) {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  }
};

seed();
