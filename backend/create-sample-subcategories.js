const { sequelize } = require('./config/database');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');

async function createSampleSubCategories() {
    try {
        console.log('🚀 Creating sample subcategories...\n');
        
        // Get existing categories
        const categories = await Category.findAll({
            where: { is_active: true },
            attributes: ['id', 'name']
        });
        
        console.log('📁 Found categories:', categories.map(c => `${c.id}: ${c.name}`));
        
        // Sample subcategories for each category
        const subCategoriesData = [
            // Electronics category (ID: 1)
            {
                name: 'Smartphones',
                slug: 'smartphones',
                priority: 1,
                is_active: true,
                category_id: 1,
                meta_title: 'Smartphones - Latest Mobile Phones',
                meta_description: 'Buy latest smartphones with great deals',
                meta_keywords: 'smartphone, mobile, phone, 5G'
            },
            {
                name: 'Laptops',
                slug: 'laptops',
                priority: 2,
                is_active: true,
                category_id: 1,
                meta_title: 'Laptops - Best Laptops for Work & Gaming',
                meta_description: 'High performance laptops for work and gaming',
                meta_keywords: 'laptop, computer, gaming, work'
            },
            {
                name: 'Audio Devices',
                slug: 'audio-devices',
                priority: 3,
                is_active: true,
                category_id: 1,
                meta_title: 'Audio Devices - Headphones & Speakers',
                meta_description: 'Premium audio devices for music lovers',
                meta_keywords: 'headphones, speakers, audio, music'
            },
            {
                name: 'Wearables',
                slug: 'wearables',
                priority: 4,
                is_active: true,
                category_id: 1,
                meta_title: 'Wearables - Smartwatches & Fitness Trackers',
                meta_description: 'Smart wearables for health and fitness',
                meta_keywords: 'smartwatch, fitness tracker, wearable'
            },
            {
                name: 'Gaming',
                slug: 'gaming',
                priority: 5,
                is_active: true,
                category_id: 1,
                meta_title: 'Gaming - Gaming Accessories & Equipment',
                meta_description: 'Professional gaming gear and accessories',
                meta_keywords: 'gaming, mouse, keyboard, accessories'
            }
        ];
        
        console.log('\n📦 Creating subcategories...');
        
        for (const subCatData of subCategoriesData) {
            try {
                // Check if subcategory already exists
                const existing = await SubCategory.findOne({
                    where: { slug: subCatData.slug }
                });
                
                if (existing) {
                    console.log(`✅ Subcategory "${subCatData.name}" already exists`);
                } else {
                    const subCategory = await SubCategory.create(subCatData);
                    console.log(`✅ Created subcategory: ${subCategory.name} (ID: ${subCategory.id})`);
                }
            } catch (error) {
                console.log(`❌ Error creating subcategory "${subCatData.name}":`, error.message);
            }
        }
        
        // Get final count
        const finalCount = await SubCategory.count();
        console.log(`\n📊 Total subcategories in database: ${finalCount}`);
        
        console.log('\n🎉 Sample subcategories creation completed!');
        
    } catch (error) {
        console.error('💥 Error:', error);
    } finally {
        await sequelize.close();
    }
}

// Run the function
createSampleSubCategories();
