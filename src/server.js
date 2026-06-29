import { app } from './app.js';
import { sequelize } from './config/database.js';
import './models/index.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(env.port, () => {
      console.log(`API Galería de Fotos ejecutándose en http://localhost:${env.port}`);
      console.log(`Base de datos activa: ${env.dbDialect}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
