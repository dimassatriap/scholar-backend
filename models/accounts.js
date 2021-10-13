"use strict";
module.exports = (sequelize, DataTypes) => {
  const accounts = sequelize.define(
    "accounts",
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  accounts.associate = function (models) {
    // associations can be defined here
    accounts.hasOne(models.scholars);
  };
  return accounts;
};
