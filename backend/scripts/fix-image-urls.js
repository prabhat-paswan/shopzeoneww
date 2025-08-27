const { sequelize } = require('../config/database');
const config = require('../config/app');
const Category = require('../models/Category');
const Banner = require('../models/Banner');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

const fixImageUrls = async () => {
  try {
    console.log('🔧 Starting image URL fix process...');
    console.log(`📍 Current BASE_URL: ${config.BASE_URL}`);
    
    // Fix Category image URLs
    const categories = await Category.findAll();
    console.log(`📁 Found ${categories.length} categories to process`);
    
    for (const category of categories) {
      if (category.image) {
        // Convert to relative path
        const relativePath = config.getRelativePath(category.image);
        if (relativePath !== category.image) {
          await category.update({ image: relativePath });
          console.log(`✅ Fixed category: ${category.name} - ${relativePath}`);
        }
      }
    }
    
    // Fix Banner image URLs
    const banners = await Banner.findAll();
    console.log(`🖼️ Found ${banners.length} banners to process`);
    
    for (const banner of banners) {
      if (banner.image) {
        // Convert to relative path
        const relativePath = config.getRelativePath(banner.image);
        if (relativePath !== banner.image) {
          await banner.update({ image: relativePath });
          console.log(`✅ Fixed banner: ${banner.title || banner.id} - ${relativePath}`);
        }
      }
    }
    
    // Fix Brand image URLs
    const brands = await Brand.findAll();
    console.log(`🏷️ Found ${brands.length} brands to process`);
    
    for (const brand of brands) {
      if (brand.logo) {
        // Convert to relative path
        const relativePath = config.getRelativePath(brand.logo);
        if (relativePath !== brand.logo) {
          await brand.update({ logo: relativePath });
          console.log(`✅ Fixed brand: ${brand.name} - ${relativePath}`);
        }
      }
      if (brand.banner) {
        // Convert to relative path
        const relativePath = config.getRelativePath(brand.banner);
        if (relativePath !== brand.banner) {
          await brand.update({ banner: relativePath });
          console.log(`✅ Fixed brand banner: ${brand.name} - ${relativePath}`);
        }
      }
    }
    
    // Fix Product image URLs
    const products = await Product.findAll();
    console.log(`📦 Found ${products.length} products to process`);
    
    for (const product of products) {
      if (product.image) {
        // Convert to relative path
        const relativePath = config.getRelativePath(product.image);
        if (relativePath !== product.image) {
          await product.update({ image: relativePath });
          console.log(`✅ Fixed product: ${product.name} - ${relativePath}`);
        }
      }
    }
    
    console.log('🎉 Image URL fix process completed successfully!');
    console.log('💡 Now when you deploy to production:');
    console.log('   1. Set BASE_URL=https://yourdomain.com in your .env file');
    console.log('   2. All images will automatically use the correct domain');
    console.log('   3. No need to change any code - just update .env file!');
    
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the script
fixImageUrls();
