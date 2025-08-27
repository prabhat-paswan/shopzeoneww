const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
const { Op } = require('sequelize');

// Helper function to generate slug
const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Get all sub categories with pagination and search
exports.getSubCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', categoryId = '' } = req.query;
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (categoryId) {
      whereClause.category_id = categoryId;
    }
    
    // Get sub categories with count
    const { count, rows: subCategories } = await SubCategory.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['priority', 'ASC'], ['createdAt', 'DESC']]
    });
    
    // Get all categories for parent selection
    const categories = await Category.findAll({
      where: { is_active: true, level: 1 },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: {
        subCategories,
        categories,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get sub categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sub categories',
      error: error.message
    });
  }
};

// Get single sub category by ID
exports.getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subCategory = await SubCategory.findByPk(id);
    
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }
    
    res.json({
      success: true,
      data: subCategory
    });
  } catch (error) {
    console.error('Get sub category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sub category',
      error: error.message
    });
  }
};

// Create new sub category
exports.createSubCategory = async (req, res) => {
  try {
    console.log('Creating subcategory with data:', req.body);
    
    const {
      name,
      priority = 0,
      isActive = true,
      is_active = true,
      categoryId,
      category_id, // Handle both field names
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;
    
    // Use categoryId or category_id, whichever is provided
    const finalCategoryId = categoryId || category_id;
    
    // Use isActive or is_active, whichever is provided
    const finalIsActive = isActive !== undefined ? isActive : is_active;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Sub category name is required'
      });
    }
    
    if (!finalCategoryId) {
      return res.status(400).json({
        success: false,
        message: 'Main category is required'
      });
    }
    
    console.log('Using category ID:', finalCategoryId);
    console.log('Using isActive:', finalIsActive);
    
    // Check if category exists
    const category = await Category.findByPk(finalCategoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Main category not found'
      });
    }
    
    // Generate slug
    const slug = generateSlug(name);
    
    // Check if slug already exists
    const existingSubCategory = await SubCategory.findOne({ where: { slug } });
    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: 'Sub category with this name already exists'
      });
    }
    
    // Create sub category
    const subCategory = await SubCategory.create({
      name,
      slug,
      priority: parseInt(priority),
      is_active: Boolean(finalIsActive),
      category_id: parseInt(finalCategoryId),
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: metaKeywords
    });
    
    console.log('Subcategory created successfully:', subCategory.id);
    
    res.status(201).json({
      success: true,
      message: 'Sub category created successfully',
      data: subCategory
    });
  } catch (error) {
    console.error('Create sub category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sub category',
      error: error.message
    });
  }
};

// Update sub category
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      priority,
      isActive,
      is_active,
      categoryId,
      category_id,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;
    
    // Use categoryId or category_id, whichever is provided
    const finalCategoryId = categoryId || category_id;
    
    // Use isActive or is_active, whichever is provided
    const finalIsActive = isActive !== undefined ? isActive : is_active;
    
    // Find sub category
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }
    
    // Check if new category exists (if changing)
    if (finalCategoryId && finalCategoryId !== subCategory.category_id) {
      const category = await Category.findByPk(finalCategoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Main category not found'
        });
      }
    }

    // Generate new slug if name changed
    let slug = subCategory.slug;
    if (name && name !== subCategory.name) {
      slug = generateSlug(name);
      
      // Check if new slug exists
      const existingSubCategory = await SubCategory.findOne({ 
        where: { slug, id: { [Op.ne]: id } } 
      });
      if (existingSubCategory) {
        return res.status(400).json({
          success: false,
          message: 'Sub category with this name already exists'
        });
      }
    }
    
    // Update sub category
    await subCategory.update({
      name: name || subCategory.name,
      slug,
      priority: priority !== undefined ? parseInt(priority) : subCategory.priority,
      is_active: finalIsActive !== undefined ? Boolean(finalIsActive) : subCategory.is_active,
      category_id: finalCategoryId !== undefined ? parseInt(finalCategoryId) : subCategory.category_id,
      meta_title: metaTitle !== undefined ? metaTitle : subCategory.meta_title,
      meta_description: metaDescription !== undefined ? metaDescription : subCategory.meta_description,
      meta_keywords: metaKeywords !== undefined ? metaKeywords : subCategory.meta_keywords
    });
    
    res.json({
      success: true,
      message: 'Sub category updated successfully',
      data: subCategory
    });
  } catch (error) {
    console.error('Update sub category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sub category',
      error: error.message
    });
  }
};

// Delete sub category
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find sub category
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }
    
    // Check if sub category has products
    // Note: You'll need to implement this check when you have Product model
    
    // Delete sub category
    await subCategory.destroy();
    
    res.json({
      success: true,
      message: 'Sub category deleted successfully'
    });
  } catch (error) {
    console.error('Delete sub category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sub category',
      error: error.message
    });
  }
};

// Toggle sub category status
exports.toggleSubCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }
    
    const newValue = !subCategory.is_active;
    await subCategory.update({ is_active: newValue });
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: { isActive: newValue }
    });
  } catch (error) {
    console.error('Toggle sub category status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle sub category status',
      error: error.message
    });
  }
};

// Export sub categories
exports.exportSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll({
      order: [['priority', 'ASC'], ['createdAt', 'DESC']]
    });
    
    // Format data for export
    const exportData = subCategories.map(subCat => ({
      ID: subCat.id,
      Name: subCat.name,
      Slug: subCat.slug,
      Priority: subCat.priority,
      Status: subCat.is_active ? 'Active' : 'Inactive',
      'Main Category ID': subCat.category_id,
      'Created At': subCat.createdAt.toISOString().split('T')[0]
    }));
    
    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Export sub categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export sub categories',
      error: error.message
    });
  }
};
