"use strict";
module.exports = (sequelize, DataTypes) => {
  const universities = sequelize.define(
    "universities",
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  universities.associate = function (models) {
    // associations can be defined here
    universities.hasMany(models.faculties);
  };
  return universities;
};
