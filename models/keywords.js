"use strict";
module.exports = (sequelize, DataTypes) => {
  const keywords = sequelize.define(
    "keywords",
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  keywords.associate = function (models) {
    // associations can be defined here
    keywords.belongsToMany(models.publications, { as: 'publications', through: 'publications_keywords' });
  };
  return keywords;
};
