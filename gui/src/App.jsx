import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LogOut,
  User as UserIcon,
  CreditCard,
  Download,
  Filter,
  ChevronRight,
  MoreHorizontal,
  Command,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const INITIAL_CUSTOMERS = [
  { id: '1', account: 'BP-1001', name: 'Alexander Perera', email: 'alex@billingpro.io', type: 'Premium', balance: 125050.00, vatEnabled: true },
  { id: '2', account: 'BP-1002', name: 'Julian Silva', email: 'julian@billingpro.io', type: 'Standard', balance: 45200.00, vatEnabled: false },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('billing_auth') === 'true');
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billing_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
  }, [customers]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const filteredCustomers = useMemo(() => 
    customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.account.includes(searchQuery)
    ), [customers, searchQuery]
  );

  const stats = useMemo(() => ({
    total: customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0),
    count: customers.length
  }), [customers]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (e.target.password.value === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('billing_auth', 'true');
      addNotification('Authenticated successfully');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('billing_auth');
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const data = { ...formData, balance: parseFloat(formData.balance || 0) };
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...data } : c));
      addNotification('Record synchronized');
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...data }]);
      addNotification('New entity initialized');
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete node?')) {
      setCustomers(customers.filter(c => c.id !== id));
      addNotification('Record purged', 'error');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Command className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black tracking-tight">BillingPro</h1>
            <p className="text-slate-400 text-sm mt-1">Identity Management Console</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                <input name="password" type="password" required className="w-full border border-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-black transition-all bg-slate-50/50" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold active:scale-[0.98] transition-all shadow-xl shadow-black/10">Continue</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] text-slate-800 font-sans selection:bg-slate-200">
      {/* Notifications */}
      <div className="fixed top-8 right-8 z-[100] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={cn("px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] border bg-white", n.type === 'error' ? "border-red-100" : "border-slate-50")}>
              {n.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-slate-900" />}
              <span className="text-sm font-bold text-slate-900">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-8 z-20">
        <div className="flex items-center gap-3 mb-14 px-1">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
            <Command className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-black tracking-tighter">BillingPro</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'customers', icon: Users, label: 'Directory' },
            { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all group", activeTab === item.id ? "bg-slate-100 text-black" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")}>
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-black" : "text-slate-400 group-hover:text-slate-600")} />
                <span className="text-[13.5px] font-bold">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight className="w-3 h-3" />}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center">
              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-xs font-bold text-slate-900">Administrator</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-400 hover:text-red-500 rounded-xl transition-all text-[13.5px] font-bold group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-50 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{activeTab}</span>
          </div>
          <div className="flex items-center gap-5">
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full border border-white"></div>
            </button>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              
              {activeTab === 'customers' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative flex-1 w-full max-w-md group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                      <input type="text" placeholder="Search directory..." className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-slate-300 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-black transition-all shadow-sm"><Filter className="w-4.5 h-4.5" /></button>
                      <button onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false }); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-[13.5px] font-bold shadow-xl shadow-black/10 active:scale-95 transition-all">
                        <Plus className="w-4 h-4" /> New Entry
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-50 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#FBFBFB] text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                          <th className="px-8 py-5">Node</th>
                          <th className="px-8 py-5">Identification</th>
                          <th className="px-8 py-5">Type</th>
                          <th className="px-8 py-5 text-right">Balance</th>
                          <th className="px-8 py-5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                          <tr key={c.id} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-8 py-6">
                              <span className="text-xs font-bold text-slate-400">{c.account}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-bold text-slate-900 group-hover:scale-105 transition-transform overflow-hidden">
                                  <img src={`https://i.pravatar.cc/100?u=${c.id}`} alt="" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-black">{c.name}</p>
                                  <p className="text-[12px] text-slate-400">{c.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-tighter", c.type === 'Premium' ? "bg-black text-white border-black" : "bg-white text-slate-300 border-slate-100")}>{c.type}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <p className="text-sm font-bold text-black">Rs. {parseFloat(c.balance).toLocaleString()}</p>
                              {c.vatEnabled && <p className="text-[10px] font-bold text-slate-400 uppercase">+ Tax</p>}
                            </td>
                            <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-all">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => { setEditingCustomer(c); setFormData({ ...c }); setIsModalOpen(true); }} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-black transition-all"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-300 text-sm font-bold italic tracking-tight uppercase">Null results</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-100 p-10 rounded-[2rem] shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Portfolio Net Worth</p>
                      <p className="text-4xl font-bold text-black tracking-tighter">Rs. {stats.total.toLocaleString()}</p>
                      <div className="mt-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                        <span className="text-xs font-bold text-slate-500">Live reconciliation active</span>
                      </div>
                    </div>
                    <div className="bg-black p-10 rounded-[2rem] shadow-2xl text-white">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Entity Count</p>
                      <p className="text-4xl font-bold text-white tracking-tighter">{stats.count}</p>
                      <div className="mt-8 flex items-center gap-2">
                        <button onClick={() => setActiveTab('customers')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1">Manage directory <ChevronRight className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-all">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-1 tracking-tight">Extract Financial Report</h3>
                      <p className="text-sm text-slate-400">Compile registry data into a comprehensive CSV document.</p>
                    </div>
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <Download className="w-6 h-6" />
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-white/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[480px] bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
              <h3 className="text-2xl font-bold text-black mb-10 tracking-tight">{editingCustomer ? 'Update' : 'Register'} Node</h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reference ID</label>
                    <input required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-black transition-all" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                    <input required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-black transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Communication Endpoint</label>
                  <input required type="email" className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-black transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                    <select className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm focus:outline-none transition-all appearance-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Balance</label>
                    <input required type="number" className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-black transition-all" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3 px-1 py-1">
                  <input type="checkbox" id="vat" className="w-4 h-4 accent-black rounded" checked={formData.vatEnabled} onChange={(e) => setFormData({ ...formData, vatEnabled: e.target.checked })} />
                  <label htmlFor="vat" className="text-xs font-bold text-slate-500">Enable Tax Processing (18%)</label>
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-50 text-xs font-bold text-slate-400 hover:bg-slate-100 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3.5 rounded-2xl bg-black text-white text-xs font-bold hover:bg-slate-900 transition-all shadow-xl shadow-black/10">Commit</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
