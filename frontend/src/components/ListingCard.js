import api from '../api';

export default function ListingCard({ item, onAction }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = user.id === item.user_id;
  
  async function handleBuy() {
    const token = localStorage.getItem('token');
    if (!token) {
      showBanner('Please sign in to make a purchase', 'error');
      return;
    }
    
    if (isOwner) {
      showBanner('You cannot buy your own listing', 'error');
      return;
    }
    
    const confirmed = await openConfirm(
      `Purchase "${item.title}" for ${item.price} SOL?`, 
      `This will transfer ${item.price} SOL from your wallet to the seller.`
    );
    if (!confirmed) return;
    
    try {
      await api.post('/purchase', { listingId: item.id });
      showBanner('Purchase completed successfully! 🎉', 'success');
      onAction && onAction();
    } catch (error) {
      showBanner('Purchase failed. Please try again.', 'error');
      console.error('Purchase error:', error);
    }
  }
  
  const estimatedUSD = (parseFloat(item.price) * 150).toFixed(2);
  
  return (
    <div className="glass-effect rounded-2xl p-6 border border-white/20 shadow-sol-card hover:shadow-sol-hover group overflow-hidden transition-all duration-300 hover:scale-105 hover:border-purple-500/30 mobile-listing-card">
      {/* Image Section */}
      <div className="relative mb-6 overflow-hidden rounded-xl">
        <img 
          src={`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/listings/${item.id}/image`} 
          alt={item.title} 
          className="w-full h-56 object-cover bg-gray-800 group-hover:scale-110 transition-transform duration-700" 
          onError={(e)=>{
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMUIxQjJGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIHN0cm9rZT0iIzM3NDE1NSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0xMzAgODBMMTcwIDEyMEgxNjBWMTQwSDE0MFYxMjBIMTMwTDEzMCA4MFoiIGZpbGw9IiM5OTQ1RkYiLz4KPHR4dCB4PSIxNTAiIHk9IjE3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
          }} 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 glass-effect rounded-xl px-4 py-2 border border-white/30 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-[10px] font-bold text-white">S</span>
            </div>
            <span className="text-lg font-bold text-white font-mono">{item.price}</span>
          </div>
        </div>
        
        {/* Owner Badge */}
        {isOwner && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl px-3 py-2 shadow-lg">
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <span>👑</span>
              Your Item
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-2xl mb-2">👁️</div>
            <div className="text-sm font-medium">View Details</div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="space-y-5">
        {/* Title and Description */}
        <div>
          <h3 className="font-bold text-xl text-white mb-3 line-clamp-1 group-hover:text-purple-300 transition-colors mobile-title">
            {item.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {item.description || 'No description provided'}
          </p>
        </div>
        
        {/* Seller Info */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {item.nickname?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">@{item.nickname || 'Anonymous'}</div>
            <div className="text-gray-400 text-xs">Verified Seller</div>
          </div>
          <div className="text-green-400 text-xs font-medium flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Online
          </div>
        </div>
        
        {/* Price and Action */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white">S</span>
                </div>
                <span className="text-2xl font-bold text-white font-mono">{item.price}</span>
                <span className="text-sm text-gray-400 font-medium">SOL</span>
              </div>
              <div className="text-sm text-gray-400 font-mono">
                ≈ ${estimatedUSD} USD
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Current Price</div>
              <div className="text-green-400 text-sm font-medium">Live</div>
            </div>
          </div>
          
          {!isOwner ? (
            <button 
              onClick={handleBuy} 
              className="w-full py-4 bg-sol-gradient hover:shadow-sol-glow rounded-xl font-bold transition-all duration-200 text-white text-lg hover:scale-105 flex items-center justify-center gap-2 mobile-button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z" />
              </svg>
              Buy Now
            </button>
          ) : (
            <div className="w-full py-4 glass-effect rounded-xl font-bold text-center text-white text-lg flex items-center justify-center gap-2 cursor-default">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your Item
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function openConfirm(title, message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in';
    modal.innerHTML = `
      <div class="glass-effect rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl animate-scale-in mobile-modal">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-3 mobile-title">${title}</h3>
          <p class="text-gray-300 mb-8 leading-relaxed text-lg mobile-text">${message}</p>
        </div>
        <div class="flex gap-4">
          <button id="cancelBtn" class="flex-1 py-4 glass-effect rounded-xl font-bold hover:bg-white/20 transition-all duration-200 text-white border border-white/20 mobile-button">
            Cancel
          </button>
          <button id="okBtn" class="flex-1 py-4 bg-sol-gradient hover:shadow-sol-glow rounded-xl font-bold transition-all duration-200 text-white hover:scale-105 mobile-button">
            Confirm Purchase
          </button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    
    const cleanup = () => {
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.95)';
      setTimeout(() => document.body.removeChild(modal), 300);
    };
    
    modal.querySelector('#cancelBtn').onclick = () => { cleanup(); resolve(false); };
    modal.querySelector('#okBtn').onclick = () => { cleanup(); resolve(true); };
    modal.onclick = (e) => { if (e.target === modal) { cleanup(); resolve(false); } };
  });
}

function showBanner(text, type) {
  const el = document.createElement('div');
  el.className = `fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl text-white z-50 font-bold backdrop-blur-md border-2 animate-slide-in-right mobile-notification ${
    type === 'success' 
      ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/50' 
      : 'bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/50'
  }`;
  
  el.innerHTML = `
    <div class="flex items-center gap-4">
      <div class="w-8 h-8 rounded-full flex items-center justify-center ${
        type === 'success' ? 'bg-green-400/30' : 'bg-red-400/30'
      }">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
            type === 'success' 
              ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          }"></path>
        </svg>
      </div>
      <div class="flex-1">
        <div class="text-lg font-bold">${text}</div>
        <div class="text-sm opacity-80">
          ${type === 'success' ? 'Transaction completed successfully!' : 'Please try again later.'}
        </div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%) scale(0.95)';
    setTimeout(() => el.remove(), 300);
  }, 4000);
}


