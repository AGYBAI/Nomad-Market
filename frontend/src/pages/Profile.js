import { useEffect, useState } from 'react';
import api from '../api';
import SolIcon from '../img/solana.png';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function Profile() {
  const [data, setData] = useState(null);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

  function load() {
    api.get(`/wallet/${userId}`).then(r => {
      setData(r.data);
      setEmail(r.data.user.email);
      setNickname(r.data.user.nickname);
    });
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setMsg(''); setErr('');
    if (password && !passwordRegex.test(password)) { setErr('Слабый пароль: aA1! и от 8 символов'); return; }
    try {
      const r = await api.put('/profile', { email, nickname, password: password || undefined });
      localStorage.setItem('user', JSON.stringify(r.data.user));
      setPassword('');
      setMsg('Пароль/профиль успешно сохранены');
      load();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Ошибка сохранения');
    }
  }

  if (!data) return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin w-8 h-8 border-2 border-sol-purple border-t-transparent rounded-full"></div>
    </div>
  );
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold sol-text-gradient mb-2">Profile</h1>
        <p className="text-xl text-gray-400">Manage your account and view your activity</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-effect rounded-2xl p-8 border border-white/20 shadow-sol-card hover:shadow-sol-hover transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">👤</span>
              Account Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  className="w-full p-3 glass-effect rounded-xl border border-white/20 bg-transparent text-white placeholder-gray-400 focus:border-sol-purple focus:ring-1 focus:ring-sol-purple outline-none transition-all duration-200" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nickname</label>
                <input 
                  className="w-full p-3 glass-effect rounded-xl border border-white/20 bg-transparent text-white placeholder-gray-400 focus:border-sol-purple focus:ring-1 focus:ring-sol-purple outline-none transition-all duration-200" 
                  value={nickname} 
                  onChange={e=>setNickname(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password (optional)</label>
                <div className="relative">
                  <input 
                    className="w-full p-3 glass-effect rounded-xl border border-white/20 bg-transparent text-white placeholder-gray-400 focus:border-sol-purple focus:ring-1 focus:ring-sol-purple outline-none transition-all duration-200" 
                    type={showPw?'text':'password'} 
                    placeholder="Enter new password" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    onClick={()=>setShowPw(s=>!s)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPw ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              {password && !passwordRegex.test(password) && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  Password must contain: 8+ characters, uppercase, lowercase, number, and special character
                </div>
              )}
              
              {msg && (
                <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm">
                  {msg}
                </div>
              )}
              
              {err && (
                <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm">
                  {err}
                </div>
              )}
              
              <button 
                onClick={save} 
                className="w-full py-3 bg-sol-gradient hover:shadow-sol-glow rounded-xl font-medium transition-all duration-200 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
          
          <div className="glass-effect rounded-2xl p-8 border border-white/20 shadow-sol-card hover:shadow-sol-hover transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm">📊</span>
              Transaction History
            </h2>
            <div className="space-y-4 max-h-80 overflow-auto custom-scrollbar">
              {data.transactions.map(t => (
                <div key={t.id} className="glass-effect rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">S</span>
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">{t.amount} SOL</div>
                        <div className="text-xs text-gray-400">Transaction</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">{new Date(t.created_at).toLocaleString()}</div>
                      <div className="text-green-400 text-xs font-medium">✓ Completed</div>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-gray-500 break-all bg-black/30 p-2 rounded border border-white/10">{t.tx_hash}</div>
                </div>
              ))}
              {data.transactions.length === 0 && (
                <div className="text-center py-8 text-gray-400">No transactions yet</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="glass-effect rounded-2xl p-8 border border-white/20 shadow-sol-card hover:shadow-sol-hover transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm">💰</span>
              Wallet
            </h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-400 mb-2">Address</div>
                <div className="font-mono text-xs text-white bg-black/30 p-3 rounded-lg border border-white/10 break-all">
                  {data.user.wallet_address}
                </div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="text-sm text-gray-400 mb-3 font-medium">Current Balance</div>
                <div className="text-4xl font-bold flex items-center justify-center gap-3 text-white mb-2">
                  <img src={SolIcon} alt="SOL" className="w-8 h-8" />
                  {Number(data.user.balance).toFixed(2)}
                  <span className="text-lg text-gray-400 font-normal">SOL</span>
                </div>
                <div className="text-lg text-gray-400 font-mono">
                  ≈ ${(Number(data.user.balance) * 23.45).toFixed(2)} USD
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Live Price</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-effect rounded-2xl p-8 border border-white/20 shadow-sol-card hover:shadow-sol-hover transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm">🪙</span>
              My Tokens
            </h2>
            <div className="space-y-4 max-h-60 overflow-auto custom-scrollbar">
              {data.tokens.map(t => (
                <div key={t.id} className="glass-effect rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-bold text-lg">Token #{t.id}</div>
                    <div className="text-green-400 text-sm font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Owned
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm mb-2">{t.title}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">S</span>
                    </div>
                    <span className="text-green-400 font-bold">{t.price} SOL</span>
                  </div>
                </div>
              ))}
              {data.tokens.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">🪙</div>
                  <div className="text-sm">No tokens owned</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-effect rounded-2xl p-8 border border-white/20 shadow-sol-card hover:shadow-sol-hover transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-sm">🔔</span>
              Notifications
            </h2>
            <div className="space-y-3 max-h-48 overflow-auto custom-scrollbar">
              {data.notifications.map(n => (
                <div key={n.id} className="glass-effect rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs text-white">🔔</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-200 text-sm leading-relaxed">{n.message}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
              {data.notifications.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">🔔</div>
                  <div className="text-sm">No notifications</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}