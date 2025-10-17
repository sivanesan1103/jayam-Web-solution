import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Cards from '../components/Cards'
import { useAppContext } from '../context/AppContext'

const MainPage = () => {
  const { products } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  // Get unique categories
  const categories = ['all', ...new Set(products.filter(p => p.category).map(p => p.category))]

  // Apply filters
  const filteredProducts = products.filter(product => {
    
    if (searchQuery && product.title) {
      if (!product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
    }
    
s
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false
    }
    
    
    const price = Number(product.price) || 0
    if (priceRange === 'under50' && price >= 50) return false
    if (priceRange === '50to100' && (price < 50 || price > 100)) return false
    if (priceRange === '100to200' && (price <= 100 || price > 200)) return false
    if (priceRange === 'above200' && price <= 200) return false
    
    // Product passes all filters
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Filters Section */}
      <div className="bg-white shadow-sm  top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="under50">Under $50</option>
                <option value="50to100">$50 - $100</option>
                <option value="100to200">$100 - $200</option>
                <option value="above200">Above $200</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <Cards products={filteredProducts} />
      </div>
    </div>
  )
}

export default MainPage
