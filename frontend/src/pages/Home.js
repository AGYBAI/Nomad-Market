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
  const [categories] = useState([
    { name: 'Electronics', icon: '📱' },
    { name: 'Vehicles', icon: '🚗' },
    { name: 'Real Estate', icon: '🏠' },
    { name: 'Fashion', icon: '👗' }
  ]);

  async function load() {
    try {
      setLoading(true);
      const response = await api.get('/listings', { params: { q, minPrice, maxPrice } });
      setItems(response.data);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate category counts from actual data
  const getCategoryCount = (categoryName) => {
    return items.filter(item => 
      item.title?.toLowerCase().includes(categoryName.toLowerCase()) ||
      item.description?.toLowerCase().includes(categoryName.toLowerCase())
    ).length;
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Hero - 3 columns */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8" style={{
              background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)'
            }}>
              {/* Floating NFT Elements */}
              <div className="absolute right-8 top-8 opacity-20">
                <svg width="240" height="160" viewBox="0 0 240 160" fill="none">
                  {/* Floating NFT Cards */}
                  <rect x="40" y="20" width="60" height="60" rx="8" fill="white" fillOpacity="0.3" />
                  <rect x="42" y="22" width="56" height="40" rx="4" fill="white" fillOpacity="0.2" />
                  <circle cx="70" cy="72" r="4" fill="white" fillOpacity="0.4" />
                  
                  <rect x="140" y="40" width="60" height="60" rx="8" fill="white" fillOpacity="0.25" />
                  <rect x="142" y="42" width="56" height="40" rx="4" fill="white" fillOpacity="0.15" />
                  <circle cx="170" cy="92" r="4" fill="white" fillOpacity="0.3" />
                  
                  <rect x="90" y="80" width="60" height="60" rx="8" fill="white" fillOpacity="0.2" />
                  <rect x="92" y="82" width="56" height="40" rx="4" fill="white" fillOpacity="0.1" />
                  <circle cx="120" cy="132" r="4" fill="white" fillOpacity="0.25" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium text-white">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Live Marketplace
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  Buy & Sell
                  <br />
                  <span className="text-white/90">Everything</span>
                </h1>
                <p className="text-lg text-white/80 mb-6 max-w-lg leading-relaxed">
                  Find great deals on electronics, cars, real estate, and more. 
                  Kazakhstan's trusted marketplace for buying and selling.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {
                      const listingsSection = document.querySelector('#listings');
                      if (listingsSection) {
                        listingsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                  >
                    🛍️ Browse Items
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Status */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Platform Status</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Listings</span>
                  <span className="text-green-400">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Categories</span>
                  <span className="text-white">{categories.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400">Online</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="card p-6">
              <h4 className="text-white font-semibold mb-4">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{items.length}</div>
                  <div className="text-xs text-gray-400">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{categories.length}</div>
                  <div className="text-xs text-gray-400">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">SOL Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">SOL</div>
                  <div className="text-xs text-gray-400">Currency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Categories */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">Browse by Category</h2>
          <p className="text-gray-400">Find what you're looking for across all categories</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const categoryCount = getCategoryCount(category.name);
            return (
              <div key={index} className="card p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group border border-white/10 hover:border-purple-500/30">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{category.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{categoryCount} items</p>
                <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{width: `${Math.min(100, (categoryCount / Math.max(1, items.length)) * 100)}%`}}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Advanced Search */}
      <section className="card p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">Find What You Need</h3>
          <p className="text-gray-400 text-sm">Search through thousands of items from trusted sellers</p>
        </div>
        <div className="space-y-4">
          <div>
            <input 
              className="input-field w-full text-lg py-4" 
              placeholder="🔍 Search cars, phones, apartments, jobs..." 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <input 
                className="input-field w-full pr-16" 
                placeholder="Min Price" 
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
              <input 
                className="input-field w-full pr-16" 
                placeholder="Max Price" 
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
            <button onClick={load} className="btn-primary py-3 px-6 font-semibold">
              🔍 Search Items
            </button>
          </div>
        </div>
      </section>

      {/* Featured Marketplace */}
      <section id="listings">
        <div className="mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Listings</h2>
            <p className="text-gray-400">Popular items from verified sellers</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {items.slice(0, 8).map((item, index) => (
              <div key={item.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <ListingCard item={item} onAction={load} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


