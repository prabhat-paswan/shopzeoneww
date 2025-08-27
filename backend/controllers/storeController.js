const Store = require('../models/Store');
const User = require('../models/User');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Create a new store with vendor user account
const createStore = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      country,
      postal_code,
      phone,
      email,
      password,
      gst_number,
      gst_percentage,
      pan_number,
      business_type
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // Check if store name already exists
    const existingStore = await Store.findOne({ where: { name } });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'A store with this name already exists'
      });
    }

    // Check if GST number already exists
    const existingGST = await Store.findOne({ where: { gst_number } });
    if (existingGST) {
      return res.status(400).json({
        success: false,
        message: 'A store with this GST number already exists'
      });
    }

    // Create vendor user account
    const vendorUser = await User.create({
      first_name: name.split(' ')[0] || 'Vendor',
      last_name: name.split(' ').slice(1).join(' ') || 'User',
      email,
      password,
      phone,
      role: 'vendor',
      is_active: true,
      is_verified: false,
      address,
      city,
      state,
      country,
      postal_code
    });

    // Generate slug from store name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create store linked to vendor user
    const store = await Store.create({
      name,
      slug,
      description,
      address,
      city,
      state,
      country,
      postal_code,
      phone,
      email,
      gst_number,
      gst_percentage: parseFloat(gst_percentage) || 18.00,
      pan_number,
      business_type,
      owner_id: vendorUser.id,
      meta_title: `${name} - Online Store`,
      meta_description: description || `Shop at ${name} for the best products and deals`,
      meta_keywords: `${name}, online store, shopping, ${business_type}`
    });

    res.status(201).json({
      success: true,
      message: 'Store and vendor account created successfully',
      data: {
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          email: store.email,
          phone: store.phone,
          address: store.address,
          city: store.city,
          state: store.state,
          country: store.country,
          postal_code: store.postal_code,
          gst_number: store.gst_number,
          gst_percentage: store.gst_percentage,
          pan_number: store.pan_number,
          business_type: store.business_type,
          is_active: store.is_active,
          is_verified: store.is_verified
        },
        vendor: {
          id: vendorUser.id,
          email: vendorUser.email,
          role: vendorUser.role,
          is_active: vendorUser.is_active,
          is_verified: vendorUser.is_verified
        }
      }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create store',
      error: error.message
    });
  }
};

// Get all stores with pagination and search
const getAllStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      verified = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Search by store name or email
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { gst_number: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by status
    if (status !== '') {
      whereClause.is_active = status === 'active';
    }

    // Filter by verification
    if (verified !== '') {
      whereClause.is_verified = verified === 'verified';
    }

    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'is_active', 'is_verified']
        }
      ],
      attributes: [
        'id', 'name', 'slug', 'description', 'logo', 'banner', 'address', 'city', 'state', 'country', 'postal_code',
        'phone', 'email', 'gst_number', 'gst_percentage', 'pan_number', 'business_type', 'is_active', 'is_verified', 
        'rating', 'total_products', 'total_orders', 'total_revenue', 'commission_rate',
        'created_at', 'updated_at'
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        stores,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error.message
    });
  }
};

// Get store by ID
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'is_active', 'is_verified', 'address', 'city', 'state', 'country', 'postal_code']
        }
      ]
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store',
      error: error.message
    });
  }
};

// Update store
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Update store
    await store.update(updateData);

    // If email is being updated, also update the vendor user account
    if (updateData.email && updateData.email !== store.email) {
      const vendorUser = await User.findByPk(store.owner_id);
      if (vendorUser) {
        await vendorUser.update({ email: updateData.email });
      }
    }

    // If phone is being updated, also update the vendor user account
    if (updateData.phone && updateData.phone !== store.phone) {
      const vendorUser = await User.findByPk(store.owner_id);
      if (vendorUser) {
        await vendorUser.update({ phone: updateData.phone });
      }
    }

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: store
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store',
      error: error.message
    });
  }
};

// Delete store
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Delete the vendor user account
    await User.destroy({ where: { id: store.owner_id } });

    // Delete the store
    await store.destroy();

    res.json({
      success: true,
      message: 'Store and vendor account deleted successfully'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete store',
      error: error.message
    });
  }
};

// Toggle store status (active/inactive)
const toggleStoreStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const newStatus = !store.is_active;
    await store.update({ is_active: newStatus });

    // Also update vendor user status
    const vendorUser = await User.findByPk(store.owner_id);
    if (vendorUser) {
      await vendorUser.update({ is_active: newStatus });
    }

    res.json({
      success: true,
      message: `Store ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: { is_active: newStatus }
    });
  } catch (error) {
    console.error('Toggle store status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle store status',
      error: error.message
    });
  }
};

// Toggle store verification
const toggleStoreVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const newVerificationStatus = !store.is_verified;
    await store.update({ is_verified: newVerificationStatus });

    // Also update vendor user verification status
    const vendorUser = await User.findByPk(store.owner_id);
    if (vendorUser) {
      await vendorUser.update({ is_verified: newVerificationStatus });
    }

    res.json({
      success: true,
      message: `Store ${newVerificationStatus ? 'verified' : 'unverified'} successfully`,
      data: { is_verified: newVerificationStatus }
    });
  } catch (error) {
    console.error('Toggle store verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle store verification',
      error: error.message
    });
  }
};

// Update vendor password (admin function)
const updateVendorPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Update vendor user password
    const vendorUser = await User.findByPk(store.owner_id);
    if (!vendorUser) {
      return res.status(404).json({
        success: false,
        message: 'Vendor user not found'
      });
    }

    await vendorUser.update({ password: new_password });

    res.json({
      success: true,
      message: 'Vendor password updated successfully'
    });
  } catch (error) {
    console.error('Update vendor password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor password',
      error: error.message
    });
  }
};

// Export stores to CSV
const exportStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['first_name', 'last_name', 'email', 'phone']
        }
      ],
      attributes: [
        'id', 'name', 'email', 'phone', 'address', 'city', 'state', 'country', 'postal_code',
        'gst_number', 'gst_percentage', 'pan_number', 'business_type', 'is_active', 'is_verified', 
        'rating', 'total_products', 'total_orders', 'total_revenue', 'commission_rate', 'created_at'
      ],
      order: [['created_at', 'DESC']]
    });

    // Convert to CSV format
    const csvData = stores.map(store => ({
      'Store ID': store.id,
      'Store Name': store.name,
      'Owner Name': `${store.owner?.first_name || ''} ${store.owner?.last_name || ''}`.trim(),
      'Email': store.email,
      'Phone': store.phone,
      'Address': store.address,
      'City': store.city,
      'State': store.state,
      'Country': store.country,
      'Postal Code': store.postal_code,
      'GST Number': store.gst_number,
      'GST %': store.gst_percentage,
      'PAN Number': store.pan_number,
      'Business Type': store.business_type,
      'Status': store.is_active ? 'Active' : 'Inactive',
      'Verified': store.is_verified ? 'Yes' : 'No',
      'Rating': store.rating,
      'Total Products': store.total_products,
      'Total Orders': store.total_orders,
      'Total Revenue': store.total_revenue,
      'Commission Rate': store.commission_rate,
      'Created Date': store.created_at
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=stores.csv');

    // Simple CSV conversion
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value || ''}"`).join(','))
    ].join('\n');

    res.send(csvString);
  } catch (error) {
    console.error('Export stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export stores',
      error: error.message
    });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
  toggleStoreStatus,
  toggleStoreVerification,
  updateVendorPassword,
  exportStores
};
