import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Store, 
  Package, 
  ShoppingCart,
  DollarSign,
  // Eye,
  Star,
  Heart,
  Truck,
  // Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  // Mock data for charts
  const orderData = [
    { month: 'Jan', inhouse: 0, vendor: 0 },
    { month: 'Feb', inhouse: 0, vendor: 0 },
    { month: 'Mar', inhouse: 0, vendor: 0 },
    { month: 'Apr', inhouse: 0, vendor: 0 },
    { month: 'May', inhouse: 0, vendor: 0 },
    { month: 'Jun', inhouse: 0, vendor: 0 },
    { month: 'Jul', inhouse: 0, vendor: 0 },
    { month: 'Aug', inhouse: 0, vendor: 0 },
    { month: 'Sep', inhouse: 0, vendor: 0 },
    { month: 'Oct', inhouse: 0, vendor: 0 },
    { month: 'Nov', inhouse: 0, vendor: 0 },
    { month: 'Dec', inhouse: 0, vendor: 0 }
  ];

  const earningData = [
    { month: 'Jan', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Feb', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Mar', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Apr', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'May', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Jun', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Jul', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Aug', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Sep', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Oct', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Nov', inhouse: 0, vendor: 0, commission: 0 },
    { month: 'Dec', inhouse: 0, vendor: 0, commission: 0 }
  ];

  const userOverviewData = [
    { name: 'Customers', value: 7, color: '#60a5fa' },
    { name: 'Vendors', value: 10, color: '#f59e0b' },
    { name: 'Delivery Men', value: 4, color: '#1e40af' }
  ];

  // Mock data for top customers
  const topCustomers = [
    { name: 'Robert', orders: 137, avatar: null },
    { name: 'Devid', orders: 17, avatar: null },
    { name: 'Chris', orders: 5, avatar: null },
    { name: 'Anthony', orders: 3, avatar: null },
    { name: 'Paul', orders: 3, avatar: null },
    { name: 'Tom', orders: 1, avatar: null }
  ];

  // Mock data for popular stores
  const popularStores = [
    { name: 'Book Store', likes: 3, logo: null },
    { name: 'FootFinds', likes: 1, logo: null }
  ];

  // Mock data for top selling stores
  const topSellingStores = [
    { name: 'Bicycle Shop', revenue: 10892.20, logo: null },
    { name: 'Book Store', revenue: 10023.50, logo: null },
    { name: 'Hanover Electronics', revenue: 9590.01, logo: null },
    { name: 'liceria & co.', revenue: 408.00, logo: null }
  ];

  // Mock data for popular products
  const popularProducts = [
    { 
      name: 'Copper Alloy Inlaid Zircon Round Ring...', 
      rating: 5, 
      reviews: 3, 
      image: null 
    },
    { 
      name: '4 French Door Refrigerator', 
      rating: 5, 
      reviews: 2, 
      image: null 
    }
  ];

  // Mock data for top selling products
  const topSellingProducts = [
    { 
      name: 'iPhone 14 Pro Max', 
      sold: 9, 
      image: null 
    }
  ];

  // Mock data for top delivery men
  const topDeliveryMen = [
    { name: 'Demo Deliveryman', orders: 1, avatar: null },
    { name: 'Will Smith', orders: 10, avatar: null }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Admin</h1>
        <p className="text-gray-600 mt-2">Monitor your business analytics and statistics.</p>
      </div>

      {/* Business Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">190</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> new stores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">402</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> new customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
          <CardDescription>Current order distribution by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">58</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">21</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">9</div>
              <div className="text-sm text-gray-600">Packaging</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-gray-600">Out for Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">76</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">9</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">4</div>
              <div className="text-sm text-gray-600">Returned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">5</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Order Statistics
            </CardTitle>
            <CardDescription>Order trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Button
                variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('year')}
              >
                This Year
              </Button>
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
              >
                This Month
              </Button>
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('week')}
              >
                This Week
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="inhouse" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="vendor" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Inhouse</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Vendor</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Overview
            </CardTitle>
            <CardDescription>Total users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900">21</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={userOverviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userOverviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">7</div>
                <div className="text-xs text-gray-600">Customers</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600">10</div>
                <div className="text-xs text-gray-600">Vendors</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-800">4</div>
                <div className="text-xs text-gray-600">Delivery Men</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earning Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Earning Statistics
          </CardTitle>
          <CardDescription>Revenue breakdown over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button
              variant={selectedPeriod === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('year')}
            >
              This Year
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
            >
              This Month
            </Button>
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('week')}
            >
              This Week
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="inhouse" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              <Line type="monotone" dataKey="vendor" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              <Line type="monotone" dataKey="commission" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Inhouse</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Vendor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Commission</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Wallet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Admin Wallet
          </CardTitle>
          <CardDescription>Financial overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$39,892.00</div>
              <div className="text-sm text-gray-600">In-House Earning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">$12,755.02</div>
              <div className="text-sm text-gray-600">Commission Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$1,360.00</div>
              <div className="text-sm text-gray-600">Delivery Charge Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">$8,153.00</div>
              <div className="text-sm text-gray-600">Pending Amount</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Customers
            </CardTitle>
            <CardDescription>Customers with most orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-shopzeo-100 text-shopzeo-800">
                        {customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <Badge variant="secondary">
                    Orders: {customer.orders}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Popular Stores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Most Popular Stores
            </CardTitle>
            <CardDescription>Stores by popularity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularStores.map((store, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Store className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium">{store.name}</span>
                  </div>
                  <Badge variant="secondary">
                    {store.likes} likes
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Store */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Selling Store
            </CardTitle>
            <CardDescription>Stores by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingStores.map((store, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Store className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium">{store.name}</span>
                  </div>
                  <Badge variant="secondary">
                    ${store.revenue.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Popular Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Most Popular Products
            </CardTitle>
            <CardDescription>Products by rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="max-w-[150px]">
                      <span className="font-medium text-sm truncate block">{product.name}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(product.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-500">({product.reviews} Reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Selling Products
            </CardTitle>
            <CardDescription>Products by sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <Badge variant="secondary">
                    Sold: {product.sold}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Delivery Man */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Top Delivery Man
            </CardTitle>
            <CardDescription>Delivery personnel by orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDeliveryMen.map((delivery, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-shopzeo-100 text-shopzeo-800">
                        {delivery.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{delivery.name}</span>
                  </div>
                  <Badge variant="secondary">
                    {delivery.orders} Orders
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
