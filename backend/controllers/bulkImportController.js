const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Store = require('../models/Store');
const Brand = require('../models/Brand');

// CSV Column Mapping - User-friendly version
const CSV_COLUMNS = {
  'Product Code': 'product_code',
  'Amazon ASIN': 'amazon_asin',
  'Name': 'name',
  'Sku Id': 'sku_id',
  'Description': 'description',
  'Selling Price': 'selling_price',
  'MRP': 'mrp',
  'Cost Price': 'cost_price',
  'Quantity': 'quantity',
  'Packaging Length (in cm)': 'packaging_length',
  'Packaging Breadth (in cm)': 'packaging_breadth',
  'Packaging Height (in cm)': 'packaging_height',
  'Packaging Weight (in kg)': 'packaging_weight',
  'GST %': 'gst_percentage',
  'Image 1': 'image_1',
  'Image 2': 'image_2',
  'Image 3': 'image_3',
  'Image 4': 'image_4',
  'Image 5': 'image_5',
  'Image 6': 'image_6',
  'Image 7': 'image_7',
  'Image 8': 'image_8',
  'Image 9': 'image_9',
  'Image 10': 'image_10',
  'Video 1': 'video_1',
  'Video 2': 'video_2',
  'Product Type': 'product_type',
  'Size': 'size',
  'Colour': 'colour',
  'Return/Exchange Condition': 'return_exchange_condition',
  'HSN Code': 'hsn_code',
  'Customisation Id': 'customisation_id',
  'Category ID': 'category_id',
  'Sub Category ID': 'sub_category_id',
  'Store ID': 'store_id'
};

// Validation functions
const validateNumeric = (value, fieldName) => {
  if (value === '' || value === null || value === undefined) return null;
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) {
    throw new Error(`${fieldName} must be a valid non-negative number`);
  }
  return num;
};

const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    throw new Error(`${fieldName} is required`);
  }
  return value.toString().trim();
};

// Find category by name (case-insensitive)
const findCategoryByName = async (categoryName) => {
  if (!categoryName) return null;
  
  const category = await Category.findOne({
    where: sequelize.where(
      sequelize.fn('LOWER', sequelize.col('name')), 
      sequelize.fn('LOWER', categoryName.trim())
    )
  });
  
  if (!category) {
    throw new Error(`Category "${categoryName}" not found. Please check the spelling or create it first.`);
  }
  
  return category.id;
};

// Find subcategory by name and category (case-insensitive)
const findSubCategoryByName = async (subCategoryName, categoryId) => {
  if (!subCategoryName) return null;
  
  const subCategory = await SubCategory.findOne({
    where: {
      category_id: categoryId,
      name: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('name')), 
        sequelize.fn('LOWER', subCategoryName.trim())
      )
    }
  });
  
  if (!subCategory) {
    throw new Error(`Subcategory "${subCategoryName}" not found in the selected category. Please check the spelling or create it first.`);
  }
  
  return subCategory.id;
};

// Find store by name (case-insensitive)
const findStoreByName = async (storeName) => {
  if (!storeName) return null;
  
  console.log(`Looking for store with name: "${storeName}"`);
  
  const store = await Store.findOne({
    where: sequelize.where(
      sequelize.fn('LOWER', sequelize.col('name')), 
      sequelize.fn('LOWER', storeName.trim())
    )
  });
  
  if (!store) {
    const availableStores = await getAvailableStoreNames();
    console.log(`Store not found. Available stores: ${availableStores}`);
    throw new Error(`Store "${storeName}" not found. Please check the spelling or create it first. Available stores: ${availableStores}`);
  }
  
  console.log(`Found store: ${store.name} with ID: ${store.id}`);
  return store.id;
};

// Helper function to get available store names for better error messages
const getAvailableStoreNames = async () => {
  try {
    const stores = await Store.findAll({
      attributes: ['name'],
      where: { is_active: true }
    });
    return stores.map(s => s.name).join(', ');
  } catch (error) {
    return 'Unable to fetch store list';
  }
};

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

const processMediaUrls = (row) => {
  const media = {
    images: [],
    videos: []
  };

  // Process images
  for (let i = 1; i <= 10; i++) {
    const imageKey = `image_${i}`;
    if (row[imageKey] && row[imageKey].trim()) {
      let imageUrl = row[imageKey].trim();
      
      // If it's a URL, store it as-is
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        media.images.push(imageUrl);
      } else {
        // Assume it's a filename, build the full URL
        media.images.push(`/uploads/products/${imageUrl}`);
      }
    }
  }

  // Process videos
  for (let i = 1; i <= 2; i++) {
    const videoKey = `video_${i}`;
    if (row[videoKey] && row[videoKey].trim()) {
      let videoUrl = row[videoKey].trim();
      
      if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
        media.videos.push(videoUrl);
      } else {
        media.videos.push(`/uploads/products/${videoUrl}`);
      }
    }
  }

  return media;
};

// Main bulk import function
const bulkImportProducts = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🚀 Bulk import started');
    console.log('📁 Request file:', req.file);
    console.log('📋 Request body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is required'
      });
    }

    const { upsertMode = 'upsert' } = req.body; // 'skip' or 'upsert'
    const filePath = req.file.path;
    console.log('📂 File path:', filePath);
    console.log('📄 File exists:', fs.existsSync(filePath));
    
    const results = {
      total: 0,
      success: 0,
      failed: 0,
      duplicates: 0,
      upserts: 0,
      errors: []
    };

    const products = [];
    const failedRows = [];

    // Parse CSV file synchronously using a Promise-based approach
    const csvData = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
    
    console.log(`📊 Parsed ${csvData.length} rows from CSV`);
    
    // Process each row
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      results.total++;
      
      try {
        console.log(`🔄 Processing row ${i + 1}:`, row);
        
        // Validate required fields
        const name = validateRequired(row['Name'], 'Name');
        console.log('✅ Name validated:', name);
        
        const skuId = validateRequired(row['Sku Id'], 'Sku Id');
        console.log('✅ SKU validated:', skuId);
        
        const categoryId = validateRequired(row['Category ID'], 'Category ID');
        console.log('✅ Category ID validated:', categoryId);
        
        const storeId = validateRequired(row['Store ID'], 'Store ID');
        console.log('✅ Store ID validated:', storeId);
        
        // Use IDs directly (no need to lookup by name)
        const subCategoryId = row['Sub Category ID'] ? parseInt(row['Sub Category ID']) : null;
        console.log('✅ SubCategory ID:', subCategoryId);
        
        // Check for duplicate SKU (only if upsert mode is 'skip')
        let existingProduct = null;
        if (upsertMode === 'skip') {
          existingProduct = await Product.findOne({ 
            where: { sku_id: skuId },
            transaction 
          });

          if (existingProduct) {
            results.duplicates++;
            failedRows.push({
              row: results.total,
              sku: skuId,
              error: 'SKU already exists (skip mode)',
              data: row
            });
            continue;
          }
        }

        // Process and validate data
        const productData = {
          name,
          sku_id: skuId,
          product_code: row['Product Code'] || null,
          amazon_asin: row['Amazon ASIN'] || null,
          description: row['Description'] || null,
          selling_price: validateNumeric(row['Selling Price'], 'Selling Price'),
          mrp: validateNumeric(row['MRP'], 'MRP'),
          cost_price: validateNumeric(row['Cost Price'], 'Cost Price'),
          quantity: parseInt(row['Quantity']) || 0,
          packaging_length: validateNumeric(row['Packaging Length (in cm)'], 'Packaging Length'),
          packaging_breadth: validateNumeric(row['Packaging Breadth (in cm)'], 'Packaging Breadth'),
          packaging_height: validateNumeric(row['Packaging Height (in cm)'], 'Packaging Height'),
          packaging_weight: validateNumeric(row['Packaging Weight (in kg)'], 'Packaging Weight'),
          gst_percentage: validateNumeric(row['GST %'], 'GST %'),
          image_1: row['Image 1'] || null,
          image_2: row['Image 2'] || null,
          image_3: row['Image 3'] || null,
          image_4: row['Image 4'] || null,
          image_5: row['Image 5'] || null,
          image_6: row['Image 6'] || null,
          image_7: row['Image 7'] || null,
          image_8: row['Image 8'] || null,
          image_9: row['Image 9'] || null,
          image_10: row['Image 10'] || null,
          video_1: row['Video 1'] || null,
          video_2: row['Video 2'] || null,
          product_type: row['Product Type'] || null,
          size: row['Size'] || null,
          colour: row['Colour'] || null,
          return_exchange_condition: row['Return/Exchange Condition'] || null,
          hsn_code: row['HSN Code'] || null,
          customisation_id: row['Customisation Id'] || null,
          category_id: parseInt(categoryId),
          sub_category_id: subCategoryId,
          store_id: storeId,
          slug: generateSlug(name),
          is_active: true,
          is_featured: false
        };

        // Media is now handled directly in productData fields

        // Create or update product
        let product;
        try {
          if (existingProduct && upsertMode === 'upsert') {
            product = await existingProduct.update(productData, { transaction });
            results.upserts++;
          } else {
            // Always create new product if not in strict mode
            console.log('🔄 Creating product with data:', JSON.stringify(productData, null, 2));
            product = await Product.create(productData, { transaction });
            results.success++;
            console.log('✅ Product created successfully:', product.id);
          }

          products.push(product);
        } catch (createError) {
          console.error('❌ Product creation error:', createError.message);
          throw createError;
        }

      } catch (error) {
        results.failed++;
        failedRows.push({
          row: results.total,
          sku: row['Sku Id'] || 'N/A',
          error: error.message,
          data: row
        });
        results.errors.push({
          row: results.total,
          sku: row['Sku Id'] || 'N/A',
          error: error.message
        });
      }
    }
    
    // Commit transaction after all rows are processed
    await transaction.commit();
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'Bulk import completed',
      results,
      failedRows
    });

  } catch (error) {
    await transaction.rollback();
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk import failed',
      error: error.message
    });
  }
};

// Get import status (for progress tracking)
const getImportStatus = async (req, res) => {
  // This would typically track progress of a background job
  // For now, return a simple status
  res.json({
    success: true,
    status: 'completed',
    message: 'Import status tracking not implemented yet'
  });
};

// Download failed rows CSV
const downloadFailedRows = async (req, res) => {
  try {
    const { failedRows } = req.body;
    
    if (!failedRows || failedRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No failed rows to download'
      });
    }

    // Create CSV content
    const headers = Object.keys(CSV_COLUMNS).join(',') + ',Error Reason';
    const rows = failedRows.map(row => {
      const csvRow = Object.keys(CSV_COLUMNS).map(key => {
        const value = row.data[key] || '';
        return `"${value}"`;
      });
      csvRow.push(`"${row.error}"`);
      return csvRow.join(',');
    });

    const csvContent = [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="failed_imports.csv"');
    res.send(csvContent);

  } catch (error) {
    console.error('Download failed rows error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download failed rows',
      error: error.message
    });
  }
};

module.exports = {
  bulkImportProducts,
  getImportStatus,
  downloadFailedRows
};
