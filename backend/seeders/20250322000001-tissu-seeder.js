'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tissus', [
      {
        textile_id: 1, // Polyester
        name: 'Polyester Microfibre',
        weave_type: 'Toile',
        description: 'Tissu en polyester à fibres ultra-fines, doux au toucher et très respirant.',
        image_url: '/src/assets/polyester-microfibre.jpg',
        recommended_use: 'Vêtements de sport, t-shirts techniques, doublures',
        care_instructions: 'Lavage en machine à 30°C, ne pas utiliser d\'adoucissant, séchage rapide',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        textile_id: 1, // Polyester
        name: 'Polyester Sergé',
        weave_type: 'Sergé',
        description: 'Tissu en polyester avec une armure sergé donnant un aspect diagonal distinctif.',
        image_url: '/src/assets/polyester-serge.jpg',
        recommended_use: 'Vêtements de travail, uniforms, pantalons',
        care_instructions: 'Lavage en machine à 40°C, repassage à basse température',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        textile_id: 2, // Nylon
        name: 'Nylon Ripstop',
        weave_type: 'Toile',
        description: 'Tissu en nylon léger avec renforcement en grille pour la résistance à la déchirure.',
        image_url: '/src/assets/nylon-ripstop.jpg',
        recommended_use: 'Équipement outdoor, sacs à dos, parapluies, vêtements techniques',
        care_instructions: 'Lavage à la main ou en machine à 30°C, ne pas sécher en machine',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        textile_id: 3, // Laine
        name: 'Laine Mérinos',
        weave_type: 'Sergé',
        description: 'Tissu en laine fine de moutons mérinos, particulièrement doux et isolant.',
        image_url: '/src/assets/laine-merinos.jpg',
        recommended_use: 'Pulls, écharpes, sous-vêtements thermiques, vêtements hiver',
        care_instructions: 'Lavage à la main à l\'eau froide ou programme laine, séchage à plat',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        textile_id: 4, // Soie
        name: 'Soie Satin',
        weave_type: 'Satin',
        description: 'Tissu en soie avec une armure satin créant une surface lisse et brillante.',
        image_url: '/src/assets/soie-satin.jpg',
        recommended_use: 'Robes de soirée, lingerie, doublures luxueuses',
        care_instructions: 'Nettoyage à sec recommandé, ou lavage à la main à froid',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        textile_id: 5, // Kevlar
        name: 'Kevlar Toile',
        weave_type: 'Toile',
        description: 'Tissu en fibres de Kevlar avec une armure toile pour une résistance maximale.',
        image_url: '/src/assets/kevlar-toile.jpg',
        recommended_use: 'Équipements de protection, gants résistants, renforts techniques',
        care_instructions: 'Lavage à la main uniquement, séchage à l\'air libre, pas de repassage',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        textile_id: 6, // Gore-Tex
        name: 'Gore-Tex Pro',
        weave_type: 'Toile',
        description: 'Tissu Gore-Tex professionnel avec membrane imperméable et respirante.',
        image_url: '/src/assets/gore-tex-pro.jpg',
        recommended_use: 'Vêtements outdoor haut de gamme, vestes techniques, équipement de montagne',
        care_instructions: 'Lavage en machine à 30°C avec détergent doux, pas d\'adoucissant, réactiver l\'imperméabilisation après lavage',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tissus', null, {});
  }
};