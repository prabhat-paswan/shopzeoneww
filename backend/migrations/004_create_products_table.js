'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      amazon_asin: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true
      },
      sku_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      selling_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      mrp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      packaging_length: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        comment: 'Length in cm'
      },
      packaging_breadth: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        comment: 'Breadth in cm'
      },
      packaging_height: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        comment: 'Height in cm'
      },
      packaging_weight: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        comment: 'Weight in kg'
      },
      gst_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      image_1: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_2: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_3: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_4: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_5: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_6: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_7: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_8: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_9: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      image_10: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      video_1: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      video_2: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      size_chart: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      product_type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      size: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      color: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      return_conditions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hsn_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      custom_attributes: {
        type: Sequelize.JSON,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('products', ['product_code']);
    await queryInterface.addIndex('products', ['slug']);
    await queryInterface.addIndex('products', ['store_id']);
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['sub_category_id']);
    await queryInterface.addIndex('products', ['is_active']);
    await queryInterface.addIndex('products', ['is_featured']);
    await queryInterface.addIndex('products', ['selling_price']);
    await queryInterface.addIndex('products', ['gst_percentage']);
    await queryInterface.addIndex('products', ['hsn_code']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};
