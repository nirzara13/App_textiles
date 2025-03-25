// routes/compositionRoutes.js
import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Controller for compositions (inline function definitions)
const compositionController = {
  getAllCompositions: async (req, res) => {
    try {
      const compositions = await db.sequelize.query(
        `SELECT * FROM compositions`,
        { type: db.sequelize.QueryTypes.SELECT }
      );
      
      return res.json({
        success: true,
        compositions
      });
    } catch (error) {
      console.error('Error getting compositions:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving compositions'
      });
    }
  },

  getCompositionsByTissuId: async (req, res) => {
    try {
      const { tissuId } = req.params;
      
      const compositions = await db.sequelize.query(
        `SELECT c.*, t.name as textile_name 
         FROM compositions c
         JOIN textiles t ON c.textile_id = t.id
         WHERE c.tissu_id = ?`,
        { 
          replacements: [tissuId],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      return res.json({
        success: true,
        compositions
      });
    } catch (error) {
      console.error('Error getting compositions by tissu ID:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving compositions'
      });
    }
  },
  
  createComposition: async (req, res) => {
    try {
      const { tissu_id, textile_id, percentage } = req.body;
      
      // Validate percentage
      if (percentage < 0 || percentage > 100) {
        return res.status(400).json({
          success: false,
          message: 'Percentage must be between 0 and 100'
        });
      }
      
      // Check if tissu exists
      const [tissu] = await db.sequelize.query(
        `SELECT * FROM tissus WHERE id = ?`,
        { 
          replacements: [tissu_id],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      if (!tissu) {
        return res.status(404).json({
          success: false,
          message: 'Tissu not found'
        });
      }
      
      // Check if textile exists
      const [textile] = await db.sequelize.query(
        `SELECT * FROM textiles WHERE id = ?`,
        { 
          replacements: [textile_id],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      if (!textile) {
        return res.status(404).json({
          success: false,
          message: 'Textile not found'
        });
      }
      
      // Create composition
      const [result] = await db.sequelize.query(
        `INSERT INTO compositions (tissu_id, textile_id, percentage)
         VALUES (?, ?, ?)`,
        { 
          replacements: [tissu_id, textile_id, percentage],
          type: db.sequelize.QueryTypes.INSERT 
        }
      );
      
      const compositionId = result;
      
      const [newComposition] = await db.sequelize.query(
        `SELECT * FROM compositions WHERE id = ?`,
        { 
          replacements: [compositionId],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      return res.status(201).json({
        success: true,
        message: 'Composition created successfully',
        composition: newComposition
      });
    } catch (error) {
      console.error('Error creating composition:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating the composition'
      });
    }
  },
  
  updateComposition: async (req, res) => {
    try {
      const { id } = req.params;
      const { percentage } = req.body;
      
      // Validate percentage
      if (percentage < 0 || percentage > 100) {
        return res.status(400).json({
          success: false,
          message: 'Percentage must be between 0 and 100'
        });
      }
      
      // Check if composition exists
      const [composition] = await db.sequelize.query(
        `SELECT * FROM compositions WHERE id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      if (!composition) {
        return res.status(404).json({
          success: false,
          message: 'Composition not found'
        });
      }
      
      // Update composition
      await db.sequelize.query(
        `UPDATE compositions SET percentage = ? WHERE id = ?`,
        { 
          replacements: [percentage, id],
          type: db.sequelize.QueryTypes.UPDATE 
        }
      );
      
      const [updatedComposition] = await db.sequelize.query(
        `SELECT * FROM compositions WHERE id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      return res.json({
        success: true,
        message: 'Composition updated successfully',
        composition: updatedComposition
      });
    } catch (error) {
      console.error('Error updating composition:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the composition'
      });
    }
  },
  
  deleteComposition: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if composition exists
      const [composition] = await db.sequelize.query(
        `SELECT * FROM compositions WHERE id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      if (!composition) {
        return res.status(404).json({
          success: false,
          message: 'Composition not found'
        });
      }
      
      // Delete composition
      await db.sequelize.query(
        `DELETE FROM compositions WHERE id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.DELETE 
        }
      );
      
      return res.json({
        success: true,
        message: 'Composition deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting composition:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the composition'
      });
    }
  }
};



// Public routes
router.get('/', compositionController.getAllCompositions);
router.get('/tissu/:tissuId', compositionController.getCompositionsByTissuId);


export default router;