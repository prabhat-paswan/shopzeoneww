const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const { Op } = require('sequelize');

// Get hierarchical categories with subcategories
const getCategoryHierarchy = async (req, res) => {
  try {
    // Get all active categories
    const categories = await Category.findAll({
      where: { 
        is_active: true,
        level: 1 // Only main categories
      },
      attributes: ['id', 'name', 'slug', 'image', 'sort_order'],
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      include: [
        {
          model: SubCategory,
          as: 'subCategories',
          where: { is_active: true },
          required: false,
          attributes: ['id', 'name', 'slug', 'priority'],
          order: [['priority', 'ASC'], ['name', 'ASC']]
        }
      ]
    });

    // Transform to hierarchical structure
    const hierarchy = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      icon: getCategoryIcon(category.name), // Get appropriate icon
      subcategories: category.subCategories ? category.subCategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        items: getSubcategoryItems(sub.name) // Get items for this subcategory
      })) : []
    }));

    res.json({
      success: true,
      data: hierarchy
    });

  } catch (error) {
    console.error('Error fetching category hierarchy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category hierarchy',
      error: error.message
    });
  }
};

// Get category icon based on name
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    "Men's Fashion": "👔",
    "Women's Fashion": "👗", 
    "Kid's Fashion": "👶",
    "Health & Beauty": "💄",
    "Pet Supplies": "🐕",
    "Home & Kitchen": "🏠",
    "Baby & Toddler": "🍼",
    "Sports & Outdoor": "⚽",
    "Electronics": "📱",
    "Books": "📚",
    "Automotive": "🚗",
    "Garden": "🌱"
  };
  
  return iconMap[categoryName] || "📦";
};

// Get items for subcategory (this would typically come from products table)
const getSubcategoryItems = (subcategoryName) => {
  // This is a placeholder - in real implementation, you'd query products table
  const itemMap = {
    "Shirts": ["Casual Shirts", "Formal Shirts", "Party Wear Shirts"],
    "T-Shirts": ["Polo T-Shirts", "V-Neck T-Shirts", "Round Neck T-Shirts"],
    "Jeans": ["Slim Fit Jeans", "Regular Fit Jeans", "Bootcut Jeans"],
    "Shoes": ["Casual Shoes", "Formal Shoes", "Sports Shoes"],
    "Watches": ["Analog Watches", "Digital Watches", "Smart Watches"],
    "Smartphones": ["Android Phones", "iPhone", "Budget Phones"],
    "Laptops": ["Gaming Laptops", "Business Laptops", "Student Laptops"],
    "Audio": ["Headphones", "Speakers", "Earphones"]
  };
  
  return itemMap[subcategoryName] || [];
};

// Get categories for navigation (simplified version)
const getNavigationCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { 
        is_active: true,
        level: 1
      },
      attributes: ['id', 'name', 'slug', 'image'],
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      include: [
        {
          model: SubCategory,
          as: 'subCategories',
          where: { is_active: true },
          required: false,
          attributes: ['id', 'name', 'slug'],
          order: [['priority', 'ASC'], ['name', 'ASC']]
        }
      ]
    });

    const navigationData = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: getCategoryIcon(category.name),
      subcategories: category.subCategories ? category.subCategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug
      })) : []
    }));

    res.json({
      success: true,
      data: navigationData
    });

  } catch (error) {
    console.error('Error fetching navigation categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch navigation categories',
      error: error.message
    });
  }
};

// Get single category with all subcategories
const getCategoryWithSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const category = await Category.findOne({
      where: { 
        id: categoryId,
        is_active: true
      },
      attributes: ['id', 'name', 'slug', 'image', 'description'],
      include: [
        {
          model: SubCategory,
          as: 'subCategories',
          where: { is_active: true },
          required: false,
          attributes: ['id', 'name', 'slug', 'priority'],
          order: [['priority', 'ASC'], ['name', 'ASC']]
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image,
        description: category.description,
        icon: getCategoryIcon(category.name),
        subcategories: category.subCategories || []
      }
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

module.exports = {
  getCategoryHierarchy,
  getNavigationCategories,
  getCategoryWithSubcategories
};
