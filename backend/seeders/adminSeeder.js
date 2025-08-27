const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    return queryInterface.bulkInsert('admins', [
      {
        email: 'admin@shopzeo.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'super_admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', { email: 'admin@shopzeo.com' });
  }
};
