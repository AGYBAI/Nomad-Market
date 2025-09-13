import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ListingCard from '../components/ListingCard';

export default function Home() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [categories] = useState([
    { name: 'All', icon: '🌟', color: 'from-purple-500 to-pink-500' },
    { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
    { name: 'Vehicles', icon: '🚗', color: 'from-green-500 to-emerald-500' },
    { name: 'Real Estate', icon: '🏠', color: 'from-orange-500 to-red-500' },
    { name: 'Fashion', icon: '👗', color: 'from-pink-500 to-rose-500' },
    { name: 'Sports', icon: '⚽', color: 'from-yellow-500 to-orange-500' },
    { name: 'Books', icon: '📚', color: 'from-indigo-500 to-purple-500' },
    { name: 'Art', icon: '🎨', color: 'from-teal-500 to-green-500' }
  ]);

  async function load() {
    try {
      setLoading(true);
      const response = await api.get('/listings', { params: { q, minPrice, maxPrice } });
      let filteredItems = response.data;
      
      // Filter by category
      if (selectedCategory !== 'All') {
        filteredItems = filteredItems.filter(item => 
          item.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          item.description?.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
      
      // Sort items
      filteredItems.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at) - new Date(a.created_at);
          case 'oldest':
            return new Date(a.created_at) - new Date(b.created_at);
          case 'price-low':
            return parseFloat(a.price) - parseFloat(b.price);
          case 'price-high':
            return parseFloat(b.price) - parseFloat(a.price);
          default:
            return 0;
        }
      });
      
      setItems(filteredItems);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, minPrice, maxPrice, selectedCategory, sortBy]);

  // Calculate category counts from actual data
  const getCategoryCount = (categoryName) => {
    if (categoryName === 'All') return items.length;
    return items.filter(item => 
      item.title?.toLowerCase().includes(categoryName.toLowerCase()) ||
      item.description?.toLowerCase().includes(categoryName.toLowerCase())
    ).length;
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
           item.description?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Hero - 3 columns */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 group mobile-hero" style={{
              background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)'
            }}>
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/15 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/25 rounded-full animate-ping"></div>
              </div>
              
              {/* Floating Cards Animation */}
              <div className="absolute right-8 top-8 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/30 rounded-xl rotate-12 animate-float"></div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl -rotate-6 absolute -top-2 -right-2 animate-float" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-12 h-12 bg-white/25 rounded-xl rotate-45 absolute top-4 -left-4 animate-float" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white border border-white/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Live Marketplace
                    <span className="ml-2 text-xs bg-green-500/30 px-2 py-1 rounded-full">Beta</span>
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Discover & Trade
                  <br />
                  <span className="text-white/90 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Digital Assets
                  </span>
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                  The future of commerce is here. Buy, sell, and trade anything on the Solana blockchain. 
                  Fast, secure, and decentralized marketplace for the modern world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      const listingsSection = document.querySelector('#listings');
                      if (listingsSection) {
                        listingsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl text-lg"
                  >
                    🛍️ Explore Marketplace
                  </button>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 text-lg"
                  >
                    🔍 Advanced Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Status */}
            <div className="glass-effect rounded-2xl p-6 border border-white/20 shadow-sol-card hover:shadow-sol-hover transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-white font-bold text-lg">Platform Status</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Active Listings</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-400">{items.length}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Categories</span>
                  <span className="text-2xl font-bold text-purple-400">{categories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">Online</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Uptime</span>
                  <span className="text-blue-400 font-bold">99.9%</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="glass-effect rounded-2xl p-6 border border-white/20 shadow-sol-card hover:shadow-sol-hover transition-all duration-300">
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                📊 Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-4 mobile-stats">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{items.length}</div>
                  <div className="text-xs text-gray-300 font-medium">Total Items</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <div className="text-3xl font-bold text-green-400 mb-1">{categories.length}</div>
                  <div className="text-xs text-gray-300 font-medium">Categories</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-300 font-medium">SOL Volume</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">SOL</div>
                  <div className="text-xs text-gray-300 font-medium">Currency</div>
                </div>
              </div>
            </div>

            {/* Trending Categories */}
            <div className="glass-effect rounded-2xl p-6 border border-white/20 shadow-sol-card hover:shadow-sol-hover transition-all duration-300">
              <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                🔥 Trending
              </h4>
              <div className="space-y-3">
                {categories.slice(0, 4).map((category, index) => {
                  const count = getCategoryCount(category.name);
                  return (
                    <div key={category.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-sm`}>
                          {category.icon}
                        </div>
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">{count}</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Categories */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover amazing items across all categories. From electronics to art, find exactly what you need.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mobile-grid">
          {categories.map((category, index) => {
            const categoryCount = getCategoryCount(category.name);
            const isSelected = selectedCategory === category.name;
            return (
              <div 
                key={index} 
                onClick={() => setSelectedCategory(category.name)}
                className={`glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group border-2 mobile-category ${
                  isSelected 
                    ? 'border-purple-500/50 bg-purple-500/10 shadow-sol-glow' 
                    : 'border-white/10 hover:border-purple-500/30'
                }`}
              >
                <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  isSelected ? 'animate-bounce' : ''
                }`}>
                  {category.icon}
                </div>
                <h3 className={`font-bold text-lg mb-2 transition-colors ${
                  isSelected ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
                }`}>
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 font-medium">{categoryCount} items</p>
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-r from-purple-500/70 to-pink-500/70'
                    }`} 
                    style={{width: `${Math.min(100, (categoryCount / Math.max(1, items.length)) * 100)}%`}}
                  ></div>
                </div>
                {isSelected && (
                  <div className="mt-3 text-xs text-purple-300 font-medium animate-pulse">
                    ✓ Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Advanced Search */}
      <section className={`glass-effect rounded-2xl p-8 border border-white/20 shadow-sol-card transition-all duration-500 mobile-search ${
        showFilters ? 'mb-8' : 'mb-0'
      }`}>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            🔍 Find What You Need
            <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
              Smart Search
            </span>
          </h3>
          <p className="text-gray-400">Search through thousands of items from trusted sellers with our advanced filters</p>
        </div>
        
        <div className="space-y-6">
          {/* Main Search Bar */}
          <div className="relative">
            <input 
              className="input-field w-full text-lg py-4 pl-12 pr-4" 
              placeholder="Search cars, phones, apartments, jobs..." 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</div>
            {q && (
              <button 
                onClick={() => setQ('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          <div className={`transition-all duration-500 overflow-hidden ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Price (SOL)</label>
                <input 
                  className="input-field w-full pr-16" 
                  placeholder="0.00" 
                  type="number"
                  step="0.01"
                  value={minPrice} 
                  onChange={e=>setMinPrice(e.target.value)} 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm">SOL</span>
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Price (SOL)</label>
                <input 
                  className="input-field w-full pr-16" 
                  placeholder="100.00" 
                  type="number"
                  step="0.01"
                  value={maxPrice} 
                  onChange={e=>setMaxPrice(e.target.value)} 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm">SOL</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select 
                  className="input-field w-full" 
                  value={sortBy} 
                  onChange={e=>setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={load} 
                  className="btn-primary w-full py-3 px-6 font-semibold hover:scale-105 transition-all duration-200"
                >
                  🔍 Search Items
                </button>
              </div>
            </div>
          </div>

          {/* Search Actions */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 glass-effect rounded-lg hover:bg-white/20 transition-all duration-200 text-white font-medium"
            >
              {showFilters ? '🔼 Hide Filters' : '🔽 Show Filters'}
            </button>
            <button 
              onClick={() => {
                setQ('');
                setMinPrice('');
                setMaxPrice('');
                setSelectedCategory('All');
                setSortBy('newest');
              }}
              className="px-4 py-2 glass-effect rounded-lg hover:bg-white/20 transition-all duration-200 text-white font-medium"
            >
              🗑️ Clear All
            </button>
            <div className="ml-auto text-sm text-gray-400 flex items-center gap-2">
              <span>Found {filteredItems.length} items</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Marketplace */}
      <section id="listings">
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {selectedCategory === 'All' ? 'Featured Listings' : `${selectedCategory} Items`}
              </h2>
              <p className="text-xl text-gray-400">
                {selectedCategory === 'All' 
                  ? 'Popular items from verified sellers' 
                  : `Discover amazing ${selectedCategory.toLowerCase()} items`
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Showing {filteredItems.length} of {items.length} items
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-effect rounded-2xl p-6 border border-white/20 animate-pulse">
                <div className="aspect-square bg-gray-700/50 rounded-xl mb-4"></div>
                <div className="h-5 bg-gray-700/50 rounded mb-3"></div>
                <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-700/50 rounded w-20"></div>
                  <div className="h-10 bg-gray-700/50 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <ListingCard item={item} onAction={load} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-300 mb-4">No Items Found</h3>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
              {selectedCategory === 'All' 
                ? "We couldn't find any items matching your search criteria."
                : `No ${selectedCategory.toLowerCase()} items found. Try a different category or search term.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setQ('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSelectedCategory('All');
                }}
                className="px-6 py-3 bg-sol-gradient rounded-xl font-medium hover:shadow-sol-glow transition-all duration-200 text-white"
              >
                🔄 Reset Filters
              </button>
              <button 
                onClick={() => {
                  const searchSection = document.querySelector('#search');
                  if (searchSection) {
                    searchSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3 glass-effect rounded-xl font-medium hover:bg-white/20 transition-all duration-200 text-white"
              >
                🔍 Try Different Search
              </button>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {filteredItems.length > 0 && filteredItems.length >= 8 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 glass-effect rounded-xl font-bold hover:bg-white/20 transition-all duration-200 text-white text-lg border border-white/20 hover:border-purple-500/50">
              📦 Load More Items
            </button>
          </div>
        )}
      </section>
    </div>
  );
}


