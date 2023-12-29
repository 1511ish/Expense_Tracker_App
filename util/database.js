const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense_tracker_db','root','Password',{dialect: 'mysql', host:'localhost'});

module.exports = sequelize;