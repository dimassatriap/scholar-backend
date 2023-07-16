"use strict";
module.exports = (sequelize) => {
  const publications_keywords = sequelize.define(
    "publications_keywords",
    {},
    {}
  );
  return publications_keywords;
};
