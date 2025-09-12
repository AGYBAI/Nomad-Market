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
    <div className="card card-hover group overflow-hidden">
      {/* Image Section */}
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img 
          src={`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/listings/${item.id}/image`} 
          alt={item.title} 
          className="w-full h-56 object-cover bg-gray-800 group-hover:scale-110 transition-transform duration-500" 
          onError={(e)=>{
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMUIxQjJGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIHN0cm9rZT0iIzM3NDE1NSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0xMzAgODBMMTcwIDEyMEgxNjBWMTQwSDE0MFYxMjBIMTMwTDEzMCA4MFoiIGZpbGw9IiM5OTQ1RkYiLz4KPHR4dCB4PSIxNTAiIHk9IjE3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
          }} 
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 glass-effect rounded-lg px-3 py-2 border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">S</span>
            </div>
            <span className="text-sm font-bold text-white font-mono">{item.price}</span>
          </div>
        </div>
        
        {/* Owner Badge */}
        {isOwner && (
          <div className="absolute top-4 left-4 bg-purple-500/90 rounded-lg px-2 py-1">
            <span className="text-xs font-medium text-white">Your Listing</span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {item.description || 'No description provided'}
          </p>
        </div>
        
        {/* Seller Info */}
        <div className="flex items-center gap-3 text-xs">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {item.nickname?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <div className="text-gray-300 font-medium">@{item.nickname || 'Anonymous'}</div>
            <div className="text-gray-500">Seller</div>
          </div>
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-white font-mono">{item.price}</span>
              <span className="text-sm text-gray-400">SOL</span>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              ≈ ${estimatedUSD} USD
            </div>
          </div>
          
          {!isOwner ? (
            <button 
              onClick={handleBuy} 
              className="btn-primary px-6 py-2 text-sm font-medium"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z" />
              </svg>
              Buy Now
            </button>
          ) : (
            <button 
              className="btn-secondary px-6 py-2 text-sm font-medium cursor-default"
              disabled
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function openConfirm(title, message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in';
    modal.innerHTML = `
      <div class="card w-full max-w-md animate-scale-in">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">${title}</h3>
          <p class="text-gray-400 mb-6 leading-relaxed">${message}</p>
        </div>
        <div class="flex gap-3">
          <button id="cancelBtn" class="btn-secondary flex-1">Cancel</button>
          <button id="okBtn" class="btn-primary flex-1">Confirm Purchase</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    
    const cleanup = () => {
      modal.style.opacity = '0';
      setTimeout(() => document.body.removeChild(modal), 300);
    };
    
    modal.querySelector('#cancelBtn').onclick = () => { cleanup(); resolve(false); };
    modal.querySelector('#okBtn').onclick = () => { cleanup(); resolve(true); };
    modal.onclick = (e) => { if (e.target === modal) { cleanup(); resolve(false); } };
  });
}

function showBanner(text, type) {
  const el = document.createElement('div');
  el.className = `fixed top-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white z-50 font-medium backdrop-blur-sm border animate-slide-in-right ${
    type === 'success' 
      ? 'bg-green-500/90 border-green-400/50' 
      : 'bg-red-500/90 border-red-400/50'
  }`;
  
  el.innerHTML = `
    <div class="flex items-center gap-3">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
          type === 'success' 
            ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        }"></path>
      </svg>
      <span>${text}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white/70 hover:text-white">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}


