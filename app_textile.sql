-- Création de la base de données
CREATE DATABASE IF NOT EXISTS textile_app;
USE textile_app;

-- Table des utilisateurs
-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    refreshToken VARCHAR(1024),
    last_activity TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (name)
);

-- Table des textiles
CREATE TABLE IF NOT EXISTS textiles (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    image_url VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table des tissus
CREATE TABLE IF NOT EXISTS tissus (
    id INT NOT NULL AUTO_INCREMENT,
    textile_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    weave_type ENUM('Sergé', 'Satin', 'Toile', 'Croisé', 'Bouclé') NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    recommended_use TEXT,
    care_instructions TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (textile_id) REFERENCES textiles(id) ON DELETE CASCADE
);

-- Table de composition (relation entre tissus et textiles avec pourcentage)
CREATE TABLE IF NOT EXISTS compositions (
    id INT NOT NULL AUTO_INCREMENT,
    tissu_id INT NOT NULL,
    textile_id INT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (tissu_id) REFERENCES tissus(id) ON DELETE CASCADE,
    FOREIGN KEY (textile_id) REFERENCES textiles(id) ON DELETE CASCADE
);

-- Table des favoris utilisateurs
CREATE TABLE IF NOT EXISTS favorites (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    textile_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    usage_context TEXT,
    frequency_of_use ENUM('Rarement', 'Occasionnellement', 'Régulièrement', 'Fréquemment') DEFAULT 'Occasionnellement',
    personal_notes TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (textile_id) REFERENCES textiles(id) ON DELETE SET NULL
);

-- Insertion des données de base pour les catégories
INSERT INTO categories (id, name) VALUES
(1, 'Fibres Synthétiques'),
(2, 'Fibres Animales'),
(3, 'Matériaux Techniques');

-- Insertion des données pour les textiles
INSERT INTO textiles (id, name, description, category_id, image_url) VALUES
(1, 'Polyester', 'Fibre synthétique très utilisée dans l\'industrie textile', 1, '/src/assets/polyester.jpg'),
(2, 'Nylon', 'Matière durable et résistante, souvent utilisée pour les vêtements techniques', 1, '/src/assets/nylon.jpg'),
(3, 'Laine', 'Fibre naturelle provenant du pelage des moutons', 2, '/src/assets/laine.jpg'),
(4, 'Soie', 'Fibre naturelle luxueuse produite par les vers à soie', 2, '/src/assets/soie.jpg'),
(5, 'Kevlar', 'Fibre synthétique très résistante utilisée dans les gilets pare-balles', 3, '/src/assets/kevlar.jpg'),
(6, 'Gore-Tex', 'Membrane imperméable et respirante utilisée dans les vêtements outdoor', 3, '/src/assets/gore-tex.jpg');

-- Insertion des données pour les tissus
INSERT INTO tissus (id, textile_id, name, weave_type, description, image_url, recommended_use, care_instructions) VALUES
(1, 1, 'Polyester Microfibre', 'Toile', 'Tissu en polyester à fibres ultra-fines, doux au toucher et très respirant.', '/src/assets/polyester-microfibre.jpg', 'Vêtements de sport, t-shirts techniques, doublures', 'Lavage en machine à 30°C, ne pas utiliser d\'adoucissant, séchage rapide'),
(2, 1, 'Polyester Sergé', 'Sergé', 'Tissu en polyester avec une armure sergé donnant un aspect diagonal distinctif.', '/src/assets/polyester-serge.jpg', 'Vêtements de travail, uniforms, pantalons', 'Lavage en machine à 40°C, repassage à basse température'),
(3, 2, 'Nylon Ripstop', 'Toile', 'Tissu en nylon léger avec renforcement en grille pour la résistance à la déchirure.', '/src/assets/nylon-ripstop.jpg', 'Équipement outdoor, sacs à dos, parapluies, vêtements techniques', 'Lavage à la main ou en machine à 30°C, ne pas sécher en machine'),
(4, 3, 'Laine Mérinos', 'Sergé', 'Tissu en laine fine de moutons mérinos, particulièrement doux et isolant.', '/src/assets/laine-merinos.jpg', 'Pulls, écharpes, sous-vêtements thermiques, vêtements hiver', 'Lavage à la main à l\'eau froide ou programme laine, séchage à plat'),
(5, 4, 'Soie Satin', 'Satin', 'Tissu en soie avec une armure satin créant une surface lisse et brillante.', '/src/assets/soie-satin.jpg', 'Robes de soirée, lingerie, doublures luxueuses', 'Nettoyage à sec recommandé, ou lavage à la main à froid'),
(6, 5, 'Kevlar Toile', 'Toile', 'Tissu en fibres de Kevlar avec une armure toile pour une résistance maximale.', '/src/assets/kevlar-toile.jpg', 'Équipements de protection, gants résistants, renforts techniques', 'Lavage à la main uniquement, séchage à l\'air libre, pas de repassage'),
(7, 6, 'Gore-Tex Pro', 'Toile', 'Tissu Gore-Tex professionnel avec membrane imperméable et respirante.', '/src/assets/gore-tex-pro.jpg', 'Vêtements outdoor haut de gamme, vestes techniques, équipement de montagne', 'Lavage en machine à 30°C avec détergent doux, pas d\'adoucissant, réactiver l\'imperméabilisation après lavage');

-- Insertion des données pour les compositions
INSERT INTO compositions (id, tissu_id, textile_id, percentage) VALUES
(1, 1, 1, 100.00),
(2, 2, 1, 100.00),
(3, 3, 2, 90.00),
(4, 3, 1, 10.00),
(5, 4, 3, 95.00),
(6, 4, 1, 5.00),
(7, 5, 4, 100.00),
(8, 6, 5, 85.00),
(9, 6, 2, 15.00),
(10, 7, 6, 70.00),
(11, 7, 2, 30.00);