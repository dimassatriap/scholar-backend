"use strict";
module.exports = (sequelize, DataTypes) => {
  const helpdesk = sequelize.define(
    "helpdesk",
    {
      email: DataTypes.STRING,
      messages: DataTypes.STRING,
    },
    {}
  );
  helpdesk.associate = function (models) {
    // associations can be defined here
  };
  return helpdesk;
};
