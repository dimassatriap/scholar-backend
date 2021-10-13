"use strict";
module.exports = (sequelize, DataTypes) => {
  const scholars = sequelize.define(
    "scholars",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      gender: DataTypes.STRING
    },
    {}
  );
  scholars.associate = function (models) {
    // associations can be defined here
    scholars.belongsTo(models.accounts);
  };
  return scholars;
};
