"use strict";
module.exports = (sequelize, DataTypes) => {
  const institusions = sequelize.define(
    "institusions",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      url: DataTypes.STRING
    },
    {}
  );
  institusions.associate = function (models) {
    // associations can be defined here
    institusions.belongsTo(models.institusions);
    institusions.belongsToMany(models.publications, { through: 'scholars_institusions' });
  };
  return institusions;
};
