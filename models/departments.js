"use strict";
module.exports = (sequelize, DataTypes) => {
  const departments = sequelize.define(
    "departments",
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  departments.associate = function (models) {
    // associations can be defined here
    departments.belongsTo(models.faculties);
  };
  return departments;
};
