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
  Activity,
  ArrowUpRight,
  ArrowDownRight
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
      addNotification('Console Authenticated');
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
      addNotification('Synchronized');
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...data }]);
      addNotification('Initialized');
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete node?')) {
      setCustomers(customers.filter(c => c.id !== id));
      addNotification('Purged', 'error');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, category }) => (
    <div className="space-y-1">
      {category && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2 mt-6">{category}</p>}
      <button
        onClick={() => setActiveTab(id)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all group",
          activeTab === id ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
          <span className="text-[13px] font-bold">{label}</span>
        </div>
        {activeTab === id && <motion.div layoutId="sidebar-active" className="w-1 h-1 bg-white rounded-full" />}
      </button>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black tracking-tight">BillingPro</h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Admin Console</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                <input name="password" type="password" required className="w-full border border-slate-100 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-black transition-all bg-slate-50/50" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold active:scale-[0.98] transition-all shadow-xl shadow-black/10">Authorize</button>
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
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 z-20 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
            <Command className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-black tracking-tighter italic">BillingPro</h1>
        </div>

        <nav className="flex-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          
          <SidebarItem id="customers" icon={Users} label="Directory" category="Entities" />
          <SidebarItem id="groups" icon={MoreHorizontal} label="Groups" />
          
          <SidebarItem id="invoices" icon={FileText} label="Invoices" category="Finance" />
          <SidebarItem id="payments" icon={History} label="Payments" />
          <SidebarItem id="reports" icon={PieChart} label="Reports" />
          
          <SidebarItem id="activity" icon={Activity} label="Activity" category="System" />
          <SidebarItem id="support" icon={HelpCircle} label="Support" />
        </nav>

        <div className="pt-6 border-t border-slate-50 mt-8">
          <div className="flex items-center gap-3 px-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xs text-slate-400">
              AD
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-black text-black">Administrator</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Node</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-500 rounded-xl transition-all text-[13px] font-bold group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-50 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{activeTab} // active_stream</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Secure</span>
            </div>
            <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-slate-900 rounded-full border border-white"></div>
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
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                      <input type="text" placeholder="Query entities..." className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-slate-300 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-black transition-all shadow-sm"><Filter className="w-4.5 h-4.5" /></button>
                      <button onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false }); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95 transition-all">
                        <Plus className="w-4.5 h-4.5" /> Initialize
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-50 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FBFBFB] text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                          <th className="px-10 py-6">Node Ref</th>
                          <th className="px-10 py-6">Identification</th>
                          <th className="px-10 py-6">Tier</th>
                          <th className="px-10 py-6 text-right">Net Valuation</th>
                          <th className="px-10 py-6"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                          <tr key={c.id} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-10 py-8">
                              <span className="text-[11px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-100">#{c.account}</span>
                            </td>
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[15px] font-black text-slate-400 uppercase">
                                  {c.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="text-[15px] font-black text-black tracking-tight">{c.name}</p>
                                  <p className="text-[12px] font-bold text-slate-400 lowercase">{c.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <span className={cn("text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest", c.type === 'Premium' ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-300 border-slate-100")}>{c.type}</span>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <p className="text-[16px] font-black text-black tracking-tighter">Rs. {parseFloat(c.balance).toLocaleString()}</p>
                              {c.vatEnabled && <p className="text-[10px] font-black text-emerald-500 uppercase mt-0.5">Tax Encoded</p>}
                            </td>
                            <td className="px-10 py-8 text-right opacity-0 group-hover:opacity-100 transition-all">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => { setEditingCustomer(c); setFormData({ ...c }); setIsModalOpen(true); }} className="p-3 hover:bg-white rounded-xl text-slate-400 hover:text-black shadow-sm transition-all"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(c.id)} className="p-3 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className="px-10 py-32 text-center text-slate-300 text-sm font-black uppercase italic tracking-widest">No matching nodes located</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-8 border border-slate-50">
                    <History className="w-10 h-10 text-slate-200 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2 italic">Module {activeTab} // pending_sync</h3>
                  <p className="text-[13px] font-bold text-slate-300 uppercase tracking-widest">Interface for {activeTab} is currently being compiled.</p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-white/60 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[500px] bg-white border border-slate-100 rounded-[3rem] p-12 shadow-[0_60px_120px_rgba(0,0,0,0.1)]">
              <h3 className="text-3xl font-black text-black mb-12 tracking-tight uppercase italic">{editingCustomer ? 'Modify' : 'Initialize'} Node</h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Account ID</label>
                    <input required className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-black focus:outline-none focus:border-slate-900 transition-all" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                    <input required className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-black focus:outline-none focus:border-slate-900 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Email</label>
                  <input required type="email" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-black focus:outline-none focus:border-slate-900 transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tier Classification</label>
                    <select className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-black focus:outline-none transition-all appearance-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Balance</label>
                    <input required type="number" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-black focus:outline-none focus:border-slate-900 transition-all" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-4 px-2">
                  <input type="checkbox" id="vat" className="w-5 h-5 accent-slate-900 rounded-lg" checked={formData.vatEnabled} onChange={(e) => setFormData({ ...formData, vatEnabled: e.target.checked })} />
                  <label htmlFor="vat" className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">Processing Tax (18%)</label>
                </div>
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-[2rem] bg-slate-50 text-[13px] font-black text-slate-400 hover:bg-slate-100 transition-all uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-1 px-8 py-5 rounded-[2rem] bg-slate-900 text-white text-[13px] font-black hover:bg-black transition-all shadow-2xl shadow-black/20 active:scale-95 uppercase tracking-widest">Commit Node</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
