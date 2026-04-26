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
          ? "bg-slate-900/5 text-slate-900 shadow-sm" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-900/5"
      )}
    >
      <Icon className={cn("w-4.5 h-4.5", activeTab === id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
      <span className="text-[13px] font-semibold tracking-tight">{label}</span>
    </button>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[400px] bg-white border border-slate-200 rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/20">
              <Command className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">BillingPro</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[13px] text-slate-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                placeholder="admin@billing.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[13px] text-slate-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <AnimatePresence>
              {loginError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[12px] text-center font-bold">
                  {loginError}
                </motion.p>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-[14px] font-bold transition-all mt-4 shadow-lg shadow-blue-600/10 active:scale-95"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-700 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* macOS Sidebar */}
      <aside className="w-64 bg-[#F5F5F7]/80 backdrop-blur-2xl border-r border-slate-200 flex flex-col p-5 z-20">
        <div className="flex items-center gap-3 mb-10 px-2 pt-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/10">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">BillingPro</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="customers" icon={Users} label="Customers" />
          <SidebarItem id="analytics" icon={BarChart3} label="Analytics" />
          <SidebarItem id="settings" icon={SettingsIcon} label="Settings" />
        </nav>

        <div className="pt-5 border-t border-slate-200 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span className="text-[13px] font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {activeTab}
          </h2>
          <div className="flex items-center gap-5">
            <button className="p-2 hover:bg-slate-50 rounded-full transition-all">
              <Bell className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-100">
              <div className="text-right">
                <p className="text-[12px] font-bold text-slate-900">Adheesha</p>
                <p className="text-[10px] text-slate-400">Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow cursor-default group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-600 transition-colors">Total Revenue</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">${stats.totalBalance.toLocaleString()}</p>
                      <div className="mt-5 flex items-center gap-2 text-blue-600 text-[12px] font-bold">
                        <TrendingUp className="w-4 h-4" />
                        <span>12.5% Growth</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow cursor-default group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-600 transition-colors">Active Users</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.activeCustomers}</p>
                      <div className="mt-5 flex items-center gap-2 text-emerald-600 text-[12px] font-bold">
                        <Users className="w-4 h-4" />
                        <span>3 New Accounts</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow cursor-default group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-600 transition-colors">Yield Average</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">${stats.avgBalance.toLocaleString()}</p>
                      <div className="mt-5 flex items-center gap-2 text-slate-400 text-[12px] font-bold">
                        <BarChart3 className="w-4 h-4" />
                        <span>Performance Stable</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-[14px] font-black text-slate-900">Recent Transactions</h3>
                      <button className="text-[12px] font-bold text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                              <Plus className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-slate-900">Record Entry</p>
                              <p className="text-[12px] text-slate-400">System updated customer #100{i} billing data</p>
                            </div>
                          </div>
                          <span className="text-[12px] font-bold text-slate-300">Today, 10:4{i} AM</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="relative w-80 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search records..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-[13px] text-slate-900 focus:outline-none focus:border-blue-300 transition-all placeholder:text-slate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', type: 'Regular', balance: '' }); setIsModalOpen(true); }}
                      className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-[13px] font-black transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      New Record
                    </button>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-8 py-5">Account</th>
                          <th className="px-8 py-5">Entity Name</th>
                          <th className="px-8 py-5">Classification</th>
                          <th className="px-8 py-5">Net Worth</th>
                          <th className="px-8 py-5 text-right">Settings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-6 text-[13px] font-bold text-blue-600">{customer.account}</td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-black text-slate-500">
                                  {customer.name.charAt(0)}
                                </div>
                                <span className="text-[14px] font-bold text-slate-900">{customer.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={cn(
                                "text-[10px] font-black px-3 py-1 rounded-full border",
                                customer.type === 'Premium' 
                                  ? "bg-blue-600 text-white border-blue-600" 
                                  : "bg-white text-slate-400 border-slate-200"
                              )}>
                                {customer.type}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-[14px] font-black text-slate-900">${parseFloat(customer.balance).toFixed(2)}</td>
                            <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => { setEditingCustomer(customer); setFormData({ account: customer.account, name: customer.name, type: customer.type, balance: customer.balance }); setIsModalOpen(true); }} className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-all">
                                  <Edit2 className="w-4.5 h-4.5" />
                                </button>
                                <button onClick={() => handleDelete(customer.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-600 transition-all">
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className="px-8 py-24 text-center text-slate-300 font-bold tracking-tight">No entities found in registry</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] min-h-[450px] flex flex-col">
                    <h3 className="text-[14px] font-black text-slate-900 mb-10 uppercase tracking-widest">Revenue Projection</h3>
                    <div className="flex-1 flex items-end gap-4 px-4">
                      {[30, 55, 40, 80, 65, 50, 70].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-full bg-blue-600/10 rounded-xl hover:bg-blue-600 transition-all cursor-pointer shadow-sm" />
                          <span className="text-[10px] font-black text-slate-300">W{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency Ratio</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">98.2%</p>
                    </div>
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] flex-1 text-white shadow-2xl">
                      <h3 className="text-[14px] font-black mb-8 uppercase tracking-widest text-slate-400">High Worth Entities</h3>
                      <div className="space-y-6">
                        {customers.sort((a, b) => b.balance - a.balance).slice(0, 3).map((c, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[14px] font-bold text-slate-200">{c.name}</span>
                            <span className="font-black text-blue-400">${parseFloat(c.balance).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-8">
                  <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm">
                    <h3 className="text-[14px] font-black text-slate-900 mb-10 uppercase tracking-widest">Global Configuration</h3>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between py-5 border-b border-slate-50">
                        <div>
                          <p className="text-[14px] font-black">Biometric Security</p>
                          <p className="text-[12px] text-slate-400">Use system biometric verification for login.</p>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center p-1">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-5 border-b border-slate-50">
                        <div>
                          <p className="text-[14px] font-black">Automatic Sync</p>
                          <p className="text-[12px] text-slate-400">Backup your data to the cloud automatically.</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-100 rounded-full flex items-center p-1 border border-slate-200">
                          <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-[400px] bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_30px_70px_rgba(0,0,0,0.15)]">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingCustomer ? 'Update Entry' : 'Create Entry'}</h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Entity Account</label>
                  <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-400" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Entity Full Name</label>
                  <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-400" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Classification</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] font-bold focus:outline-none focus:border-blue-400 appearance-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Regular">Regular</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Net Value</label>
                    <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-400" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3.5 rounded-xl bg-slate-100 text-[13px] font-black text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3.5 rounded-xl bg-blue-600 text-[13px] font-black text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Submit</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
