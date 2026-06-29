import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Gallery = sequelize.define('Gallery', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  visibility: { type: DataTypes.ENUM('public', 'private'), allowNull: false, defaultValue: 'private' }
}, { tableName: 'galleries' });
