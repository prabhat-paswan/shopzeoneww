import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  priority: number;
  isActive: boolean;
  parentId?: number;
  level: number;
  parent?: { id: number; name: string };
  createdAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  priority: string;
  isActive: boolean;
  parentId: string;
  logo?: File;
}

const CategorySetup: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Pagination state (will be used later)
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    priority: '',
    isActive: true,
    parentId: '',
  });

  // Load categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setCategories(data.data?.categories || []);
        setAllCategories(data.data?.categories || []);
        // setTotalPages(data.data?.pagination?.totalPages || 1);
      } else {
        console.error('Failed to fetch categories');
        setCategories([]);
        setAllCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setAllCategories([]);
    } finally {
      setLoading(false);
    }
  };



  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: 'logo', file: File | null) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('isActive', formData.isActive.toString());
      if (formData.parentId) {
        formDataToSend.append('parentId', formData.parentId);
      }
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      let url = 'http://localhost:5000/api/categories';
      let method = 'POST';

      if (editingCategory) {
        url = `http://localhost:5000/api/categories/${editingCategory.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        await response.json();
        
                 if (editingCategory) {
           // Category updated successfully - no need to manually update state
           // fetchCategories() will refresh the data from API
         } else {
           // Category created successfully - no need to manually add to state
           // fetchCategories() will refresh the data from API
         }
        
        // Reset form
        resetForm();
        
        // Refresh categories from API
        fetchCategories();
      } else {
        console.error('Failed to save category');
        alert('Failed to save category. Please try again.');
      }
      
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      priority: category.priority.toString(),
      isActive: category.isActive,
      parentId: category.parentId?.toString() || '',
    });
    if (category.image) {
      setLogoPreview(category.image);
    } else {
      setLogoPreview('');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCategories(); // Refresh data from API
          alert('Category deleted successfully!');
        } else {
          console.error('Failed to delete category');
          alert('Failed to delete category. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  const toggleStatus = async (id: number, field: 'isActive') => {
    try {
      const category = categories.find(cat => cat.id === id);
      if (!category) return;

      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [field]: !category[field]
        }),
      });

      if (response.ok) {
        await fetchCategories(); // Refresh data from API
      } else {
        console.error('Failed to update category status');
        alert('Failed to update category status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating category status:', error);
      alert('Error updating category status. Please try again.');
    }
  };

  const handleExport = () => {
    const csvContent = categories.map(cat => 
      `${cat.id},${cat.name},${cat.slug},${cat.priority},${cat.isActive ? 'Active' : 'Inactive'}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      priority: '',
      isActive: true,
      parentId: '',
    });
    setEditingCategory(null);
    setLogoPreview('');
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <div className="flex space-x-1 mr-3">
            <div className="w-2 h-2 bg-red-500 rounded"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded"></div>
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
          </div>
          Category Setup
        </h1>
        <p className="text-gray-600">Manage your product categories and subcategories</p>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Name */}
              <div>
                <Label htmlFor="name">Category Name*</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>

              {/* Priority */}
              <div>
                <Label htmlFor="priority">Priority</Label>
                <div className="relative">
                  <Input
                    id="priority"
                    type="number"
                    placeholder="Set Priority"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    min="0"
                    required
                  />
                  <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Parent Category */}
              <div>
                <Label htmlFor="parentId">Parent Category</Label>
                <select
                  id="parentId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.parentId}
                  onChange={(e) => handleInputChange('parentId', e.target.value)}
                >
                  <option value="">Select Parent Category</option>
                  {allCategories
                    .filter(cat => cat.level < 3)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Category Logo */}
              <div>
                <Label>Category Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {logoPreview ? (
                    <div className="mb-4">
                      <img src={logoPreview} alt="Logo preview" className="w-20 h-20 mx-auto rounded-lg object-cover" />
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      {logoPreview ? 'Change Logo' : 'Click to upload'}
                    </Button>
                    {logoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                          setLogoPreview('');
                          setFormData(prev => ({ ...prev, logo: undefined }));
                        }}
                      >
                        Remove
                      </Button>
                    )}
                    <p className="text-sm text-gray-500 mt-2">Or drag and drop</p>
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, JPEG, PNG image size: max 2 MB Ratio 1:1 (500 x 500 px)
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingCategory ? 'Update' : 'Submit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Category List */}
        <div className="space-y-6">
          {/* Category List Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Category list <Badge variant="secondary" className="ml-2">{filteredCategories.length}</Badge>
            </h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Input
                  placeholder="Search by category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Categories Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                                         <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Image</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                                         {filteredCategories.map((category, index) => (
                       <tr key={category.id} className="hover:bg-gray-50">
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {index + 1}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <Avatar className="w-10 h-10">
                             <img 
                               src={category.image || undefined} 
                               alt={category.name}
                               className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.style.display = 'none';
                               }}
                             />
                             <AvatarFallback className="bg-red-100 text-red-600">
                               {category.name.charAt(0).toUpperCase()}
                             </AvatarFallback>
                           </Avatar>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div>
                             <div className="text-sm font-medium text-gray-900">{category.name}</div>
                             <div className="text-sm text-gray-500">ID #{category.id}</div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {category.priority}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <Badge variant={category.isActive ? "default" : "secondary"}>
                             {category.isActive ? 'Active' : 'Inactive'}
                           </Badge>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <div className="flex space-x-2">
                             <button
                               onClick={() => handleEdit(category)}
                               className="text-blue-600 hover:text-blue-900"
                               title="Edit"
                             >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                               </svg>
                             </button>
                             <button
                               onClick={() => toggleStatus(category.id, 'isActive')}
                               className={`${category.isActive ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                               title={category.isActive ? 'Deactivate' : 'Activate'}
                             >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                             </button>
                             <button
                               onClick={() => handleDelete(category.id)}
                               className="text-red-600 hover:text-red-900"
                               title="Delete"
                             >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                               </svg>
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategorySetup;
