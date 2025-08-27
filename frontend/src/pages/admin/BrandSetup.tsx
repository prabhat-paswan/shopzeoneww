import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Star,
  StarOff,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  country?: string;
  founded_year?: number;
  is_featured: boolean;
  is_active: boolean;
  total_products: number;
  total_sales: number;
}

const BrandSetup: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    country: '',
    founded_year: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Fetch real data from API
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data.data?.brands || []);
      } else {
        console.error('Failed to fetch brands');
        setBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website: '',
      email: '',
      phone: '',
      country: '',
      founded_year: ''
    });
    setLogoFile(null);
    setLogoPreview(null);
    setEditingBrand(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Brand name is required');
      return;
    }

    try {
      if (editingBrand) {
        // Update existing brand
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('website', formData.website);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('country', formData.country);
        if (formData.founded_year) {
          formDataToSend.append('founded_year', formData.founded_year);
        }
        if (logoFile) {
          formDataToSend.append('logo', logoFile);
        }

        const response = await fetch(`http://localhost:5000/api/brands/${editingBrand.id}`, {
          method: 'PUT',
          body: formDataToSend
        });

        if (response.ok) {
          await fetchBrands(); // Refresh data
        } else {
          alert('Failed to update brand');
          return;
        }
      } else {
        // Create new brand
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('website', formData.website);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('country', formData.country);
        if (formData.founded_year) {
          formDataToSend.append('founded_year', formData.founded_year);
        }
        if (logoFile) {
          formDataToSend.append('logo', logoFile);
        }

        const response = await fetch('http://localhost:5000/api/brands', {
          method: 'POST',
          body: formDataToSend
        });

        if (response.ok) {
          await fetchBrands(); // Refresh data
        } else {
          alert('Failed to create brand');
          return;
        }
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Error saving brand');
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      description: brand.description || '',
      website: brand.website || '',
      email: brand.email || '',
      phone: brand.phone || '',
      country: brand.country || '',
      founded_year: brand.founded_year?.toString() || ''
    });
    
    if (brand.logo) {
      setLogoPreview(brand.logo);
    } else {
      setLogoPreview(null);
    }
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/brands/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchBrands(); // Refresh data
        } else {
          alert('Failed to delete brand');
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Error deleting brand');
      }
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const brand = brands.find(b => b.id === id);
      if (!brand) return;

      const response = await fetch(`http://localhost:5000/api/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !brand.is_active
        })
      });

      if (response.ok) {
        await fetchBrands(); // Refresh data
      } else {
        alert('Failed to toggle brand status');
      }
    } catch (error) {
      console.error('Error toggling brand status:', error);
      alert('Error toggling brand status');
    }
  };

  const toggleFeatured = async (id: number) => {
    try {
      const brand = brands.find(b => b.id === id);
      if (!brand) return;

      const response = await fetch(`http://localhost:5000/api/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_featured: !brand.is_featured
        })
      });

      if (response.ok) {
        await fetchBrands(); // Refresh data
      } else {
        alert('Failed to toggle brand featured status');
      }
    } catch (error) {
      console.error('Error toggling brand featured status:', error);
        alert('Error toggling brand featured status');
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-600">Manage product brands and their information</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Brand
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Brands</p>
                <p className="text-2xl font-bold text-gray-900">{brands.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured Brands</p>
                <p className="text-2xl font-bold text-gray-900">{brands.filter(b => b.is_featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Brands</p>
                <p className="text-2xl font-bold text-gray-900">{brands.filter(b => b.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{brands.reduce((sum, b) => sum + b.total_products, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Export */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by brand name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => alert('Export functionality coming soon')} className="bg-green-600 text-white hover:bg-green-700 border-green-600">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Brands Table */}
      <Card>
        <CardHeader>
          <CardTitle>Brand List ({filteredBrands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">SL</th>
                  <th className="text-left p-3">Brand Logo</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Total Product</th>
                  <th className="text-left p-3">Total Order</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand, index) => (
                  <tr key={brand.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                    </td>
                    <td className="p-3">
                      {brand.logo ? (
                        <img 
                          src={brand.logo} 
                          alt={brand.name}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Logo</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{brand.name}</div>
                      {brand.description && (
                        <div className="text-sm text-gray-500 mt-1">{brand.description}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-medium text-gray-900">{brand.total_products || 0}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-medium text-gray-900">{brand.total_sales || 0}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleStatus(brand.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            brand.is_active ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              brand.is_active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className="ml-2 text-sm text-gray-600">
                          {brand.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(brand)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(brand.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingBrand ? 'Edit Brand' : 'Create New Brand'}
              </h2>
              <Button variant="ghost" onClick={() => setShowForm(false)}>✕</Button>
            </div>

            <div className="space-y-4">
              {/* Logo Upload */}
              <div>
                <Label htmlFor="logo">Brand Logo</Label>
                <div className="mt-2">
                  {logoPreview ? (
                    <div className="flex items-center space-x-4">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-20 h-20 rounded-lg object-cover border"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={removeLogo}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Logo
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="logo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7m14-5-7 7-7-7M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 2MB</p>
                        </div>
                        <input 
                          id="logo" 
                          name="logo" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Brand Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter brand description"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="info@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1-234-567-8900"
                  />
                </div>
                <div>
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    name="founded_year"
                    type="number"
                    value={formData.founded_year}
                    onChange={handleInputChange}
                    placeholder="e.g., 1938"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                {editingBrand ? 'Update Brand' : 'Create Brand'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSetup;
