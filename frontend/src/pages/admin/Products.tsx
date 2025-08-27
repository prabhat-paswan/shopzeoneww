import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  Search, 
  Filter,
  FileText,
  Image as ImageIcon,
  Package
} from 'lucide-react';
import { generateCSVTemplate } from '@/utils/csvTemplate';
import { useToast } from '@/components/ui/toast';

interface Product {
  id?: string;
  product_code: string;
  amazon_asin: string;
  sku_id: string;
  name: string;
  description: string;
  selling_price: number;
  mrp: number;
  cost_price: number;
  quantity: number;
  packaging_length: number;
  packaging_breadth: number;
  packaging_height: number;
  packaging_weight: number;
  gst_percentage: number;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
  image_6: string;
  image_7: string;
  image_8: string;
  image_9: string;
  image_10: string;
  video_1: string;
  video_2: string;
  size_chart: string;
  product_type: string;
  size: string;
  colour: string;
  return_exchange_condition: string;
  hsn_code: string;
  custom_attributes: string;
  is_active: boolean;
  is_featured: boolean;
  store_id: string; // Changed from number to string to handle UUIDs
  category_id: number;
  sub_category_id: number;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  category_id: number;
}

interface Store {
  id: string; // Changed from number to string to handle UUIDs
  name: string;
}

const Products: React.FC = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [selectedStore, setSelectedStore] = useState<string | ''>(''); // Changed from number to string
  const [isLoading, setIsLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch data from backend API
  useEffect(() => {
    const loadAllData = async () => {
      setIsDataLoading(true);
      
      try {
        await Promise.all([
          fetchCategories(),
          fetchSubCategories(),
          fetchStores(),
          fetchProducts()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        addToast({
          type: "error",
          title: "Error Loading Data",
          message: "Failed to load data. Please refresh the page.",
          duration: 5000,
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Monitor csvFile state changes
  useEffect(() => {
    // File state monitoring removed for cleaner code
  }, [csvFile]);





  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data?.categories || []);
      } else {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
              addToast({
          type: "error",
          title: "Error",
          message: "Failed to load categories",
          duration: 5000,
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
        throw new Error(`Failed to fetch subcategories: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      addToast({
        type: "error",
        title: "Error",
        message: "Failed to load subcategories",
        duration: 5000,
      });
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data.data?.stores || []);
      } else {
        throw new Error(`Failed to fetch stores: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      addToast({
        type: "error",
        title: "Error",
        message: "Failed to load stores",
        duration: 5000,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        // Handle different response structures
        const productsData = data.products || data.data?.products || data || [];
        setProducts(productsData);
      } else {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      addToast({
        type: "error",
        title: "Error",
        message: "Failed to load products",
        duration: 5000,
      });
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p.id !== id));
          
          // Also refresh the products list to ensure we have the latest data
          await fetchProducts();
          
          // Show success toast
          addToast({
            type: "success",
            title: "Success!",
            message: "Product deleted successfully!",
            duration: 3000,
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        
        // Show error toast
        addToast({
          type: "error",
          title: "Error",
          message: error instanceof Error ? error.message : 'Failed to delete product',
          duration: 5000,
        });
      }
    }
  };

  const handleSaveProduct = async (productData: Product) => {
    setIsUpdating(true);
    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        
        if (response.ok) {
          const updatedProduct = await response.json();
          
          // Update the products list with the updated product
          setProducts(prevProducts => {
            const updated = prevProducts.map(p => p.id === editingProduct.id ? updatedProduct.product : p);
            return updated;
          });
          
          // Also refresh the products list to ensure we have the latest data
          await fetchProducts();
          
          // Show success toast
          addToast({
            type: "success",
            title: "Success!",
            message: "Product updated successfully!",
            duration: 3000,
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update product');
        }
      } else {
        // Create new product
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        
        if (response.ok) {
          const result = await response.json();
          
          // Handle different response structures from backend
          let newProduct;
          if (result.product) {
            newProduct = result.product;
          } else if (result.data && result.data.product) {
            newProduct = result.data.product;
          } else if (result.id) {
            // If backend returns just the product object directly
            newProduct = result;
          } else {
            // Fallback: create a product object from the submitted data
            newProduct = {
              ...productData,
              id: Date.now().toString(), // Temporary ID
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          
          // Add the new product to the products list using functional update
          setProducts(prevProducts => {
            // Create a completely new array to ensure React detects the change
            const updatedProducts = [...prevProducts, newProduct];
            return updatedProducts;
          });
          
          // Also refresh the products list to ensure we have the latest data
          await fetchProducts();
          
          // Show success toast
          addToast({
            type: "success",
            title: "Success!",
            message: "Product created successfully!",
            duration: 3000,
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create product');
        }
      }
      
      // Close modal after successful save
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Show error toast
      addToast({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : 'Failed to save product',
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadCsvTemplate = () => {
    const headers = [
      'product_code',
      'amazon_asin',
      'sku_id',
      'name',
      'description',
      'selling_price',
      'mrp',
      'cost_price',
      'quantity',
      'packaging_length',
      'packaging_breadth',
      'packaging_height',
      'packaging_weight',
      'gst_percentage',
      'image_1',
      'image_2',
      'image_3',
      'image_4',
      'image_5',
      'image_6',
      'image_7',
      'image_8',
      'image_9',
      'image_10',
      'video_1',
      'video_2',
      'size_chart',
      'product_type',
      'size',
      'colour',
      'return_exchange_condition',
      'hsn_code',
      'custom_attributes',
      'is_active',
      'is_featured',
      'store_id',
      'category_id',
      'sub_category_id'
    ];
    
    const sampleData = [
      'PROD001',
      'B08N5WRWNW',
      'SKU001',
      'Sample Product',
      'This is a sample product description',
      '999.99',
      '1199.99',
      '800.00',
      '50',
      '15.0',
      '7.5',
      '0.8',
      '189',
      '18',
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'https://example.com/video1.mp4',
      '',
      'https://example.com/sizechart.jpg',
      'Electronics',
      'Standard',
      'Black',
      '7 days return policy',
      '8517',
      '{"feature1": "value1", "feature2": "value2"}',
      'true',
      'false',
      '1',
      '1',
      '1'
    ];
    
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file first!');
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('csv', csvFile);
      
      const response = await fetch('http://localhost:5000/api/products/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.errors && result.errors.length > 0) {
          // Show detailed error messages
          const errorMessage = `CSV Upload completed with ${result.errorCount} errors:\n\n${result.errors.slice(0, 10).join('\n')}${result.errors.length > 10 ? '\n\n... and ' + (result.errors.length - 10) + ' more errors' : ''}`;
          addToast({
            type: "error",
            title: "CSV Upload Completed with Errors",
            message: errorMessage,
            duration: 10000,
          });
        } else {
          addToast({
            type: "success",
            title: "Bulk Upload Success!",
            message: `Successfully uploaded ${result.uploaded} products!`,
            duration: 5000,
          });
        }
        
        // Refresh the products list
        await fetchProducts();
        
        setIsUploadModalOpen(false);
        setCsvFile(null);
        setUploadProgress(0);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload CSV');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addToast({
        type: "error",
        title: "CSV Upload Error",
        message: `Error uploading CSV: ${errorMessage}`,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    generateCSVTemplate();
  };

  const handleFileSelect = (file: File | null) => {
    setCsvFile(file);
  };

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || product.category_id === selectedCategory;
      const matchesStore = selectedStore === '' || product.store_id === selectedStore;
      
      return matchesSearch && matchesCategory && matchesStore;
    });
    return filtered;
  }, [products, searchTerm, selectedCategory, selectedStore]);

  // Show loading state
  if (isDataLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <div className="flex gap-3">
          {isUpdating && (
            <div className="flex items-center text-blue-600 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Updating...
            </div>
          )}
          <Button 
            onClick={async () => {
              setIsDataLoading(true);
              try {
                await fetchProducts();
              } catch (error) {
                console.error('Error refreshing products:', error);
              } finally {
                setIsDataLoading(false);
              }
            }} 
            variant="outline"
            disabled={isDataLoading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
          <Button onClick={downloadCsvTemplate} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={handleCreateProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="store">Store</Label>
              <select
                id="store"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Stores</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Code/SKU</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Store</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
                             <tbody>
                 {filteredProducts.length === 0 ? (
                   <tr>
                     <td colSpan={8} className="p-8 text-center">
                       <div className="text-gray-500">
                         <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                         <h3 className="text-lg font-medium mb-2">No products found</h3>
                         <p className="mb-4">
                           {searchTerm || selectedCategory || selectedStore 
                             ? 'Try adjusting your search or filters'
                             : 'Get started by adding your first product'
                           }
                         </p>
                         {!searchTerm && !selectedCategory && !selectedStore && (
                           <Button onClick={handleCreateProduct} size="sm">
                             <Plus className="w-4 h-4 mr-2" />
                             Add Your First Product
                           </Button>
                         )}
                       </div>
                     </td>
                   </tr>
                 ) : (
                   filteredProducts.map((product) => (
                     <tr key={product.id} className="border-b hover:bg-gray-50">
                       <td className="p-3">
                         <div className="flex items-center space-x-3">
                           <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                             {product.image_1 ? (
                               <img src={product.image_1} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                             ) : (
                               <ImageIcon className="w-6 h-6 text-gray-400" />
                             )}
                           </div>
                           <div>
                             <div className="font-medium text-gray-900">{product.name}</div>
                             <div className="text-sm text-gray-500">{product.product_type}</div>
                           </div>
                         </div>
                       </td>
                       <td className="p-3">
                         <div className="space-y-1">
                           <div className="text-sm font-medium">{product.product_code}</div>
                           <div className="text-xs text-gray-500">{product.sku_id}</div>
                         </div>
                       </td>
                       <td className="p-3">
                         <div className="space-y-1">
                           <div className="font-medium text-green-600">₹{product.selling_price}</div>
                           <div className="text-sm text-gray-500 line-through">₹{product.mrp}</div>
                         </div>
                       </td>
                       <td className="p-3">
                         <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                           {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                         </Badge>
                       </td>
                       <td className="p-3">
                         <div className="text-sm">
                           {categories.find(c => c.id === product.category_id)?.name || 'Unknown'} / 
                           {subCategories.find(sc => sc.id === product.sub_category_id)?.name || 'Unknown'}
                         </div>
                       </td>
                       <td className="p-3">
                         <div className="text-sm text-gray-600">
                           {stores.find(s => s.id === product.store_id)?.name || 'Unknown'}
                         </div>
                       </td>
                       <td className="p-3">
                         <div className="flex space-x-2">
                           <Badge variant={product.is_active ? "default" : "secondary"}>
                             {product.is_active ? 'Active' : 'Inactive'}
                           </Badge>
                           {product.is_featured && (
                             <Badge variant="outline">Featured</Badge>
                           )}
                         </div>
                       </td>
                       <td className="p-3">
                         <div className="flex space-x-2">
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleEditProduct(product)}
                           >
                             <Edit className="w-4 h-4" />
                           </Button>
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleDeleteProduct(product.id!)}
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          subCategories={subCategories}
          stores={stores}
          onSave={handleSaveProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* CSV Upload Modal */}
      {isUploadModalOpen && (
        <CsvUploadModal
          key={`upload-modal-${csvFile ? csvFile.name : 'no-file'}`}
          onUpload={handleCsvUpload}
          onClose={() => setIsUploadModalOpen(false)}
          isLoading={isLoading}
          progress={uploadProgress}
          csvFile={csvFile}
          onFileSelect={handleFileSelect}
          onDownloadTemplate={handleDownloadTemplate}
                 />
       )}
     </div>
   );
 };

// Product Modal Component
interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  subCategories: SubCategory[];
  stores: Store[];
  onSave: (product: Product) => void;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categories,
  subCategories,
  stores,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Product>({
    product_code: '',
    amazon_asin: '',
    sku_id: '',
    name: '',
    description: '',
    selling_price: 0,
    mrp: 0,
    cost_price: 0,
    quantity: 0,
    packaging_length: 0,
    packaging_breadth: 0,
    packaging_height: 0,
    packaging_weight: 0,
    gst_percentage: 0,
    image_1: '',
    image_2: '',
    image_3: '',
    image_4: '',
    image_5: '',
    image_6: '',
    image_7: '',
    image_8: '',
    image_9: '',
    image_10: '',
    video_1: '',
    video_2: '',
    size_chart: '',
    product_type: '',
    size: '',
    colour: '',
    return_exchange_condition: '',
    hsn_code: '',
    custom_attributes: '',
    is_active: true,
    is_featured: false,
    store_id: '',
    category_id: 0,
    sub_category_id: 0
  });

  // Reset form when creating new product
  useEffect(() => {
    if (!product) {
      // Creating new product - reset form
      setFormData({
        product_code: '',
        amazon_asin: '',
        sku_id: '',
        name: '',
        description: '',
        selling_price: 0,
        mrp: 0,
        cost_price: 0,
        quantity: 0,
        packaging_length: 0,
        packaging_breadth: 0,
        packaging_height: 0,
        packaging_weight: 0,
        gst_percentage: 0,
        image_1: '',
        image_2: '',
        image_3: '',
        image_4: '',
        image_5: '',
        image_6: '',
        image_7: '',
        image_8: '',
        image_9: '',
        image_10: '',
        video_1: '',
        video_2: '',
        size_chart: '',
        product_type: '',
        size: '',
        colour: '',
        return_exchange_condition: '',
        hsn_code: '',
        custom_attributes: '',
        is_active: true,
        is_featured: false,
        store_id: '',
        category_id: 0,
        sub_category_id: 0
      });
    }
  }, [product]);

  // Update form data when stores/categories change
  useEffect(() => {
    if (categories.length > 0 && (!formData.category_id || formData.category_id === 0)) {
      setFormData(prev => ({ ...prev, category_id: categories[0].id }));
    }
    if (subCategories.length > 0 && (!formData.sub_category_id || formData.sub_category_id === 0)) {
      setFormData(prev => ({ ...prev, sub_category_id: subCategories[0].id }));
    }
  }, [stores, categories, subCategories]);

  useEffect(() => {
    if (product) {
      // Ensure all required fields have valid values
      const updatedProduct = {
        ...product,
        store_id: product.store_id || '',
        category_id: product.category_id || (categories.length > 0 ? categories[0].id : 0),
        sub_category_id: product.sub_category_id || (subCategories.length > 0 ? subCategories[0].id : 0)
      };
      
      setFormData(updatedProduct);
    }
  }, [product, stores, categories, subCategories]);

  // Reset subcategory when category changes
  useEffect(() => {
    const currentSubCategory = subCategories.find(sc => sc.id === formData.sub_category_id);
    if (currentSubCategory && currentSubCategory.category_id !== formData.category_id) {
      // Reset subcategory if it doesn't match the new category
      setFormData(prev => ({ ...prev, sub_category_id: 1 }));
    }
  }, [formData.category_id, subCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.store_id || formData.store_id === '') {
      alert('Please select a store');
      return;
    }
    
    if (!formData.category_id || formData.category_id === 0) {
      alert('Please select a category');
      return;
    }
    
    if (!formData.sub_category_id || formData.sub_category_id === 0) {
      alert('Please select a subcategory');
      return;
    }
    
    onSave(formData);
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {product ? 'Edit Product' : 'Create New Product'}
            </h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product_code">Product Code *</Label>
                    <Input
                      id="product_code"
                      value={formData.product_code}
                      onChange={(e) => handleInputChange('product_code', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amazon_asin">Amazon ASIN</Label>
                    <Input
                      id="amazon_asin"
                      value={formData.amazon_asin}
                      onChange={(e) => handleInputChange('amazon_asin', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku_id">SKU ID *</Label>
                    <Input
                      id="sku_id"
                      value={formData.sku_id}
                      onChange={(e) => handleInputChange('sku_id', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product_type">Product Type</Label>
                    <Input
                      id="product_type"
                      value={formData.product_type}
                      onChange={(e) => handleInputChange('product_type', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                                      <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category_id">Category *</Label>
                    <select
                      id="category_id"
                      value={formData.category_id || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange('category_id', value ? Number(value) : 0);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      disabled={categories.length === 0}
                    >
                      {categories.length === 0 ? (
                        <option value="">No categories available</option>
                      ) : (
                        <>
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </>
                      )}
                    </select>
                    {categories.length === 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        ⚠️ No categories available. Please create a category first.
                      </div>
                    )}
                    {formData.category_id && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Selected: {categories.find(c => c.id === formData.category_id)?.name}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="sub_category_id">Sub Category *</Label>
                    <select
                      id="sub_category_id"
                      value={formData.sub_category_id || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange('sub_category_id', value ? Number(value) : 0);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      disabled={subCategories.length === 0 || !formData.category_id}
                    >
                      {subCategories.length === 0 ? (
                        <option value="">No subcategories available</option>
                      ) : !formData.category_id ? (
                        <option value="">Select a category first</option>
                      ) : (
                        <>
                          <option value="">Select a subcategory</option>
                          {/* Show subcategories for current category */}
                          {subCategories
                            .filter(sc => sc.category_id === formData.category_id)
                            .map(subCategory => (
                              <option key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                              </option>
                            ))}
                          {/* Show current subcategory if it exists but doesn't match current category */}
                          {formData.sub_category_id && 
                           subCategories.find(sc => sc.id === formData.sub_category_id) && 
                           subCategories.find(sc => sc.id === formData.sub_category_id)?.category_id !== formData.category_id && (
                            <optgroup label="Current Subcategory (Different Category)">
                              <option value={formData.sub_category_id}>
                                {subCategories.find(sc => sc.id === formData.sub_category_id)?.name} 
                                (Category: {categories.find(c => c.id === subCategories.find(sc => sc.id === formData.sub_category_id)?.category_id)?.name})
                              </option>
                            </optgroup>
                          )}
                        </>
                      )}
                    </select>
                    {subCategories.length === 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        ⚠️ No subcategories available. Please create a subcategory first.
                      </div>
                    )}
                    {formData.sub_category_id && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Selected: {subCategories.find(sc => sc.id === formData.sub_category_id)?.name}
                      </div>
                    )}
                    {formData.sub_category_id && 
                     subCategories.find(sc => sc.id === formData.sub_category_id)?.category_id !== formData.category_id && (
                      <div className="text-xs text-orange-600 mt-1">
                        ⚠️ Subcategory belongs to a different category. Consider changing it.
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="store_id">Store *</Label>
                    <select
                      id="store_id"
                      value={formData.store_id || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange('store_id', value);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      disabled={stores.length === 0}
                    >
                      {stores.length === 0 ? (
                        <option value="">No stores available</option>
                      ) : (
                        <>
                          <option value="">Select a store</option>
                          {stores.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                          ))}
                        </>
                      )}
                    </select>
                    {stores.length === 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        ⚠️ No stores available. Please create a store first.
                      </div>
                    )}
                    {formData.store_id && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Selected: {stores.find(s => s.id === formData.store_id)?.name}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Pricing & Stock Tab */}
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="selling_price">Selling Price *</Label>
                    <Input
                      id="selling_price"
                      type="number"
                      step="0.01"
                      value={formData.selling_price}
                      onChange={(e) => handleInputChange('selling_price', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mrp">MRP</Label>
                    <Input
                      id="mrp"
                      type="number"
                      step="0.01"
                      value={formData.mrp}
                      onChange={(e) => handleInputChange('mrp', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_price">Cost Price</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) => handleInputChange('cost_price', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Stock Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gst_percentage">GST Percentage</Label>
                    <Input
                      id="gst_percentage"
                      type="number"
                      step="0.01"
                      value={formData.gst_percentage}
                      onChange={(e) => handleInputChange('gst_percentage', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="packaging_length">Length (cm)</Label>
                    <Input
                      id="packaging_length"
                      type="number"
                      step="0.1"
                      value={formData.packaging_length}
                      onChange={(e) => handleInputChange('packaging_length', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packaging_breadth">Width (cm)</Label>
                    <Input
                      id="packaging_breadth"
                      type="number"
                      step="0.1"
                      value={formData.packaging_breadth}
                      onChange={(e) => handleInputChange('packaging_breadth', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packaging_height">Height (cm)</Label>
                    <Input
                      id="packaging_height"
                      type="number"
                      step="0.1"
                      value={formData.packaging_height}
                      onChange={(e) => handleInputChange('packaging_height', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packaging_weight">Weight (kg)</Label>
                    <Input
                      id="packaging_weight"
                      type="number"
                      step="0.1"
                      value={formData.packaging_weight}
                      onChange={(e) => handleInputChange('packaging_weight', Number(e.target.value))}
                    />
                  </div>
                </div>
              </TabsContent>

                             {/* Media Tab */}
               <TabsContent value="media" className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label>Product Images (Up to 10)</Label>
                     <div className="space-y-2">
                       {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                         <div key={num} className="space-y-2">
                           <div className="flex items-center space-x-2">
                             <Input
                               placeholder={`Image ${num} URL`}
                               value={formData[`image_${num}` as keyof Product] as string}
                               onChange={(e) => handleInputChange(`image_${num}` as keyof Product, e.target.value)}
                             />
                             <Button type="button" variant="outline" size="sm">
                               <Upload className="w-4 h-4" />
                             </Button>
                           </div>
                           {/* Image Preview */}
                           {formData[`image_${num}` as keyof Product] && (
                             <div className="w-20 h-20 border rounded-lg overflow-hidden">
                               <img 
                                 src={formData[`image_${num}` as keyof Product] as string}
                                 alt={`Preview ${num}`}
                                 className="w-full h-full object-cover"
                                 onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   target.style.display = 'none';
                                   const nextSibling = target.nextSibling as HTMLElement;
                                   if (nextSibling) nextSibling.style.display = 'flex';
                                 }}
                               />
                               <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{display: 'none'}}>
                                 <ImageIcon className="w-6 h-6 text-gray-400" />
                               </div>
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                   <div>
                     <Label>Videos & Size Chart</Label>
                     <div className="space-y-2">
                       <Input
                         placeholder="Video 1 URL"
                         value={formData.video_1}
                         onChange={(e) => handleInputChange('video_1', e.target.value)}
                       />
                       <Input
                         placeholder="Video 2 URL"
                         value={formData.video_2}
                         onChange={(e) => handleInputChange('video_2', e.target.value)}
                       />
                       <Input
                         placeholder="Size Chart URL"
                         value={formData.size_chart}
                         onChange={(e) => handleInputChange('size_chart', e.target.value)}
                       />
                     </div>
                   </div>
                 </div>
               </TabsContent>

               {/* Advanced Tab */}
               <TabsContent value="advanced" className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="size">Size</Label>
                     <Input
                       id="size"
                       value={formData.size}
                       onChange={(e) => handleInputChange('size', e.target.value)}
                     />
                   </div>
                   <div>
                     <Label htmlFor="colour">Colour</Label>
                     <Input
                       id="colour"
                       value={formData.colour}
                       onChange={(e) => handleInputChange('colour', e.target.value)}
                     />
                   </div>
                 </div>

                 <div>
                   <Label htmlFor="hsn_code">HSN Code</Label>
                   <Input
                     id="hsn_code"
                     value={formData.hsn_code}
                     onChange={(e) => handleInputChange('hsn_code', e.target.value)}
                   />
                 </div>

                 <div>
                   <Label htmlFor="return_exchange_condition">Return & Exchange Policy</Label>
                   <textarea
                     id="return_exchange_condition"
                     value={formData.return_exchange_condition}
                     onChange={(e) => handleInputChange('return_exchange_condition', e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-md h-20"
                   />
                 </div>

                 <div>
                   <Label htmlFor="custom_attributes">Custom Attributes</Label>
                   <textarea
                     id="custom_attributes"
                     value={formData.custom_attributes}
                     onChange={(e) => handleInputChange('custom_attributes', e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-md h-20"
                     placeholder="Enter custom attributes in JSON format or key-value pairs"
                   />
                 </div>

                 <div className="flex space-x-4">
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="is_active"
                       checked={formData.is_active}
                       onChange={(e) => handleInputChange('is_active', e.target.checked)}
                     />
                     <Label htmlFor="is_active">Active</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="is_featured"
                       checked={formData.is_featured}
                       onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                     />
                     <Label htmlFor="is_featured">Featured</Label>
                   </div>
                 </div>
               </TabsContent>
             </Tabs>

             <div className="flex justify-end space-x-3 pt-6 border-t">
               <Button type="button" variant="outline" onClick={onClose}>
                 Cancel
               </Button>
               <Button type="submit">
                 {product ? 'Update Product' : 'Create Product'}
               </Button>
             </div>
           </form>
         </div>
       </div>
     </div>
   );
 };

 // CSV Upload Modal Component
 interface CsvUploadModalProps {
   onUpload: () => void;
   onClose: () => void;
   isLoading: boolean;
   progress: number;
   csvFile: File | null;
   onFileSelect: (file: File | null) => void;
   onDownloadTemplate: () => void;
 }

 const CsvUploadModal: React.FC<CsvUploadModalProps> = ({
   onUpload,
   onClose,
   isLoading,
   progress,
   csvFile,
   onFileSelect,
   onDownloadTemplate
 }) => {
   const fileInputRef = React.useRef<HTMLInputElement>(null);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     
     if (file) {
       if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
         onFileSelect(file);
       } else {
         alert('Please select a valid CSV file (.csv extension)');
         onFileSelect(null);
         // Reset the file input
         e.target.value = '';
       }
     } else {
       onFileSelect(null);
     }
   };

   const resetFileInput = () => {
     if (fileInputRef.current) {
       fileInputRef.current.value = '';
     }
   };

   return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       <div className="bg-white rounded-lg w-full max-w-2xl">
         <div className="p-6">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold">Bulk Upload Products</h2>
             <Button variant="ghost" onClick={onClose}>✕</Button>
           </div>

           <div className="space-y-6">
             <div>
               <Label htmlFor="csv-file">Select CSV File</Label>
               <div className="mt-2">
                 <Input
                   ref={fileInputRef}
                   id="csv-file"
                   type="file"
                   accept=".csv"
                   onChange={handleFileChange}
                   disabled={isLoading}
                 />
               </div>
               <p className="text-sm text-gray-500 mt-1">
                 Maximum file size: 50MB. Supports up to 50,000 products.
               </p>
             </div>

             {csvFile && (
               <div className="p-4 bg-gray-50 rounded-lg">
                 <div className="flex items-center space-x-2">
                   <FileText className="w-5 h-5 text-blue-500" />
                   <span className="font-medium">{csvFile.name}</span>
                   <span className="text-sm text-gray-500">
                     ({(csvFile.size / 1024 / 1024).toFixed(2)} MB)
                   </span>
                 </div>
                 <div className="text-xs text-gray-500 mt-1">
                   File selected successfully - Ready to upload
                 </div>
               </div>
             )}

             {!csvFile && (
               <div className="p-4 bg-yellow-50 rounded-lg">
                 <div className="text-sm text-yellow-800">
                   ⚠️ No file selected. Please choose a CSV file to upload.
                 </div>
               </div>
             )}

             {isLoading && (
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span>Processing...</span>
                   <span>{progress}%</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2">
                   <div
                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                     style={{ width: `${progress}%` }}
                   />
                 </div>
               </div>
             )}

             <div className="bg-blue-50 p-4 rounded-lg">
               <h3 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
               <ul className="text-sm text-blue-800 space-y-1">
                 <li>• Product Code, ASIN, SKU ID, Product Name (required)</li>
                 <li>• Selling Price, MRP, Cost Price, Quantity (required)</li>
                 <li>• Category ID, Sub Category ID, Store ID (required)</li>
                 <li>• Images, Videos, Dimensions, GST, HSN Code (optional)</li>
                 <li>• Download sample CSV template for reference</li>
               </ul>
             </div>

             <div className="flex justify-between items-center">
               <Button variant="outline" onClick={onDownloadTemplate}>
                 <Download className="w-4 h-4 mr-2" />
                 Download Template
               </Button>
               <div className="flex space-x-3">
                 <Button variant="outline" onClick={onClose}>
                   Cancel
                 </Button>
                 <Button
                   onClick={onUpload}
                   disabled={!csvFile || isLoading}
                   className="min-w-[100px]"
                 >
                   {isLoading ? 'Processing...' : 'Upload'}
                 </Button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };

 export default Products;