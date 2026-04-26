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
  AlertCircle,
  FileText,
  History,
  PieChart,
  HelpCircle,
  Shield,
  Activity
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
      addNotification('Authenticated');
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
      addNotification('Registry Synchronized');
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...data }]);
      addNotification('Entity Registered');
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this record?')) {
      setCustomers(customers.filter(c => c.id !== id));
      addNotification('Record Deleted', 'error');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, category }) => (
    <div className="space-y-1">
      {category && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] px-4 mb-2 mt-6">{category}</p>}
      <button
        onClick={() => setActiveTab(id)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all group",
          activeTab === id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
          <span className="text-[14px] font-medium">{label}</span>
        </div>
        {activeTab === id && <motion.div layoutId="sidebar-active" className="w-1 h-1 bg-white rounded-full" />}
      </button>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[380px]">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">BillingPro</h1>
            <p className="text-slate-400 text-xs mt-1 font-medium tracking-widest uppercase">Secured Gateway</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Access Credentials</label>
                <input name="password" type="password" required className="w-full border border-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-slate-300 transition-all bg-slate-50/30" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all">Sign In</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-slate-100">
      {/* Notifications */}
      <div className="fixed top-8 right-8 z-[100] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={cn("px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 min-w-[280px] border bg-white border-slate-50")}>
              {n.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-slate-900" />}
              <span className="text-sm font-medium text-slate-900">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 z-20 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 px-1 pt-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Command className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">BillingPro</h1>
        </div>

        <nav className="flex-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          
          <SidebarItem id="customers" icon={Users} label="Directory" category="Management" />
          <SidebarItem id="groups" icon={MoreHorizontal} label="Client Groups" />
          
          <SidebarItem id="invoices" icon={FileText} label="Invoices" category="Financials" />
          <SidebarItem id="payments" icon={History} label="Transactions" />
          <SidebarItem id="reports" icon={PieChart} label="Performance" />
          
          <SidebarItem id="activity" icon={Activity} label="Activity Logs" category="System" />
          <SidebarItem id="support" icon={HelpCircle} label="Documentation" />
        </nav>

        <div className="pt-6 border-t border-slate-50 mt-8">
          <div className="flex items-center gap-3 px-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-400">
              AD
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-slate-900">Administrator</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Console</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-500 rounded-xl transition-all text-[13px] font-medium group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-50 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">{activeTab} // session_active</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">System Online</span>
            </div>
            <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              
              {activeTab === 'customers' ? (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative flex-1 w-full max-w-md group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                      <input type="text" placeholder="Search directory..." className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-slate-300 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"><Filter className="w-4.5 h-4.5" /></button>
                      <button onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false }); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[13px] font-semibold transition-all hover:bg-black active:scale-95 shadow-sm">
                        <Plus className="w-4 h-4" /> New Entity
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#FBFBFB] text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-100">
                          <th className="px-10 py-5">Reference</th>
                          <th className="px-10 py-5">Merchant Details</th>
                          <th className="px-10 py-5">Classification</th>
                          <th className="px-10 py-5 text-right">Net Value</th>
                          <th className="px-10 py-5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                          <tr key={c.id} className="group hover:bg-slate-50/30 transition-all">
                            <td className="px-10 py-8 text-xs font-semibold text-slate-400">{c.account}</td>
                            <td className="px-10 py-8">
                              <p className="text-[15px] font-semibold text-slate-900 tracking-tight">{c.name}</p>
                              <p className="text-[12px] text-slate-400 font-medium">{c.email}</p>
                            </td>
                            <td className="px-10 py-8">
                              <span className={cn("text-[10px] font-semibold px-3 py-1 rounded-lg border uppercase tracking-widest", c.type === 'Premium' ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-100")}>{c.type}</span>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <p className="text-[15px] font-semibold text-slate-900">Rs. {parseFloat(c.balance).toLocaleString()}</p>
                              {c.vatEnabled && <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Tax Applied</p>}
                            </td>
                            <td className="px-10 py-8 text-right opacity-0 group-hover:opacity-100 transition-all">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => { setEditingCustomer(c); setFormData({ ...c }); setIsModalOpen(true); }} className="p-2.5 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(c.id)} className="p-2.5 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className="px-10 py-32 text-center text-slate-300 text-sm font-medium uppercase italic tracking-widest">No entries located</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 border border-slate-100 rounded-[3rem] bg-slate-50/30">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-50">
                    <History className="w-8 h-8 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-400 uppercase tracking-widest mb-1 italic">Module: {activeTab}</h3>
                  <p className="text-[12px] font-medium text-slate-300 uppercase tracking-widest">Interface currently in preparation</p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/5 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full max-w-[480px] bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-xl">
              <h3 className="text-2xl font-semibold text-slate-900 mb-10 tracking-tight">{editingCustomer ? 'Modify' : 'Register'} Node</h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Reference ID</label>
                    <input required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-300 transition-all" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                    <input required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-300 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Email Endpoint</label>
                  <input required type="email" className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-300 transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                    <select className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none transition-all appearance-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Current Balance</label>
                    <input required type="number" className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-300 transition-all" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3 px-1 py-1">
                  <input type="checkbox" id="vat" className="w-4.5 h-4.5 accent-slate-900 rounded" checked={formData.vatEnabled} onChange={(e) => setFormData({ ...formData, vatEnabled: e.target.checked })} />
                  <label htmlFor="vat" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enable Tax Processing (18%)</label>
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-50 text-xs font-semibold text-slate-400 hover:bg-slate-100 transition-all uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all shadow-sm uppercase tracking-widest">Commit</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
