"use strict";
module.exports = (sequelize, DataTypes) => {
  const faculties = sequelize.define(
    "faculties",
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  faculties.associate = function (models) {
    // associations can be defined here
    faculties.belongsTo(models.universities);
    faculties.hasMany(models.departments);
  };
  return faculties;
};
