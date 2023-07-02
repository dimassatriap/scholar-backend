"use strict";
module.exports = (sequelize, DataTypes) => {
  const scholars = sequelize.define(
    "scholars",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      gender: DataTypes.STRING,
      birthDate: DataTypes.DATE,
      image: DataTypes.STRING,
    },
    {}
  );
  scholars.associate = function (models) {
    // associations can be defined here
    scholars.belongsTo(models.accounts);
    scholars.hasMany(models.publications);
    // scholars.belongsToMany(models.publications, { through: 'scholars_publications' });
    scholars.belongsToMany(models.institusions, { through: 'scholars_institusions' });
    scholars.belongsTo(models.departments);
  };
  return scholars;
};
