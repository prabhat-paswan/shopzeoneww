# Category Hierarchy API Documentation

This API provides hierarchical category data for e-commerce navigation, similar to the dropdown structure shown in the reference image.

## API Endpoints

### 1. Get Complete Category Hierarchy
**Endpoint:** `GET /api/categories/hierarchy`

**Description:** Fetches all main categories with their subcategories and items in a hierarchical structure.

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Men's Fashion",
      "slug": "mens-fashion",
      "image": "/uploads/categories/mens-fashion.jpg",
      "icon": "👔",
      "subcategories": [
        {
          "id": 1,
          "name": "Men's Watches",
          "slug": "mens-watches",
          "items": ["Fashion Watches", "Sports Watches", "Business Watches", "Smart Watches"]
        }
      ]
    }
  ]
}
```

**Use Case:** Admin panel, complete category management

---

### 2. Get Navigation Categories
**Endpoint:** `GET /api/categories/navigation`

**Description:** Fetches categories optimized for frontend navigation dropdown.

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Men's Fashion",
      "slug": "mens-fashion",
      "icon": "👔",
      "subcategories": [
        {
          "id": 1,
          "name": "Men's Watches",
          "slug": "mens-watches"
        }
      ]
    }
  ]
}
```

**Use Case:** Frontend navigation dropdown, mobile menu

---

### 3. Get Single Category with Subcategories
**Endpoint:** `GET /api/categories/:categoryId`

**Description:** Fetches a specific category by ID with all its subcategories.

**Parameters:**
- `categoryId` (number): The ID of the category to fetch

**Response Format:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Men's Fashion",
    "slug": "mens-fashion",
    "image": "/uploads/categories/mens-fashion.jpg",
    "description": "All men's fashion items",
    "icon": "👔",
    "subcategories": [
      {
        "id": 1,
        "name": "Men's Watches",
        "slug": "mens-watches",
        "priority": 1
      }
    ]
  }
}
```

**Use Case:** Category detail pages, breadcrumb navigation

---

## Features

### 🎯 **Hierarchical Structure**
- Main categories (level 1)
- Subcategories (level 2)
- Items within subcategories (level 3)

### 🎨 **Visual Elements**
- **Icons**: Emoji icons for each category (👔, 👗, 📱, 🏠, etc.)
- **Images**: Category banner images
- **Slugs**: URL-friendly category names

### 📱 **Responsive Design**
- Optimized for both desktop and mobile navigation
- Clean JSON structure for easy frontend integration

### 🔄 **Real-time Data**
- Fetches live data from database
- Respects `is_active` status
- Ordered by priority and name

---

## Database Schema Requirements

### Categories Table
```sql
- id (Primary Key)
- name (Category name)
- slug (URL-friendly name)
- image (Category image path)
- level (1 = main category)
- sort_order (Display priority)
- is_active (Status)
```

### Subcategories Table
```sql
- id (Primary Key)
- name (Subcategory name)
- slug (URL-friendly name)
- category_id (Foreign key to categories)
- priority (Display order)
- is_active (Status)
```

---

## Frontend Integration Example

### React Component Usage
```jsx
import { useState, useEffect } from 'react';

function CategoryDropdown() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/navigation');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="category-dropdown">
      {categories.map(category => (
        <div key={category.id} className="category-item">
          <span className="category-icon">{category.icon}</span>
          <span className="category-name">{category.name}</span>
          <div className="subcategories">
            {category.subcategories.map(sub => (
              <div key={sub.id} className="subcategory-item">
                {sub.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Testing

### 1. Test HTML File
Open `test-category-api.html` in your browser to test all endpoints.

### 2. API Testing
```bash
# Test category hierarchy
curl http://localhost:5000/api/categories/hierarchy

# Test navigation categories
curl http://localhost:5000/api/categories/navigation

# Test single category
curl http://localhost:5000/api/categories/1
```

---

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

Common HTTP Status Codes:
- `200`: Success
- `404`: Category not found
- `500`: Internal server error

---

## Performance Considerations

- **Caching**: Consider implementing Redis caching for frequently accessed categories
- **Pagination**: For large category lists, implement pagination
- **Lazy Loading**: Load subcategories on demand for better performance
- **CDN**: Serve category images through CDN for faster loading

---

## Future Enhancements

1. **Multi-level Categories**: Support for unlimited category levels
2. **Category SEO**: Meta tags, descriptions, keywords
3. **Category Analytics**: View counts, popular categories
4. **Category Permissions**: Role-based category access
5. **Category Templates**: Customizable category layouts

---

## Support

For questions or issues with the Category Hierarchy API, please check:
1. Database connections and associations
2. Model relationships in `models/associations.js`
3. Server logs for detailed error messages
4. API response format in `category-api-example.json`
