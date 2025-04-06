// routes/textileRoutes.js
import express from 'express';
import { 
  getAllTextiles, 
  getTextileById, 
  getTextileWithTissus,
  createTextile,
  updateTextile,
  deleteTextile
} from '../controllers/textileController.js';





const router = express.Router();

// Routes publiques pour les textiles
router.get('/', getAllTextiles);
router.get('/:id', getTextileById);
router.get('/:id/tissus', getTextileWithTissus);



export default router;