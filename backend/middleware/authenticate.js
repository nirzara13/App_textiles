// Format ESM (exportation par défaut)
const authenticate = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Non autorisé');
  }
  next();
};

export default authenticate;
