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
  Image,
  Link,
  BarChart3
} from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  banner_type: string;
  button_text?: string;
  button_url?: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  clicks: number;
  impressions: number;
  ctr: number;
}

const BannerSetup: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'store_wise',
    data: '',
    zone_id: 1,
    featured: false,
    default_link: '',
    image: null as File | null
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');

  // Fetch banners from API
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/banners');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched banner data:', data);
        setBanners(data.data?.banners || []);
      } else {
        console.error('Failed to fetch banners');
        setBanners([]);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'store_wise',
      data: '',
      zone_id: 1,
      featured: false,
      default_link: '',
      image: null
    });
    setImagePreview('');
    setEditingBanner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.data || !formData.image) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('data', formData.data);
      formDataToSend.append('zone_id', formData.zone_id.toString());
      formDataToSend.append('featured', formData.featured.toString());
      formDataToSend.append('default_link', formData.default_link);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const url = editingBanner 
        ? `http://localhost:5000/api/banners/${editingBanner.id}`
        : 'http://localhost:5000/api/banners';
      
      const method = editingBanner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
        resetForm();
        setShowForm(false);
        fetchBanners();
      } else {
        const errorData = await response.json();
        alert(`Failed to ${editingBanner ? 'update' : 'create'} banner: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting banner:', error);
      alert('Error submitting banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      type: banner.banner_type,
      data: banner.description || '',
      zone_id: 1, // Default values since these aren't in the frontend interface
      featured: banner.is_featured,
      default_link: banner.button_url || '',
      image: null
    });
    setImagePreview(banner.image);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/banners/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Banner deleted successfully!');
        fetchBanners();
      } else {
        alert('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Error deleting banner');
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const banner = banners.find(b => b.id === id);
      if (!banner) return;

      const response = await fetch(`http://localhost:5000/api/banners/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        await fetchBanners(); // Refresh data from API
      } else {
        alert('Failed to toggle banner status');
      }
    } catch (error) {
      console.error('Error toggling banner status:', error);
      alert('Error toggling banner status');
    }
  };

  const toggleFeatured = async (id: number) => {
    try {
      const banner = banners.find(b => b.id === id);
      if (!banner) return;

      const response = await fetch(`http://localhost:5000/api/banners/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        await fetchBanners(); // Refresh data from API
      } else {
        alert('Failed to toggle banner featured status');
      }
    } catch (error) {
      console.error('Error toggling banner featured status:', error);
      alert('Error toggling banner featured status');
    }
  };

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.banner_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bannerTypeOptions = [
    { value: 'store_wise', label: 'Store Wise' },
    { value: 'item_wise', label: 'Item Wise' },
    { value: 'category_wise', label: 'Category Wise' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600">Manage promotional banners and marketing content</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Banner
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Banners</p>
                <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Featured Banners</p>
                <p className="text-2xl font-bold text-gray-900">{banners.filter(b => b.is_featured).length}</p>
              </div>
            </div>
          </CardContent>
 </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{banners.reduce((sum, b) => sum + b.clicks, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">{banners.reduce((sum, b) => sum + b.impressions, 0)}</p>
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
                  placeholder="Search banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => alert('Export functionality coming soon')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Banners ({filteredBanners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Banner</th>
                  <th className="text-left p-3">Content</th>
                  <th className="text-left p-3">Type & Settings</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Analytics</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((banner) => (
                  <tr key={banner.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={`http://localhost:5000${banner.image}`}
                          alt={banner.title}
                          className="w-20 h-20 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{banner.title}</div>
                          <div className="text-sm text-gray-500">{banner.banner_type}</div>
                          {banner.is_featured && (
                            <Badge variant="secondary" className="mt-1">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {banner.subtitle && (
                          <div className="text-sm font-medium text-gray-900">{banner.subtitle}</div>
                        )}
                        {banner.description && (
                          <div className="text-xs text-gray-600 line-clamp-2">{banner.description}</div>
                        )}
                        {banner.button_text && banner.button_url && (
                          <div className="flex items-center text-sm text-blue-600">
                            <Link className="w-3 h-3 mr-1" />
                            {banner.button_text} → {banner.button_url}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <Badge variant="outline">{banner.banner_type}</Badge>
                        <div className="text-xs text-gray-500">Order: {banner.sort_order}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant={banner.is_active ? "default" : "secondary"}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(banner.id)}
                        >
                          {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Clicks:</span>
                          <span className="font-medium">{banner.clicks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impressions:</span>
                          <span className="font-medium">{banner.impressions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CTR:</span>
                          <span className="font-medium">{banner.ctr}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeatured(banner.id)}
                        >
                          {banner.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(banner.id)}
                          className="text-red-600 hover:text-red-700"
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
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h2>
              <Button variant="ghost" onClick={() => setShowForm(false)}>✕</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Banner Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Banner Type *</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {bannerTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data">Data/Description *</Label>
                  <Input
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    placeholder="Store ID, Item ID, or description"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zone_id">Zone ID *</Label>
                  <Input
                    id="zone_id"
                    name="zone_id"
                    type="number"
                    value={formData.zone_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default_link">Default Link</Label>
                  <Input
                    id="default_link"
                    name="default_link"
                    value={formData.default_link}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Banner Image *</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingBanner}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview.startsWith('http') ? imagePreview : `http://localhost:5000/uploads/banners/${imagePreview}`}
                      alt="Preview" 
                      className="w-32 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Banner</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSetup;
