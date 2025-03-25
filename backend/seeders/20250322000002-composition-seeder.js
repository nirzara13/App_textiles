'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('compositions', [
      // Polyester Microfibre
      {
        tissu_id: 1, 
        textile_id: 1, // Polyester
        percentage: 100.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Polyester Sergé
      {
        tissu_id: 2, 
        textile_id: 1, // Polyester
        percentage: 100.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Nylon Ripstop
      {
        tissu_id: 3, 
        textile_id: 2, // Nylon
        percentage: 90.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tissu_id: 3, 
        textile_id: 1, // Polyester (renforcement)
        percentage: 10.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Laine Mérinos
      {
        tissu_id: 4, 
        textile_id: 3, // Laine
        percentage: 95.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tissu_id: 4, 
        textile_id: 1, // Polyester (mélange)
        percentage: 5.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Soie Satin
      {
        tissu_id: 5, 
        textile_id: 4, // Soie
        percentage: 100.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Kevlar Toile
      {
        tissu_id: 6, 
        textile_id: 5, // Kevlar
        percentage: 85.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tissu_id: 6, 
        textile_id: 2, // Nylon (renforcement)
        percentage: 15.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Gore-Tex Pro
      {
        tissu_id: 7, 
        textile_id: 6, // Gore-Tex
        percentage: 70.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tissu_id: 7, 
        textile_id: 2, // Nylon (support)
        percentage: 30.00,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('compositions', null, {});
  }
};