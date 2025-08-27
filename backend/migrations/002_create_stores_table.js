'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      logo: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Store logo image path'
      },
      banner: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Store banner image path'
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      gst_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'GST registration number'
      },
      gst_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Default GST percentage for store'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Store verification status'
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0,
        comment: 'Store rating (0-5)'
      },
      total_products: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_revenue: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      commission_rate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 15,
        comment: 'Platform commission percentage'
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      meta_title: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      meta_keywords: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('stores', ['slug']);
    await queryInterface.addIndex('stores', ['owner_id']);
    await queryInterface.addIndex('stores', ['is_active']);
    await queryInterface.addIndex('stores', ['is_verified']);
    await queryInterface.addIndex('stores', ['rating']);
    await queryInterface.addIndex('stores', ['gst_number']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stores');
  }
};
