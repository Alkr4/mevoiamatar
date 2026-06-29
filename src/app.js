import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "upgrade-insecure-requests": null, // Desactiva forzar HTTPS en desarrollo
        
        // Permitir scripts del CDN de Bootstrap
        "script-src": ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        
        // Permitir eventos onclick en el HTML (script-src-attr)
        "script-src-attr": ["'unsafe-inline'"],
        
        // Añadir Unsplash a la lista blanca de imágenes para los datos de prueba
        "img-src": [
          "'self'", 
          "data:", 
          "https://*.amazonaws.com", 
          "http://*.amazonaws.com",
          "https://images.unsplash.com"
        ]
      },
    },
  })
);
app.use(cors({ origin: env.frontendUrl === '*' ? '*' : env.frontendUrl }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, './public')));
app.use('/uploads', express.static(path.resolve(process.cwd(), env.uploadDir)));


app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
