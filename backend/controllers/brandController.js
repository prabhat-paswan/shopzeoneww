const Brand = require('../models/Brand');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config/app');

// Configure multer for brand image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/brands');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'brand-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});


const handleFileUpload = (files) => {
  const uploadedFiles = {};

  if (files.logo && files.logo[0]) {
    uploadedFiles.logo = `/uploads/brands/${files.logo[0].filename}`;
  }

  if (files.banner && files.banner[0]) {
    uploadedFiles.banner = `/uploads/brands/${files.banner[0].filename}`;
  }

  return uploadedFiles;
};
// Helper function to delete old files
const deleteOldFiles = async (brand, newFiles) => {
  const filesToDelete = [];

  if (newFiles.logo && brand.logo && newFiles.logo !== brand.logo) {
    filesToDelete.push(brand.logo);
  }

  if (newFiles.banner && brand.banner && newFiles.banner !== brand.banner) {
    filesToDelete.push(brand.banner);
  }

  for (const filePath of filesToDelete) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
};

// Create a new brand
const createBrand = async (req, res) => {
  try {
    const {
      name,
      name_ar,
      name_bn,
      name_hi,
      description,
      description_ar,
      description_bn,
      description_hi,
      image_alt_text,
      website,
      email,
      phone,
      address,
      country,
      founded_year,
      is_featured,
      sort_order,
      meta_title,
      meta_description,
      meta_keywords
    } = req.body;

    // Check if brand name already exists
    const existingBrand = await Brand.findOne({ where: { name } });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'A brand with this name already exists'
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Handle file uploads
    let uploadedFiles = {};
    console.log("🚀 ~ createBrand ~ req:", req.files)
    if (req.files) {
      console.log("🚀 ~ createBrand ~  in files:", req.files)

      uploadedFiles = await handleFileUpload(req.files);
    }
    console.log("🚀 ~ createBrand ~ uploadedFiles:", uploadedFiles)

    // Create brand
    const brand = await Brand.create({
      name,
      name_ar,
      name_bn,
      name_hi,
      slug,
      description,
      description_ar,
      description_bn,
      description_hi,
      logo: uploadedFiles.logo || null,
      banner: uploadedFiles.banner || null,
      image_alt_text,
      website,
      email,
      phone,
      address,
      country,
      founded_year: founded_year ? parseInt(founded_year) : null,
      is_featured: is_featured === 'true',
      sort_order: sort_order ? parseInt(sort_order) : 0,
      meta_title,
      meta_description,
      meta_keywords
    });

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create brand',
      error: error.message
    });
  }
};

// Get all brands with pagination and search
const getAllBrands = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      featured = '',
      country = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Search by brand name
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { name_ar: { [Op.like]: `%${search}%` } },
        { name_bn: { [Op.like]: `%${search}%` } },
        { name_hi: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by status
    if (status !== '') {
      whereClause.is_active = status === 'active';
    }

    // Filter by featured
    if (featured !== '') {
      whereClause.is_featured = featured === 'featured';
    }

    // Filter by country
    if (country) {
      whereClause.country = country;
    }

    const { count, rows: brands } = await Brand.findAndCountAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Format image URLs for all brands
    const formattedBrands = brands.map(brand => {
      const brandData = brand.toJSON();
      if (brandData.logo) {
        brandData.logo = config.getImageUrl(brandData.logo);
      }
      if (brandData.banner) {
        brandData.banner = config.getImageUrl(brandData.banner);
      }
      return brandData;
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        brands: formattedBrands,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands',
      error: error.message
    });
  }
};

// Get brand by ID
const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Format image URLs
    const brandData = brand.toJSON();
    if (brandData.logo) {
      brandData.logo = config.getImageUrl(brandData.logo);
    }
    if (brandData.banner) {
      brandData.banner = config.getImageUrl(brandData.banner);
    }

    res.json({
      success: true,
      data: brandData
    });
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brand',
      error: error.message
    });
  }
};

// Update brand
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Check if name is being updated and if it conflicts with existing brands
    if (updateData.name && updateData.name !== brand.name) {
      const existingBrand = await Brand.findOne({
        where: {
          name: updateData.name,
          id: { [Op.ne]: id }
        }
      });
      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: 'A brand with this name already exists'
        });
      }
    }

    // Handle file uploads
    let uploadedFiles = {};
    if (req.files) {
      uploadedFiles = await handleFileUpload(req.files);
    }

    // Update slug if name changed
    if (updateData.name && updateData.name !== brand.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Merge uploaded files with update data
    const finalUpdateData = { ...updateData, ...uploadedFiles };

    // Delete old files if new ones are uploaded
    if (Object.keys(uploadedFiles).length > 0) {
      await deleteOldFiles(brand, uploadedFiles);
    }

    await brand.update(finalUpdateData);

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    console.error('Update brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update brand',
      error: error.message
    });
  }
};

// Delete brand
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Delete associated files
    if (brand.logo) {
      try {
        await fs.unlink(brand.logo);
      } catch (error) {
        console.error('Error deleting logo:', error);
      }
    }

    if (brand.banner) {
      try {
        await fs.unlink(brand.banner);
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }

    await brand.destroy();

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete brand',
      error: error.message
    });
  }
};

// Toggle brand status
const toggleBrandStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    const newStatus = !brand.is_active;
    await brand.update({ is_active: newStatus });

    res.json({
      success: true,
      message: `Brand ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: { is_active: newStatus }
    });
  } catch (error) {
    console.error('Toggle brand status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle brand status',
      error: error.message
    });
  }
};

// Toggle brand featured status
const toggleBrandFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    const newFeaturedStatus = !brand.is_featured;
    await brand.update({ is_featured: newFeaturedStatus });

    res.json({
      success: true,
      message: `Brand ${newFeaturedStatus ? 'featured' : 'unfeatured'} successfully`,
      data: { is_featured: newFeaturedStatus }
    });
  } catch (error) {
    console.error('Toggle brand featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle brand featured status',
      error: error.message
    });
  }
};

// Export brands to CSV
const exportBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      order: [['name', 'ASC']]
    });

    // Convert to CSV format
    const csvData = brands.map(brand => ({
      'Brand ID': brand.id,
      'Name (EN)': brand.name,
      'Name (AR)': brand.name_ar || '',
      'Name (BN)': brand.name_bn || '',
      'Name (HI)': brand.name_hi || '',
      'Description': brand.description || '',
      'Website': brand.website || '',
      'Email': brand.email || '',
      'Phone': brand.phone || '',
      'Country': brand.country || '',
      'Founded Year': brand.founded_year || '',
      'Featured': brand.is_featured ? 'Yes' : 'No',
      'Status': brand.is_active ? 'Active' : 'Inactive',
      'Sort Order': brand.sort_order,
      'Total Products': brand.total_products,
      'Total Sales': brand.total_sales,
      'Created Date': brand.created_at
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=brands.csv');

    // Simple CSV conversion
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value || ''}"`).join(','))
    ].join('\n');

    res.send(csvString);
  } catch (error) {
    console.error('Export brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export brands',
      error: error.message
    });
  }
};

// Get featured brands
const getFeaturedBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      where: { is_active: true, is_featured: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      limit: 10
    });

    // Format image URLs for featured brands
    const formattedBrands = brands.map(brand => {
      const brandData = brand.toJSON();
      if (brandData.logo) {
        brandData.logo = config.getImageUrl(brandData.logo);
      }
      if (brandData.banner) {
        brandData.banner = config.getImageUrl(brandData.banner);
      }
      return brandData;
    });

    res.json({
      success: true,
      data: formattedBrands
    });
  } catch (error) {
    console.error('Get featured brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured brands',
      error: error.message
    });
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
  toggleBrandFeatured,
  exportBrands,
  getFeaturedBrands,
  upload
};
