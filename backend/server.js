// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import userRoutes from './routes/userRoutes.js';
import winston from 'winston';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import databaseConfig from './config/database.js';
import profileRoutes from './routes/profileRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
dotenv.config();
import profileDetailRoutes from './routes/profileDetailRoutes.js';
import textileRoutes from './routes/textileRoutes.js';

import tissuRoutes from './routes/tissuRoutes.js';
import compositionRoutes from './routes/compositionRoutes.js';

import session from 'express-session';
import cookieParser from 'cookie-parser';
import contactRoutes from './routes/contactRoutes.js';
import crypto from 'crypto';







// Configuration du logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();

// Configuration de base
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
app.use(bodyParser.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Ajouter après les autres middlewares (après app.use(cors(corsOptions)))
app.use(cookieParser());

// Utilise la configuration de la base de données depuis database.js
const env = process.env.NODE_ENV || 'development';
const dbConfig = databaseConfig[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging
  }
);


app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 60 * 60 * 1000 // 30 minutes
  }
}));

// Routes API
app.use('/api/users', userRoutes);

app.use('/api/profile', profileRoutes);
app.use('/api/tissus', tissuRoutes);
app.use('/api/compositions', compositionRoutes);
app.use('/api', contactRoutes);


// Configuration des routes
app.use('/api/profile', profileRoutes);
app.use('/api/user-profile', profileRoutes); // Ajoutez cette ligne comme alias
app.use('/api/profile-details', profileDetailRoutes);
app.use('/api/users/favorites', favoriteRoutes);
app.use('/api/textiles', textileRoutes);


// Middleware d'erreur
app.use((err, req, res, next) => {
  logger.error('Erreur:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Une erreur est survenue'
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('Connexion à la base de données établie avec succès.');
    
    await sequelize.sync();
    logger.info('Base de données synchronisée avec succès.');

    app.listen(PORT, () => {
      logger.info(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();

export default app;