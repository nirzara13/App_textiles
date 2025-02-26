// import bcrypt from 'bcrypt';
// import User from '../models/user.js';

// // Fonction d'inscription
// const inscrireUtilisateur = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log('Demande d\'inscription reçue avec email:', email);

//     const utilisateurExistant = await User.findOne({ where: { email } });
//     if (utilisateurExistant) {
//       console.log('Utilisateur déjà existant:', utilisateurExistant);
//       return res.status(400).json({ message: 'Utilisateur déjà existant' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log('Mot de passe hashé:', hashedPassword);

//     const utilisateur = await User.create({
//       email,
//       mot_de_passe: hashedPassword,
//     });
//     console.log('Utilisateur créé:', utilisateur);

//     res.status(201).json({ message: 'Utilisateur créé avec succès', utilisateur });
//   } catch (error) {
//     console.error('Erreur lors de l\'inscription :', error);
//     res.status(500).json({ message: 'Erreur serveur', error: error.message });
//   }
// };

// // Fonction de connexion
// const connecterUtilisateur = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log('Demande de connexion reçue avec email:', email);

//     const utilisateur = await User.findOne({ where: { email } });
//     if (!utilisateur) {
//       console.log('Utilisateur non trouvé');
//       return res.status(400).json({ message: 'Utilisateur non trouvé' });
//     }

//     const motDePasseValide = await bcrypt.compare(password, utilisateur.mot_de_passe);
//     if (!motDePasseValide) {
//       console.log('Mot de passe incorrect');
//       return res.status(400).json({ message: 'Mot de passe incorrect' });
//     }

//     console.log('Connexion réussie pour l\'utilisateur:', utilisateur);
//     res.status(200).json({ message: 'Connexion réussie', utilisateur });
//   } catch (error) {
//     console.error('Erreur lors de la connexion :', error);
//     res.status(500).json({ message: 'Erreur serveur', error: error.message });
//   }
// };

// // Fonction pour récupérer les informations de l'utilisateur
// const getProfile = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const utilisateur = await User.findByPk(userId);
//     if (!utilisateur) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     res.status(200).json({ utilisateur });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// // Fonction pour mettre à jour les informations de l'utilisateur
// const updateProfile = async (req, res) => {
//   const { userId } = req.params;
//   const { email, password } = req.body;

//   try {
//     const utilisateur = await User.findByPk(userId);
//     if (!utilisateur) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     if (email) {
//       utilisateur.email = email;
//     }

//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       utilisateur.mot_de_passe = hashedPassword;
//     }

//     await utilisateur.save();
//     res.status(200).json({ message: 'Profil mis à jour avec succès', utilisateur });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// // Fonction pour supprimer un compte utilisateur
// const deleteProfile = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const utilisateur = await User.findByPk(userId);
//     if (!utilisateur) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     await utilisateur.destroy();
//     res.status(200).json({ message: 'Compte supprimé avec succès' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// export { inscrireUtilisateur, connecterUtilisateur, getProfile, updateProfile, deleteProfile };

// controllers/userController.js
import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification si l'utilisateur existe
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Création de l'utilisateur
    const user = await db.User.create({
      email,
      password // Le hash est géré par le hook beforeCreate dans le modèle
    });

    // Génération du token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Génération du token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: db.Textile,
        as: 'favorites',
        through: { attributes: [] },
        include: [{
          model: db.Category,
          attributes: ['name']
        }]
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const userId = req.userId; // Assurez-vous que le middleware d'authentification définit bien userId

    console.log('Requête de mise à jour reçue :', { 
      userId, 
      email, 
      newPasswordProvided: !!newPassword 
    });

    // Trouver l'utilisateur
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour l'email
    if (email && email !== user.email) {
      user.email = email;
    }

    // Mettre à jour le mot de passe si un nouveau est fourni
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Sauvegarder les modifications
    await user.save();

    console.log('Profil mis à jour avec succès');

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'Compte supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du compte'
    });
  }
};

// dans userController.js
export const getFavorites = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId, {
      include: [{
        model: db.Textile,
        as: 'favoritedTextiles', // Utilisez le nouvel alias ici
        through: { attributes: [] },
        include: [{
          model: db.Category,
          attributes: ['name']
        }]
      }]
    });

    res.json({
      success: true,
      favorites: user.favoritedTextiles // Utilisez le nouvel alias ici
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des favoris'
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { textileId } = req.params;
    const user = await db.User.findByPk(req.userId);
    await user.addFavorite(textileId);

    res.json({
      success: true,
      message: 'Favori ajouté avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du favori'
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { textileId } = req.params;
    const user = await db.User.findByPk(req.userId);
    await user.removeFavorite(textileId);

    res.json({
      success: true,
      message: 'Favori retiré avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du favori'
    });
  }
};

export default {
  signup,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
  getFavorites,
  addFavorite,
  removeFavorite
};