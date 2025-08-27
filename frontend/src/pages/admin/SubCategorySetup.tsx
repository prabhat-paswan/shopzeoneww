import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '../../components/ui/toast';

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  priority: number;
  isActive: boolean;
  categoryId: number;
  category?: { id: number; name: string };
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface SubCategoryFormData {
  name: string;
  priority: string;
  isActive: boolean;
  categoryId: string;
}

const SubCategorySetup: React.FC = () => {
  const { addToast } = useToast();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [activeLanguage, setActiveLanguage] = useState('en');

  const [formData, setFormData] = useState<SubCategoryFormData>({
    name: '',
    priority: '',
    isActive: true,
    categoryId: '',
  });

  // Fetch real data from API
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data?.categories || []);
      } else {
        console.error('Failed to fetch categories');
        setCategories([]);
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch categories'
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch categories'
      });
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subcategories');
      if (response.ok) {
        const data = await response.json();
        setSubCategories(data.data?.subCategories || []);
      } else {
        console.error('Failed to fetch subcategories');
        setSubCategories([]);
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch subcategories'
        });
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategories([]);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch subcategories'
      });
    }
  };

  const handleInputChange = (field: keyof SubCategoryFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingSubCategory) {
        // Update existing sub category
        const response = await fetch(`http://localhost:5000/api/subcategories/${editingSubCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            priority: parseInt(formData.priority),
            isActive: formData.isActive,
            categoryId: parseInt(formData.categoryId)
          })
        });

        if (response.ok) {
          const result = await response.json();
          addToast({
            type: 'success',
            title: 'Success',
            message: 'Sub category updated successfully'
          });
          await fetchSubCategories(); // Refresh data
        } else {
          const errorData = await response.json();
          addToast({
            type: 'error',
            title: 'Error',
            message: errorData.message || 'Failed to update sub category'
          });
          return;
        }
      } else {
        // Create new sub category
        const response = await fetch('http://localhost:5000/api/subcategories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            priority: parseInt(formData.priority),
            isActive: formData.isActive,
            categoryId: parseInt(formData.categoryId)
          })
        });

        if (response.ok) {
          const result = await response.json();
          addToast({
            type: 'success',
            title: 'Success',
            message: 'Sub category created successfully'
          });
          await fetchSubCategories(); // Refresh data
        } else {
          const errorData = await response.json();
          addToast({
            type: 'error',
            title: 'Error',
            message: errorData.message || 'Failed to create sub category'
          });
          return;
        }
      }
      
      // Reset form
      setFormData({
        name: '',
        priority: '',
        isActive: true,
        categoryId: '',
      });
      setEditingSubCategory(null);
      
    } catch (error) {
      console.error('Error saving sub category:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error saving sub category'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      priority: subCategory.priority.toString(),
      isActive: subCategory.isActive,
      categoryId: subCategory.categoryId.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sub category?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/subcategories/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          addToast({
            type: 'success',
            title: 'Success',
            message: 'Sub category deleted successfully'
          });
          await fetchSubCategories(); // Refresh data
        } else {
          const errorData = await response.json();
          addToast({
            type: 'error',
            title: 'Error',
            message: errorData.message || 'Failed to delete sub category'
          });
        }
      } catch (error) {
        console.error('Error deleting sub category:', error);
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Error deleting sub category'
        });
      }
    }
  };

  // const toggleStatus = async (id: number) => {
  //   try {
  //     const subCategory = subCategories.find(sc => sc.id === id);
  //     if (!subCategory) return;

  //     const response = await fetch(`http://localhost:5000/api/subcategories/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         is_active: !subCategory.isActive
  //       })
  //     });

  //     if (response.ok) {
  //       await fetchSubCategories(); // Refresh data
  //     } else {
  //       alert('Failed to toggle sub category status');
  //     }
  //   } catch (error) {
  //     console.error('Error toggling sub category status:', error);
  //     alert('Error toggling sub category status');
  //   }
  // };

  const handleExport = () => {
    // Simulate export functionality
    const csvContent = subCategories.map(subCat => 
      `${subCat.id},${subCat.name},${subCat.category?.name || 'N/A'},${subCat.priority},${subCat.isActive ? 'Active' : 'Inactive'}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sub-categories.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      priority: '',
      isActive: true,
      categoryId: '',
    });
    setEditingSubCategory(null);
  };

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
          Sub Category Setup
        </h1>
        <p className="text-gray-600">Manage your product sub categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sub Category Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Sub Category</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Language Tabs */}
            <div className="mb-6">
              <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="en">English(EN)</TabsTrigger>
                  <TabsTrigger value="ar">Arabic(SA)</TabsTrigger>
                  <TabsTrigger value="bn">Bangla(BD)</TabsTrigger>
                  <TabsTrigger value="hi">Hindi(IN)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sub Category Name */}
              <div>
                <Label htmlFor="name">
                  Sub category name * ({activeLanguage.toUpperCase()})
                </Label>
                <Input
                  id="name"
                  placeholder="New Sub Category"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              {/* Main Category */}
              <div>
                <Label htmlFor="categoryId">Main Category *</Label>
                <select
                  id="categoryId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <Label htmlFor="priority">Priority *</Label>
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
                  {loading ? 'Saving...' : editingSubCategory ? 'Update' : 'Submit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sub Category List */}
        <div className="space-y-6">
          {/* Sub Category List Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Sub Category List <Badge variant="secondary" className="ml-2">{subCategories.length}</Badge>
            </h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Input
                  placeholder="Search by sub categ"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Filter</span>
              </Button>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Sub Categories Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main Category Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subCategories.map((subCategory, index) => (
                      <tr key={subCategory.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{subCategory.name}</div>
                            <div className="text-sm text-gray-500">ID #{subCategory.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subCategory.category?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subCategory.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(subCategory)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(subCategory.id)}
                              className="text-red-600 hover:text-red-900"
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

export default SubCategorySetup;
