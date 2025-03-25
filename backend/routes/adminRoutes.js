// // routes/adminRoutes.js
// import express from 'express';
// import { authMiddleware } from '../middleware/auth.js';
// import { adminMiddleware } from '../middleware/adminAuth.js';

// const router = express.Router();

// // Protection double : authentifié + admin
// router.use(authMiddleware);
// router.use(adminMiddleware);

// // Routes admin
// router.get('/users', getAllUsers);
// router.put('/users/:id', updateUser);
// router.delete('/users/:id', deleteUser);

// // Routes de gestion des textiles
// router.post('/textiles', createTextile);
// router.put('/textiles/:id', updateTextile);
// router.delete('/textiles/:id', deleteTextile);

// export default router;





// routes/adminRoutes.js
import express from 'express';
import { 
  getAllUsers, 
  deleteUser, 
  updateUserRole, 
  getUserDetails,
  searchUsers 
} from '../controllers/adminController.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { canManageAdmins } from '../middleware/adminMiddleware.js';
import { validateUserDeletion } from '../middleware/validationMiddleware.js';
import { createAdminUser } from '../controllers/adminController.js';


const router = express.Router();

// Routes admin protégées
router.get('/users', isAdmin, getAllUsers);
router.get('/users/search', isAdmin, searchUsers);
router.get('/users/:userId', isAdmin, getUserDetails);
router.delete('/users/:userId', isAdmin, validateUserDeletion, deleteUser);
router.patch('/users/:userId/role', isAdmin, updateUserRole);
// Dans adminRoutes.js
router.post('/create-admin', canManageAdmins, createAdminUser);

// routes/adminRoutes.js
router.get('/users', isAdmin, getAllUsers);


export default router;