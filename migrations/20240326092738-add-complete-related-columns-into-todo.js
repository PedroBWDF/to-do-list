'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn( //透過queryInterface.addColumn 來完成新增欄位到 todos 資料表，參數分別為資料表名稱、欄位名稱及欄位定義
      'Todos',
      'isComplete',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false, //讓新舊資料加入新欄位後預設為false
        allowNull: false
      }
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'Todos',
      'isComplete'
    )
  }
};
