import { useEffect, useState } from 'react';
import api from '../api';
import SolIcon from '../img/solana.png';

export default function WalletPopup({ open, onClose }) {
  const [data, setData] = useState(null);
  const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

  useEffect(() => {
    if (!open || !userId) return;
    api.get(`/wallet/${userId}`).then(r => setData(r.data.user)).catch(() => setData(null));
  }, [open, userId]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sol-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">👻</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Phantom Wallet</h3>
              <p className="text-xs text-gray-400">Mock Implementation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
        {data ? (
          <div className="space-y-6">
            <div className="glass-effect rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Wallet Address</div>
              <div className="font-mono break-all text-sm text-white bg-black/30 p-3 rounded-lg border border-white/10">
                {data.wallet_address}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Balance</div>
              <div className="text-4xl font-bold flex items-center justify-center gap-3 text-white">
                <img src={SolIcon} alt="SOL" className="w-8 h-8" />
                {Number(data.balance).toFixed(2)}
                <span className="text-lg text-gray-400">SOL</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                ≈ ${(Number(data.balance) * 23.45).toFixed(2)} USD
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-sol-gradient rounded-xl font-medium hover:shadow-sol-glow transition-all duration-200">
                Send
              </button>
              <button className="flex-1 py-3 glass-effect rounded-xl font-medium hover:bg-white/20 transition-all duration-200 text-white">
                Receive
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-sol-purple border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-gray-400">Loading wallet...</div>
          </div>
        )}
      </div>
    </div>
  );
}


