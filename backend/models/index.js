



// models/index.js
// import fs from 'fs';
// import path from 'path';
// import { Sequelize } from 'sequelize';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import config from '../config/database.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const db = {};

// const env = process.env.NODE_ENV || 'development';
// const dbConfig = config[env];

// const sequelize = new Sequelize(
//   dbConfig.database,
//   dbConfig.username,
//   dbConfig.password,
//   {
//     host: dbConfig.host,
//     dialect: dbConfig.dialect,
//     logging: false
//   }
// );

// // Chargement explicite des modèles
// const modelFiles = [
//   'user.js',
//   'textile.js',
//   'category.js',
//   'favorite.js',
//   'profile.js'  // Ajout du modèle profile.js
// ];

// // Charger et initialiser chaque modèle
// for (const file of modelFiles) {
//   try {
//     const modelPath = path.join(__dirname, file);
//     const modelModule = await import(`file://${modelPath}`);
//     const initiatedModel = modelModule.default(sequelize, Sequelize.DataTypes);
    
//     db[initiatedModel.name] = initiatedModel;
//   } catch (error) {
//     console.error(`Erreur lors du chargement du modèle ${file}:`, error);
//   }
// }

// // Associations
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;




// models/index.js
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = {};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false
  }
);

// Chargement explicite des modèles
const modelFiles = [
  'user.js',
  'textile.js',
  'category.js',
  'favorite.js', // Ajoutez cette ligne
  'tissu.js'  // Ajoutez cette ligne
];

// Charger et initialiser chaque modèle
for (const file of modelFiles) {
  try {
    const modelPath = path.join(__dirname, file);
    const modelModule = await import(`file://${modelPath}`);
    const initiatedModel = modelModule.default(sequelize, Sequelize.DataTypes);
    
    db[initiatedModel.name] = initiatedModel;
  } catch (error) {
    console.error(`Erreur lors du chargement du modèle ${file}:`, error);
  }
}

// Associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;