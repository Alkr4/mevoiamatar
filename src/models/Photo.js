import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Photo = sequelize.define('Photo', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  filename: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'photos' });
