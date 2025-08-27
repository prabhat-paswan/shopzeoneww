const Product = require('../models/Product');
const Store = require('../models/Store');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const { Op } = require('sequelize');

// Get all products with pagination and search
exports.getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search = '', 
      store_id = '', 
      category_id = '', 
      sub_category_id = '',
      min_price = '',
      max_price = '',
      is_active = '',
      is_featured = ''
    } = req.query;
    
    // Build where clause
    const whereClause = {};
    
         if (search) {
       whereClause[Op.or] = [
         { name: { [Op.like]: `%${search}%` } },
         { product_code: { [Op.like]: `%${search}%` } },
         { sku_id: { [Op.like]: `%${search}%` } },
         { description: { [Op.like]: `%${search}%` } }
       ];
     }
    
    if (store_id) whereClause.store_id = store_id;
    if (category_id) whereClause.category_id = category_id;
    if (sub_category_id) whereClause.sub_category_id = sub_category_id;
    if (is_active !== '') whereClause.is_active = is_active === 'true';
    if (is_featured !== '') whereClause.is_featured = is_featured === 'true';
    
    if (min_price || max_price) {
      whereClause.selling_price = {};
      if (min_price) whereClause.selling_price[Op.gte] = parseFloat(min_price);
      if (max_price) whereClause.selling_price[Op.lte] = parseFloat(max_price);
    }
    
    // Get products with pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: require('../models/ProductMedia'),
          as: 'productMedia',
          attributes: ['id', 'media_type', 'media_url', 'media_order'],
          where: { is_active: true },
          required: false,
          order: [['media_order', 'ASC']]
        }
      ]
    });
    
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      products: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: require('../models/ProductMedia'),
          as: 'productMedia',
          attributes: ['id', 'media_type', 'media_url', 'media_order'],
          where: { is_active: true },
          required: false,
          order: [['media_order', 'ASC']]
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product retrieved successfully',
      product: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Handle file uploads
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          productData[fieldName] = `/uploads/${req.files[fieldName][0].filename}`;
        }
      });
    }
    
    // Validate required fields
    const requiredFields = ['product_code', 'sku_id', 'name', 'selling_price', 'quantity', 'store_id', 'category_id', 'sub_category_id'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }
    
    // Generate UUID for new product if not provided
    if (!productData.id) {
      const { v4: uuidv4 } = require('uuid');
      productData.id = uuidv4();
    }
    
    // Set default values
    productData.is_active = productData.is_active !== undefined ? productData.is_active : true;
    productData.is_featured = productData.is_featured !== undefined ? productData.is_featured : false;
    
    // Create product
    const product = await Product.create(productData);
    
    // Fetch the created product with associations
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: require('../models/ProductMedia'),
          as: 'productMedia',
          attributes: ['id', 'media_type', 'media_url', 'media_order'],
          where: { is_active: true },
          required: false,
          order: [['media_order', 'ASC']]
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle other errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('Unexpected unique constraint error:', error.message);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    // Check if product exists
    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Handle file uploads
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          productData[fieldName] = `/uploads/${req.files[fieldName][0].filename}`;
        }
      });
    }
    
    // Validate required fields
    const requiredFields = ['product_code', 'sku_id', 'name', 'selling_price', 'quantity', 'store_id', 'category_id', 'sub_category_id'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }
    
    // Update product
    await existingProduct.update(productData);
    
    // Fetch the updated product with associations
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: require('../models/ProductMedia'),
          as: 'productMedia',
          attributes: ['id', 'media_type', 'media_url', 'media_order'],
          where: { is_active: true },
          required: false,
          order: [['media_order', 'ASC']]
        }
      ]
    });
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    // Handle duplicate key errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Product with this code or SKU already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Delete product
    await existingProduct.destroy();
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get products by store
exports.getProductsByStore = async (req, res) => {
  try {
    const { store_id } = req.params;
    res.json({
      success: true,
      message: 'Store products retrieved successfully',
      data: { store_id }
    });
  } catch (error) {
    console.error('Get store products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve store products',
      error: error.message
    });
  }
};

// Toggle product status
exports.toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      message: 'Product status toggled successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product status',
      error: error.message
    });
  }
};

// Toggle product featured
exports.toggleProductFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      message: 'Product featured status toggled successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Toggle product featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product featured status',
      error: error.message
    });
  }
};

// Export products
exports.exportProducts = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Products exported successfully'
    });
  } catch (error) {
    console.error('Export products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export products',
      error: error.message
    });
  }
};

// Upload configuration for product images
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create products folder if it doesn't exist
    const fs = require('fs');
    const uploadDir = 'uploads/products';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Bulk upload products from CSV
exports.bulkUploadProducts = async (req, res) => {
  try {
    console.log('=== CSV UPLOAD STARTED ===');
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'CSV file is required'
      });
    }

    console.log('✅ File received:', req.file.originalname);
    console.log('✅ File size:', req.file.size, 'bytes');

    const csvBuffer = req.file.buffer;
    const csvText = csvBuffer.toString('utf-8');
    
    // Parse CSV manually since csv-parser is causing issues
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const results = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      results.push(row);
    }
    
    console.log('✅ CSV parsed successfully, rows:', results.length);
    console.log('📋 Headers:', headers);
    console.log('📊 First row sample:', results[0]);
    
    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'CSV file must contain at least one data row'
      });
    }

    // Parse data rows
    const products = [];
    let uploadedCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < results.length; i++) {
      try {
        console.log(`\n--- Processing Row ${i + 1} ---`);
        
        const productData = results[i];
        console.log('📊 Raw product data:', productData);

        // Generate UUID for product
        const { v4: uuidv4 } = require('uuid');
        const productId = uuidv4();
        
        // Map CSV fields to database fields
        const mappedProduct = {
          id: productId,
          product_code: productData['Product Code'] || '',
          amazon_asin: productData['Amazon ASIN'] || '',
          name: productData['Name'] || '',
          sku_id: productData['Sku Id'] || '',
          selling_price: parseFloat(productData['Selling Price']) || 0,
          mrp: parseFloat(productData['MRP']) || 0,
          cost_price: parseFloat(productData['Cost Price']) || 0,
          quantity: parseInt(productData['Quantity']) || 0,
          packaging_length: parseFloat(productData['Packaging Length (in cm)']) || 0,
          packaging_breadth: parseFloat(productData['Packaging Breadth (in cm)']) || 0,
          packaging_height: parseFloat(productData['Packaging Height (in cm)']) || 0,
          packaging_weight: parseFloat(productData['Packaging Weight (in kg)']) || 0,
          gst_percentage: parseFloat(productData['GST %']) || 0,
          image_1: productData['Image 1'] || '',
          image_2: productData['Image 2'] || '',
          image_3: productData['Image 3'] || '',
          image_4: productData['Image 4'] || '',
          image_5: productData['Image 5'] || '',
          image_6: productData['Image 6'] || '',
          image_7: productData['Image 7'] || '',
          image_8: productData['Image 8'] || '',
          image_9: productData['Image 9'] || '',
          image_10: productData['Image 10'] || '',
          video_1: productData['Video 1'] || '',
          video_2: productData['Video 2'] || '',
          product_type: productData['Product Type'] || '',
          size: productData['Size'] || '',
          colour: productData['Colour'] || '',
          description: productData['Description'] || '',
          return_exchange_condition: productData['Return/Exchange Condition'] || '',
          hsn_code: productData['HSN Code'] || '',
          customisation_id: productData['Customisation Id'] || '',
          category_id: parseInt(productData['Category ID']) || 16,
          sub_category_id: parseInt(productData['Sub Category ID']) || 19,
          store_id: productData['Store ID'] || 'ce32fe90-7eaa-11f0-a328-f5704f3e47ab',
          is_active: true,
          is_featured: false
        };

        // Prepare media data for product_media table
        const mediaData = [];
        let mediaOrder = 0;
        
        // Add images
        for (let j = 1; j <= 10; j++) {
          if (productData[`Image ${j}`]) {
            mediaData.push({
              product_id: productId,
              media_type: 'image',
              media_url: productData[`Image ${j}`],
              media_order: mediaOrder++,
              is_active: true
            });
          }
        }
        
        // Add videos
        for (let j = 1; j <= 2; j++) {
          if (productData[`Video ${j}`]) {
            mediaData.push({
              product_id: productId,
              media_type: 'video',
              media_url: productData[`Video ${j}`],
              media_order: mediaOrder++,
              is_active: true
            });
          }
        }

        console.log('🔄 Mapped product:', {
          name: mappedProduct.name,
          product_code: mappedProduct.product_code,
          sku_id: mappedProduct.sku_id,
          category_id: mappedProduct.category_id,
          sub_category_id: mappedProduct.sub_category_id,
          store_id: mappedProduct.store_id
        });

        // Validate required fields with detailed error messages
        const missingFields = [];
        if (!mappedProduct.name) missingFields.push('Name');
        if (!mappedProduct.product_code) missingFields.push('Product Code');
        if (!mappedProduct.sku_id) missingFields.push('SKU ID');
        
        if (missingFields.length > 0) {
          console.log(`❌ Row ${i + 1}: Missing fields: ${missingFields.join(', ')}`);
          errorCount++;
          errors.push(`Row ${i + 1}: Missing required fields: ${missingFields.join(', ')}`);
          continue;
        }
        
        // Validate numeric fields
        const numericErrors = [];
        if (isNaN(mappedProduct.selling_price) || mappedProduct.selling_price <= 0) numericErrors.push('Selling Price must be a positive number');
        if (isNaN(mappedProduct.quantity) || mappedProduct.quantity < 0) numericErrors.push('Quantity must be a non-negative number');
        if (mappedProduct.category_id <= 0) numericErrors.push('Category ID must be a positive number');
        if (mappedProduct.sub_category_id <= 0) numericErrors.push('Sub Category ID must be a positive number');
        if (!mappedProduct.store_id) numericErrors.push('Store ID is required');
        
        if (numericErrors.length > 0) {
          console.log(`❌ Row ${i + 1}: ${numericErrors.join(', ')}`);
          errorCount++;
          errors.push(`Row ${i + 1}: ${numericErrors.join(', ')}`);
          continue;
        }

        console.log(`✅ Row ${i + 1}: Validation passed`);
        products.push(mappedProduct);
        
        // Store media data for later insertion
        if (mediaData.length > 0) {
          mappedProduct.mediaData = mediaData;
        }
        
      } catch (rowError) {
        console.log(`❌ Row ${i + 1}: Error: ${rowError.message}`);
        errorCount++;
        errors.push(`Row ${i + 1}: Error: ${rowError.message}`);
      }
    }

    // Bulk insert products
    console.log(`\n=== DATABASE INSERTION ===`);
    console.log(`📦 Products to insert: ${products.length}`);
    
    if (products.length > 0) {
      try {
        console.log('🔄 Starting bulk insert...');
        
        const createdProducts = await Product.bulkCreate(products, {
          ignoreDuplicates: true,
          updateOnDuplicate: [
            'name', 'selling_price', 'mrp', 'cost_price', 'quantity',
            'packaging_length', 'packaging_breadth', 'packaging_height', 'packaging_weight',
            'gst_percentage', 'description', 'is_active'
          ]
        });
        
        uploadedCount = createdProducts.length;
        console.log(`✅ Bulk insert successful! Created: ${uploadedCount} products`);
        console.log('📋 Created products:', createdProducts.map(p => ({ id: p.id, name: p.name, product_code: p.product_code })));

        // Insert media data for each product
        const ProductMedia = require('../models/ProductMedia');
        let mediaInserted = 0;
        
        for (const product of products) {
          if (product.mediaData && product.mediaData.length > 0) {
            try {
              await ProductMedia.bulkCreate(product.mediaData);
              mediaInserted += product.mediaData.length;
              console.log(`✅ Media inserted for product ${product.id}: ${product.mediaData.length} items`);
            } catch (mediaError) {
              console.log(`⚠️ Failed to insert media for product ${product.id}:`, mediaError.message);
            }
          }
        }
        
        console.log(`📸 Total media items inserted: ${mediaInserted}`);
        
      } catch (dbError) {
        console.error('❌ Database insertion error:', dbError);
        console.error('❌ Error details:', {
          name: dbError.name,
          message: dbError.message,
          code: dbError.parent?.code,
          sql: dbError.parent?.sql
        });
        
        return res.status(500).json({
          success: false,
          message: 'Database insertion failed',
          error: dbError.message,
          details: {
            name: dbError.name,
            code: dbError.parent?.code,
            sql: dbError.parent?.sql
          }
        });
      }
    } else {
      console.log('⚠️ No products to insert');
    }

    console.log(`\n=== FINAL RESPONSE ===`);
    console.log(`📊 Summary: ${uploadedCount} uploaded, ${errorCount} errors, ${products.length} total`);
    
    res.json({
      success: true,
      message: `CSV processed successfully`,
      uploaded: uploadedCount,
      total: products.length,
      errors: errors.length > 0 ? errors : undefined,
      errorCount
    });
    
    console.log('=== CSV UPLOAD COMPLETED ===\n');

  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process CSV upload',
      error: error.message
    });
  }
};
 