'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User)
    }
  }
  Todo.init({
    name: DataTypes.STRING,
    isComplete: //在migrations新增的資料庫schema欄位，在這裡也要更新
    {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }, 
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};