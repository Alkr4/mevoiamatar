import { User } from './User.js';
import { Gallery } from './Gallery.js';
import { Photo } from './Photo.js';

User.hasMany(Gallery, { foreignKey: { name: 'userId', allowNull: false }, as: 'galleries', onDelete: 'CASCADE' });
Gallery.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, as: 'owner' });

Gallery.hasMany(Photo, { foreignKey: { name: 'galleryId', allowNull: false }, as: 'photos', onDelete: 'CASCADE' });
Photo.belongsTo(Gallery, { foreignKey: { name: 'galleryId', allowNull: false }, as: 'gallery' });

export { User, Gallery, Photo };
