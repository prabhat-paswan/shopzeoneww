import React, { useState, useRef } from 'react';
import axios from 'axios';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  duplicates: number;
  upserts: number;
  errors: Array<{
    row: number;
    sku: string;
    error: string;
  }>;
  failedRows: Array<{
    row: number;
    sku: string;
    error: string;
    data: any;
  }>;
}

const BulkImport: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [upsertMode, setUpsertMode] = useState<'skip' | 'upsert'>('upsert');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    setImportResult(null);
    
    if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.tsv')) {
      setError('Please select a valid CSV or TSV file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setCsvFile(file);
  };

  const handleUpload = async () => {
    if (!csvFile) {
      setError('Please select a CSV file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('upsertMode', upsertMode);

      const response = await axios.post('/api/admin/products/import-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setImportResult(response.data.results);
        setCsvFile(null);
      } else {
        setError(response.data.message || 'Import failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFailedRows = () => {
    if (!importResult?.failedRows) return;
    
    const csvHeaders = [
      'Product Code', 'Amazon ASIN', 'Name', 'Sku Id', 'Description',
      'Selling Price', 'MRP', 'Cost Price', 'Quantity',
      'Packaging Length (in cm)', 'Packaging Breadth (in cm)', 'Packaging Height (in cm)', 'Packaging Weight (in kg)',
      'GST %', 'Image 1', 'Image 2', 'Image 3', 'Image 4', 'Image 5',
      'Image 6', 'Image 7', 'Image 8', 'Image 9', 'Image 10',
      'Video 1', 'Video 2', 'Product Type', 'Size', 'Colour',
      'Return/Exchange Condition', 'HSN Code', 'Customisation Id',
      'Category Name', 'Sub Category Name', 'Store Name'
    ];
    
    const csvContent = [
      [...csvHeaders, 'Error Reason'].join(','),
      ...importResult.failedRows.map(row => {
        const csvRow = csvHeaders.map(header => {
          const value = row.data[header] || '';
          return `"${value}"`;
        });
        csvRow.push(`"${row.error}"`);
        return csvRow.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'failed_imports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const csvHeaders = [
      'Product Code', 'Amazon ASIN', 'Name', 'Sku Id', 'Description',
      'Selling Price', 'MRP', 'Cost Price', 'Quantity',
      'Packaging Length (in cm)', 'Packaging Breadth (in cm)', 'Packaging Height (in cm)', 'Packaging Weight (in kg)',
      'GST %', 'Image 1', 'Image 2', 'Image 3', 'Image 4', 'Image 5',
      'Image 6', 'Image 7', 'Image 8', 'Image 9', 'Image 10',
      'Video 1', 'Video 2', 'Product Type', 'Size', 'Colour',
      'Return/Exchange Condition', 'HSN Code', 'Customisation Id',
      'Category Name', 'Sub Category Name', 'Store Name'
    ];
    
    const sampleData: Record<string, string> = {
      'Product Code': 'PROD001',
      'Amazon ASIN': 'B08N5WRWNW',
      'Name': 'Sample Product',
      'Sku Id': 'SKU001',
      'Description': 'This is a sample product description',
      'Selling Price': '999.00',
      'MRP': '1299.00',
      'Cost Price': '799.00',
      'Quantity': '100',
      'Packaging Length (in cm)': '20',
      'Packaging Breadth (in cm)': '15',
      'Packaging Height (in cm)': '10',
      'Packaging Weight (in kg)': '0.5',
      'GST %': '18',
      'Image 1': 'product1.jpg',
      'Image 2': 'product1-2.jpg',
      'Image 3': '',
      'Image 4': '',
      'Image 5': '',
      'Image 6': '',
      'Image 7': '',
      'Image 8': '',
      'Image 9': '',
      'Image 10': '',
      'Video 1': '',
      'Video 2': '',
      'Product Type': 'Electronics',
      'Size': 'Standard',
      'Colour': 'Black',
      'Return/Exchange Condition': '7 days return',
      'HSN Code': '8517',
      'Customisation Id': '',
      'Category Name': 'Electronics',
      'Sub Category Name': 'Smartphones',
      'Store Name': 'My Store'
    };
    
    const csvContent = [
      csvHeaders.join(','),
      csvHeaders.map(header => {
        const value = sampleData[header] || '';
        return `"${value}"`;
      }).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setCsvFile(null);
    setImportResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Product Import</h1>
          <p className="text-gray-600 mb-6">
            Import multiple products at once using a CSV file. Use category names, subcategory names, and store names instead of IDs.
          </p>

          {/* Download Template */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Download CSV Template</h3>
            <p className="text-blue-700 mb-3">
              Use this template to ensure your CSV file has the correct format. Simply fill in your product details!
            </p>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Template
            </button>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {csvFile && (
              <p className="text-sm text-gray-600 mt-1">Selected: {csvFile.name}</p>
            )}
          </div>

          {/* Upload Options */}
          {csvFile && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Options</h3>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="upsert"
                    checked={upsertMode === 'upsert'}
                    onChange={(e) => setUpsertMode(e.target.value as 'skip' | 'upsert')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>Upsert existing products</strong> - Update products with matching SKU IDs
                  </span>
                </label>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="skip"
                    checked={upsertMode === 'skip'}
                    onChange={(e) => setUpsertMode(e.target.value as 'skip' | 'upsert')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>Skip existing products</strong> - Skip products with matching SKU IDs
                  </span>
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? 'Uploading...' : 'Start Import'}
                </button>
                
                <button
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Import Results</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{importResult.total}</div>
                  <div className="text-sm text-green-700">Total Rows</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{importResult.success}</div>
                  <div className="text-sm text-blue-700">Success</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{importResult.upserts}</div>
                  <div className="text-sm text-yellow-700">Updated</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600">{importResult.duplicates}</div>
                  <div className="text-sm text-gray-700">Skipped</div>
                </div>
              </div>

              {importResult.failed > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-red-800">
                      Failed Rows ({importResult.failed})
                    </h4>
                    <button
                      onClick={downloadFailedRows}
                      className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Download Failed Rows
                    </button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-red-700 uppercase">Row</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-red-700 uppercase">SKU</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-red-700 uppercase">Error</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-200">
                        {importResult.errors.slice(0, 10).map((error, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 text-red-800">{error.row}</td>
                            <td className="px-3 py-2 text-red-800">{error.sku}</td>
                            <td className="px-3 py-2 text-red-800">{error.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <button
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Import Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImport;
