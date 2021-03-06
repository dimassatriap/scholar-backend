'use strict';
module.exports = (sequelize, DataTypes) => {
  const publications = sequelize.define('publications', {
    name: DataTypes.STRING,
    abstract: DataTypes.TEXT,
    language: DataTypes.STRING,
    pages: DataTypes.INTEGER,
    totalPages: DataTypes.INTEGER,
    ISBN: DataTypes.INTEGER,
    journal: DataTypes.STRING,
    publisher: DataTypes.STRING,
    number: DataTypes.STRING,
    publicationEvent: DataTypes.STRING,
    conference: DataTypes.STRING
  }, {});
  publications.associate = function(models) {
    // associations can be defined here
    publications.belongsTo(models.scholars);
    // publications.belongsToMany(models.scholars, { through: 'scholars_publications' });
  };
  return publications;
};