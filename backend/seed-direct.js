// seed-direct.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Récupérer le chemin du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function insertData() {
  // Paramètres de connexion
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'textile_app',
    port: process.env.DB_PORT || 3306
  };

  console.log('Tentative de connexion avec:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port
  });

  let connection;
  try {
    // Créer une connexion
    connection = await mysql.createConnection(dbConfig);
    console.log('Connexion réussie à la base de données');

    // Insérer les tissus - en utilisant uniquement les colonnes qui existent réellement
    console.log('Insertion des tissus...');
    await connection.execute(`
      INSERT INTO tissus (textile_id, name, weave_type, description, image_url, recommended_use, care_instructions)
      VALUES 
        (1, 'Polyester Microfibre', 'Toile', 'Tissu en polyester à fibres ultra-fines, doux au toucher et très respirant.', '/src/assets/polyester-microfibre.jpg', 'Vêtements de sport, t-shirts techniques, doublures', 'Lavage en machine à 30°C, ne pas utiliser d\\'adoucissant, séchage rapide'),
        (1, 'Polyester Sergé', 'Sergé', 'Tissu en polyester avec une armure sergé donnant un aspect diagonal distinctif.', '/src/assets/polyester-serge.jpg', 'Vêtements de travail, uniforms, pantalons', 'Lavage en machine à 40°C, repassage à basse température'),
        (2, 'Nylon Ripstop', 'Toile', 'Tissu en nylon léger avec renforcement en grille pour la résistance à la déchirure.', '/src/assets/nylon-ripstop.jpg', 'Équipement outdoor, sacs à dos, parapluies, vêtements techniques', 'Lavage à la main ou en machine à 30°C, ne pas sécher en machine'),
        (3, 'Laine Mérinos', 'Sergé', 'Tissu en laine fine de moutons mérinos, particulièrement doux et isolant.', '/src/assets/laine-merinos.jpg', 'Pulls, écharpes, sous-vêtements thermiques, vêtements hiver', 'Lavage à la main à l\\'eau froide ou programme laine, séchage à plat'),
        (4, 'Soie Satin', 'Satin', 'Tissu en soie avec une armure satin créant une surface lisse et brillante.', '/src/assets/soie-satin.jpg', 'Robes de soirée, lingerie, doublures luxueuses', 'Nettoyage à sec recommandé, ou lavage à la main à froid'),
        (5, 'Kevlar Toile', 'Toile', 'Tissu en fibres de Kevlar avec une armure toile pour une résistance maximale.', '/src/assets/kevlar-toile.jpg', 'Équipements de protection, gants résistants, renforts techniques', 'Lavage à la main uniquement, séchage à l\\'air libre, pas de repassage'),
        (6, 'Gore-Tex Pro', 'Toile', 'Tissu Gore-Tex professionnel avec membrane imperméable et respirante.', '/src/assets/gore-tex-pro.jpg', 'Vêtements outdoor haut de gamme, vestes techniques, équipement de montagne', 'Lavage en machine à 30°C avec détergent doux, pas d\\'adoucissant, réactiver l\\'imperméabilisation après lavage')
    `);
    console.log('Tissus insérés avec succès');

    // Insérer les compositions - en utilisant uniquement les colonnes qui existent réellement
    console.log('Insertion des compositions...');
    await connection.execute(`
      INSERT INTO compositions (tissu_id, textile_id, percentage)
      VALUES 
        (1, 1, 100.00),
        (2, 1, 100.00),
        (3, 2, 90.00),
        (3, 1, 10.00),
        (4, 3, 95.00),
        (4, 1, 5.00),
        (5, 4, 100.00),
        (6, 5, 85.00),
        (6, 2, 15.00),
        (7, 6, 70.00),
        (7, 2, 30.00)
    `);
    console.log('Compositions insérées avec succès');

    console.log('Toutes les données ont été insérées avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error);
    
    // Gestion d'erreur détaillée
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Accès refusé - veuillez vérifier votre nom d\'utilisateur et mot de passe de base de données');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('La base de données n\'existe pas - veuillez vérifier le nom de votre base de données');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connexion refusée - veuillez vérifier si votre serveur de base de données est en cours d\'exécution');
    } else if (error.code === 'ER_DUP_ENTRY') {
      console.error('Entrée en double - ces données existent peut-être déjà dans la base de données');
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      console.error('Erreur de clé étrangère - une référence n\'existe pas dans la table parente');
      console.error('Assurez-vous que les IDs textile_id et tissu_id existent dans leurs tables respectives');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion fermée');
    }
  }
}

insertData();