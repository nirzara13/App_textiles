// models/user.js
import bcrypt from 'bcrypt'; // Ajout de cette ligne en haut du fichier

const User = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  User.associate = (models) => {
    User.belongsToMany(models.Textile, {
      through: models.Favorite,  // Utilisez le modèle, pas la chaîne de caractères
      foreignKey: 'user_id',
      otherKey: 'textile_id',
      as: 'favorites'  // Utilisez le même alias partout
    });
  };
  return User;
};

export default User;