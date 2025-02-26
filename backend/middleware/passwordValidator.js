// // middleware/passwordValidator.js
// const passwordValidator = (req, res, next) => {
//     const { password } = req.body;
    
//     if (password.length > 10) {
//       return res.status(400).json({ message: 'Le mot de passe ne doit pas dépasser 10 caractères' });
//     }
    
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const specialCharsCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
    
//     if (!hasUpperCase || !hasLowerCase || !hasNumber || specialCharsCount < 2) {
//       return res.status(400).json({
//         message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et deux caractères spéciaux'
//       });
//     }
    
//     next();
//   };
  
//   module.exports = passwordValidator;


// middlewares/passwordValidator.js
const passwordValidator = (req, res, next) => {
  const { password } = req.body;

  // Validation du mot de passe
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Le mot de passe est requis'
    });
  }

  if (password.length < 8 || password.length > 12) {
    return res.status(400).json({
      success: false,
      message: 'Le mot de passe doit contenir entre 8 et 12 caractères'
    });
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const specialCharsCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;

  if (!hasUpperCase || !hasLowerCase || !hasNumber || specialCharsCount < 2) {
    return res.status(400).json({
      success: false,
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et deux caractères spéciaux'
    });
  }

  next();
};

export default passwordValidator;