

// models/favorite.js

// Pour les imports ESM (si vous utilisez ES modules)
const Favorite = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    textile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'textiles',
        key: 'id'
      }
    },
    usage_context: {
      type: DataTypes.ENUM('Professionnel', 'Loisir', 'Sport', 'Haute Couture'),
      allowNull: true
    },
    frequency_of_use: {
      type: DataTypes.ENUM('Rarement', 'Occasionnellement', 'Régulièrement', 'Fréquemment'),
      defaultValue: 'Occasionnellement'
    },
    personal_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'favorites',
    timestamps: true,
    underscored: true // Important pour que created_at et updated_at fonctionnent
  });
  
  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, { 
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    
    Favorite.belongsTo(models.Textile, { 
      foreignKey: 'textile_id' 
    });
  };
  
  return Favorite;
};

// Pour que ça fonctionne avec ES modules
export default Favorite;