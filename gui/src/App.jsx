import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CreditCard, 
  TrendingUp, 
  Bell,
  User as UserIcon,
  ChevronRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Layout,
  Command,
  MoreHorizontal
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const INITIAL_CUSTOMERS = [
  { id: '1', account: '1001', name: 'John Doe', type: 'Premium', balance: 1250.50 },
  { id: '2', account: '1002', name: 'Jane Smith', type: 'Regular', balance: 450.00 },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('billing_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billing_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ account: '', name: '', type: 'Regular', balance: '' });

  // Login State
  const [loginEmail, setLoginEmail] = useState('admin@billing.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
  }, [customers]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === 'admin@billing.com' && loginPassword === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('billing_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Try admin@billing.com / admin123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('billing_auth');
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.account.includes(searchQuery)
  );

  const stats = {
    totalBalance: customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0),
    activeCustomers: customers.length,
    avgBalance: customers.length > 0 ? (customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0) / customers.length) : 0
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...formData } : c));
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...formData }]);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', type: 'Regular', balance: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-all duration-200 group",
        activeTab === id 
          ? "bg-white/10 text-white shadow-sm" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-4.5 h-4.5", activeTab === id ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
      <span className="text-[13px] font-medium tracking-tight">{label}</span>
    </button>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[400px] bg-[#2d2d2d] border border-white/10 rounded-2xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
              <Command className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">BillingPro</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-2.5 px-4 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                placeholder="admin@billing.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Password</label>
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-2.5 px-4 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <AnimatePresence>
              {loginError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[11px] text-center font-medium">
                  {loginError}
                </motion.p>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-[13px] font-bold transition-all mt-4"
            >
              Log In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1c1c1c] text-slate-300 font-sans selection:bg-blue-500/30">
      {/* macOS Sidebar */}
      <aside className="w-60 bg-[#252525]/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-4 z-20">
        {/* Traffic Lights */}
        <div className="flex gap-1.5 mb-8 px-2 pt-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>

        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-[13px] font-bold text-white tracking-tight">BillingPro</h1>
        </div>

        <nav className="flex-1 space-y-0.5">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="customers" icon={Users} label="Customers" />
          <SidebarItem id="analytics" icon={BarChart3} label="Analytics" />
          <SidebarItem id="settings" icon={SettingsIcon} label="Settings" />
        </nav>

        <div className="pt-4 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[13px] font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#1c1c1c] overflow-hidden">
        {/* Header / Titlebar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-[#1c1c1c]/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-widest opacity-80">
            {activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-1.5 hover:bg-white/5 rounded-md transition-all">
              <Bell className="w-4 h-4 text-slate-500" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
              <span className="text-[12px] font-medium text-slate-400">Adheesha</span>
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#2d2d2d] border border-white/5 p-6 rounded-2xl shadow-sm">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Balance</p>
                      <p className="text-2xl font-bold text-white tracking-tight">${stats.totalBalance.toLocaleString()}</p>
                      <div className="mt-4 flex items-center gap-2 text-blue-400 text-[11px] font-bold">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12.5% increase</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#2d2d2d] border border-white/5 p-6 rounded-2xl shadow-sm">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Customers</p>
                      <p className="text-2xl font-bold text-white tracking-tight">{stats.activeCustomers}</p>
                      <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
                        <Users className="w-3 h-3" />
                        <span>+3 this week</span>
                      </div>
                    </div>

                    <div className="bg-[#2d2d2d] border border-white/5 p-6 rounded-2xl shadow-sm">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg. Balance</p>
                      <p className="text-2xl font-bold text-white tracking-tight">${stats.avgBalance.toLocaleString()}</p>
                      <div className="mt-4 flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                        <TrendingUp className="w-3 h-3" />
                        <span>Stable</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2d2d2d] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-white/5">
                      <h3 className="text-[13px] font-bold text-white">Recent Activity</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center">
                              <Plus className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-[13px]">
                              <p className="font-semibold text-slate-200">New customer added</p>
                              <p className="text-[11px] text-slate-500">Customer #100{i} was successfully added</p>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-600">2h ago</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="relative w-72 group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Filter customers..."
                        className="w-full bg-[#2d2d2d] border border-white/5 rounded-lg py-2 pl-10 pr-4 text-[13px] focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', type: 'Regular', balance: '' }); setIsModalOpen(true); }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-[13px] font-bold transition-all shadow-lg shadow-blue-900/10 active:scale-95 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Customer
                    </button>
                  </div>

                  <div className="bg-[#2d2d2d] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/2 text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-white/5">
                          <th className="px-6 py-4">Account</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Balance</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-white/2 transition-colors group">
                            <td className="px-6 py-4 text-[13px] font-mono text-blue-400">{customer.account}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                                  {customer.name.charAt(0)}
                                </div>
                                <span className="text-[13px] font-semibold text-slate-200">{customer.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded border",
                                customer.type === 'Premium' 
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                              )}>
                                {customer.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[13px] font-semibold text-white">${parseFloat(customer.balance).toFixed(2)}</td>
                            <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => { setEditingCustomer(customer); setFormData({ account: customer.account, name: customer.name, type: customer.type, balance: customer.balance }); setIsModalOpen(true); }} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-blue-400">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(customer.id)} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-red-400">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-600 text-[13px]">No records found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#2d2d2d] border border-white/5 p-8 rounded-2xl min-h-[400px] flex flex-col">
                    <h3 className="text-[13px] font-bold text-white mb-8">Revenue Activity</h3>
                    <div className="flex-1 flex items-end gap-3 px-4">
                      {[30, 55, 40, 80, 65, 50, 70].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-full bg-blue-500/30 rounded-sm hover:bg-blue-500 transition-colors cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-[#2d2d2d] border border-white/5 p-6 rounded-2xl">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Growth Index</p>
                      <p className="text-2xl font-bold text-white">92.4%</p>
                    </div>
                    <div className="bg-[#2d2d2d] border border-white/5 p-8 rounded-2xl flex-1">
                      <h3 className="text-[13px] font-bold text-white mb-6">Top Performers</h3>
                      <div className="space-y-4">
                        {customers.sort((a, b) => b.balance - a.balance).slice(0, 3).map((c, i) => (
                          <div key={i} className="flex items-center justify-between text-[13px]">
                            <span className="text-slate-400">{c.name}</span>
                            <span className="font-bold text-white">${parseFloat(c.balance).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-xl space-y-6">
                  <div className="bg-[#2d2d2d] border border-white/5 p-8 rounded-2xl">
                    <h3 className="text-[13px] font-bold text-white mb-8 uppercase tracking-widest">Configuration</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <span className="text-[13px] font-semibold">Enable FaceID</span>
                        <div className="w-9 h-5 bg-blue-600 rounded-full flex items-center p-0.5">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <span className="text-[13px] font-semibold">Dark Mode Auto</span>
                        <div className="w-9 h-5 bg-slate-700 rounded-full flex items-center p-0.5">
                          <div className="w-4 h-4 bg-slate-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-[360px] bg-[#2d2d2d] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-6 tracking-tight">{editingCustomer ? 'Edit Entry' : 'New Entry'}</h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Account</label>
                  <input required className="w-full bg-[#1c1c1c] border border-white/5 rounded-lg px-4 py-2 text-[13px] focus:outline-none focus:border-blue-500/50" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Name</label>
                  <input required className="w-full bg-[#1c1c1c] border border-white/5 rounded-lg px-4 py-2 text-[13px] focus:outline-none focus:border-blue-500/50" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Type</label>
                    <select className="w-full bg-[#1c1c1c] border border-white/5 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-500/50" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Regular">Regular</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Balance</label>
                    <input required type="number" step="0.01" className="w-full bg-[#1c1c1c] border border-white/5 rounded-lg px-4 py-2 text-[13px] focus:outline-none focus:border-blue-500/50" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-[13px] font-bold hover:bg-slate-700">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-[13px] font-bold text-white hover:bg-blue-500">Confirm</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
