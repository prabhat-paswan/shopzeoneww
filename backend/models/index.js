const { sequelize } = require('../config/database');

// Import essential models
const User = require('./User');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Store = require('./Store');
const Product = require('./Product');

// Export models only - associations are handled in associations.js
module.exports = {
  sequelize,
  User,
  Category,
  SubCategory,
  Store,
  Product
};
