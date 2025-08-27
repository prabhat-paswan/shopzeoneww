const Category = require('../models/Category');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config/app');
const liveServerSync = require('../services/liveServerSync');

// Helper function to generate slug
const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Helper function to handle file upload
const handleFileUpload = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    console.log('Processing category image upload:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Create upload directory if it doesn't exist
    const uploadDir = 'uploads/categories';
    const fullUploadDir = path.join(__dirname, '..', uploadDir);
    await fs.mkdir(fullUploadDir, { recursive: true });

    // Generate unique filename with proper extension handling
    const timestamp = Date.now();
    const originalName = file.originalname || 'category';
    const extension = path.extname(originalName) || '.jpg';
    const filename = `category-${timestamp}-${Math.round(Math.random() * 1E9)}${extension}`;
    const filepath = path.join(fullUploadDir, filename);

    console.log('Saving category image to:', filepath);

    // Save file using buffer
    await fs.writeFile(filepath, file.buffer);

    // Return relative path (will be converted to full URL in response)
    const imageUrl = `/uploads/categories/${filename}`;

    console.log('Category image uploaded successfully:', imageUrl);
    return imageUrl;

  } catch (error) {
    console.error('Category image upload error:', error);
    throw new Error(`Category image upload failed: ${error.message}`);
  }
};

// Get all categories with pagination and search
exports.getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', level = '', parentId = '' } = req.query;
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (level) {
      whereClause.level = level;
    }
    
    if (parentId !== '') {
      whereClause.parent_id = parentId === 'null' ? null : parentId;
    }
    
    // Get categories with count
    const { count, rows: categories } = await Category.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['sort_order', 'ASC'], ['createdAt', 'DESC']]
    });
    
    // Format image URLs for all categories
    const formattedCategories = categories.map(category => {
      const categoryData = category.toJSON();
      if (categoryData.image) {
        // Only format if it's a relative path, not already a full URL
        if (!categoryData.image.startsWith('http')) {
          categoryData.image = config.getImageUrl(categoryData.image);
        }
      }
      return categoryData;
    });
    
    // Get all categories for parent selection (excluding current category if editing)
    const allCategories = await Category.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'level'],
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: {
        categories: formattedCategories,
        allCategories,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get single category by ID
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Format image URL
    const categoryData = category.toJSON();
    if (categoryData.image) {
      // Only format if it's a relative path, not already a full URL
      if (!categoryData.image.startsWith('http')) {
        categoryData.image = config.getImageUrl(categoryData.image);
      }
    }
    
    res.json({
      success: true,
      data: categoryData
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    console.log('Received files:', req.files);
    
    const {
      name,
      description,
      priority = 0,
      isActive = true,
      parentId = null,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;
    
    // Convert string values to proper types
    const priorityInt = parseInt(priority) || 0;
    const isActiveBool = isActive === 'true' || isActive === true;
    const parentIdInt = parentId && parentId !== '' ? parseInt(parentId) : null;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    // Generate slug
    const slug = generateSlug(name);
    
    // Check if slug already exists
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    // Determine level
    let level = 1;
    if (parentIdInt) {
      const parentCategory = await Category.findByPk(parentIdInt);
      if (parentCategory) {
        level = parentCategory.level + 1;
        if (level > 3) {
          return res.status(400).json({
            success: false,
            message: 'Maximum category level is 3'
          });
        }
      }
    }
    
    // Handle file uploads
    let image = null;
    
    if (req.files && req.files.logo) {
      image = await handleFileUpload(req.files.logo[0]);
    }
    
    // Create category
    const category = await Category.create({
      name,
      slug,
      description: description || null,
      image: image || null,
      parent_id: parentIdInt,
      level,
      sort_order: priorityInt,
      is_active: isActiveBool,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      meta_keywords: metaKeywords || null
    });
    
    // Sync to live server (optional - can be disabled)
    if (process.env.SYNC_TO_LIVE === 'true') {
      try {
        await liveServerSync.syncCategory(category.toJSON());
        console.log('✅ Category synced to live server');
      } catch (error) {
        console.log('⚠️ Category sync to live server failed:', error.message);
        // Don't fail the request if live sync fails
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      priority,
      isActive,
      parentId,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;
    
    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Validate parent category (prevent circular reference)
    if (parentId && parentId !== category.parentId) {
      if (parseInt(parentId) === parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Category cannot be its own parent'
        });
      }
      
      // Check if new parent is a child of current category
      const isChild = await checkIfChildCategory(id, parentId);
      if (isChild) {
        return res.status(400).json({
          success: false,
          message: 'Cannot set child category as parent'
        });
      }
    }
    
    // Generate new slug if name changed
    let slug = category.slug;
    if (name && name !== category.name) {
      slug = generateSlug(name);
      
      // Check if new slug exists
      const existingCategory = await Category.findOne({ 
        where: { slug, id: { [Op.ne]: id } } 
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }
    
    // Handle file uploads for update
    let image = category.image; // Keep existing image by default
    
    if (req.files && req.files.logo) {
      // Delete old image if exists
      if (category.image) {
        try {
          const oldImagePath = path.join(__dirname, '..', '..', category.image);
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.log('Old image not found or already deleted');
        }
      }
      
      // Upload new image
      image = await handleFileUpload(req.files.logo[0]);
    }
    
    // Determine new level
    let level = category.level;
    if (parentId !== category.parentId) {
      if (parentId) {
        const parentCategory = await Category.findByPk(parentId);
        level = parentCategory ? parentCategory.level + 1 : 1;
      } else {
        level = 1;
      }
      
      if (level > 3) {
        return res.status(400).json({
          success: false,
          message: 'Maximum category level is 3'
        });
      }
    }
    
    // Update category
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      slug,
      image,
      sort_order: priority !== undefined ? parseInt(priority) : category.sort_order,
      is_active: isActive !== undefined ? Boolean(isActive) : category.is_active,
      parent_id: parentId !== undefined ? (parentId || null) : category.parent_id,
      level,
      meta_title: metaTitle !== undefined ? metaTitle : category.meta_title,
      meta_description: metaDescription !== undefined ? metaDescription : category.meta_description,
      meta_keywords: metaKeywords !== undefined ? metaKeywords : category.meta_keywords
    });
    
    // Sync update to live server (optional - can be disabled)
    if (process.env.SYNC_TO_LIVE === 'true') {
      try {
        await liveServerSync.updateOnLive('categories', id, category.toJSON());
        console.log('✅ Category update synced to live server');
      } catch (error) {
        console.log('⚠️ Category update sync to live server failed:', error.message);
        // Don't fail the request if live sync fails
      }
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has children
    const childCount = await Category.count({ where: { parentId: id } });
    if (childCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
    }
    
    // Check if category has products
    // Note: You'll need to implement this check when you have Product model
    
    // Delete associated files
    if (category.image) {
      try {
        await fs.unlink(path.join(__dirname, '..', '..', category.image));
      } catch (error) {
        console.error('Error deleting logo:', error);
      }
    }
    
    // Delete category
    await category.destroy();
    
    // Sync deletion to live server (optional - can be disabled)
    if (process.env.SYNC_TO_LIVE === 'true') {
      try {
        await liveServerSync.deleteFromLive('categories', id);
        console.log('✅ Category deletion synced to live server');
      } catch (error) {
        console.log('⚠️ Category deletion sync to live server failed:', error.message);
        // Don't fail the request if live sync fails
      }
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

// Toggle category status
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { field } = req.body; // 'isActive' or 'isHomeCategory'
    
    if (!['isActive', 'isHomeCategory'].includes(field)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid field to toggle'
      });
    }
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const newValue = !category[field];
    await category.update({ [field]: newValue });
    
    res.json({
      success: true,
      message: `${field} updated successfully`,
      data: { [field]: newValue }
    });
  } catch (error) {
    console.error('Toggle category status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle category status',
      error: error.message
    });
  }
};

// Export categories
exports.exportCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['priority', 'ASC'], ['createdAt', 'DESC']],
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['name']
        }
      ]
    });
    
    // Format data for export
    const exportData = categories.map(cat => ({
      ID: cat.id,
      Name: cat.name,
      'Arabic Name': cat.nameAr || '',
      'Bangla Name': cat.nameBn || '',
      'Hindi Name': cat.nameHi || '',
      Slug: cat.slug,
      Priority: cat.priority,
      'Home Category': cat.isHomeCategory ? 'Yes' : 'No',
      Status: cat.isActive ? 'Active' : 'Inactive',
      Level: cat.level,
      'Parent Category': cat.parent?.name || 'None',
      'Created At': cat.createdAt.toISOString().split('T')[0]
    }));
    
    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Export categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export categories',
      error: error.message
    });
  }
};

// Helper function to check if a category is a child of another
async function checkIfChildCategory(parentId, childId) {
  const children = await Category.findAll({
    where: { parentId: parseInt(parentId) }
  });
  
  for (const child of children) {
    if (child.id === parseInt(childId)) {
      return true;
    }
    
    const isGrandChild = await checkIfChildCategory(child.id, childId);
    if (isGrandChild) {
      return true;
    }
  }
  
  return false;
}
