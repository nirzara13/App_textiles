// models/textile.js
const Textile = (sequelize, DataTypes) => {
  const Textile = sequelize.define('Textile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'textiles',
    timestamps: false
  });

  // Dans models/textile.js
Textile.associate = (models) => {
  Textile.belongsTo(models.Category, {
    foreignKey: 'category_id',
    as: 'category'
  });
  
  Textile.belongsToMany(models.User, {
    through: models.Favorite,  // Utilisez le modèle, pas une chaîne
    foreignKey: 'textile_id',
    otherKey: 'user_id',
    as: 'users'
  });
};
  return Textile;
};

export default Textile;