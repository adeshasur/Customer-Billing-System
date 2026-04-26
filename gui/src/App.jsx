import React, { useState, useEffect, useMemo } from 'react';
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
  Command,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Globe
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const INITIAL_CUSTOMERS = [
  { id: '1', account: 'CB-1001', name: 'Nimal Perera', email: 'nimal.p@gmail.com', phone: '+94 77 123 4567', type: 'Premium', balance: 125050.00, status: 'Active', lastSeen: '2h ago', city: 'Colombo' },
  { id: '2', account: 'CB-1002', name: 'Sunil Silva', email: 'sunil.s@outlook.com', phone: '+94 71 987 6543', type: 'Regular', balance: 45200.00, status: 'Pending', lastSeen: '5h ago', city: 'Kandy' },
  { id: '3', account: 'CB-1003', name: 'Kasun Jayasuriya', email: 'kasun.j@yahoo.com', phone: '+94 70 555 1212', type: 'Premium', balance: 890400.00, status: 'Active', lastSeen: '1h ago', city: 'Galle' },
  { id: '4', account: 'CB-1004', name: 'Dilshan Fernando', email: 'dilshan.f@company.lk', phone: '+94 76 222 3344', type: 'Regular', balance: 12500.00, status: 'Active', lastSeen: 'Just now', city: 'Negombo' },
];

const REVENUE_DATA = [
  { name: 'Jan', value: 450000 },
  { name: 'Feb', value: 320000 },
  { name: 'Mar', value: 580000 },
  { name: 'Apr', value: 290000 },
  { name: 'May', value: 410000 },
  { name: 'Jun', value: 530000 },
  { name: 'Jul', value: 640000 },
];

const COLORS = ['#2563eb', '#9333ea', '#db2777', '#f59e0b'];

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2
  }).format(val).replace('LKR', 'Rs.');
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('billing_auth') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billing_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ account: '', name: '', email: '', phone: '', type: 'Regular', balance: '', status: 'Active', city: 'Colombo' });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
  }, [customers]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const filteredCustomers = useMemo(() => 
    customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.account.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
    ), [customers, searchQuery]
  );

  const stats = {
    totalBalance: customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0),
    activeCustomers: customers.filter(c => c.status === 'Active').length,
    premiumRate: Math.round((customers.filter(c => c.type === 'Premium').length / customers.length) * 100) || 0
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('billing_auth');
    addNotification('Logged out safely. Have a great day!');
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...formData } : c));
      addNotification(`Profile for ${formData.name} updated.`);
    } else {
      setCustomers([...customers, { id: Date.now().toString(), lastSeen: 'Just now', ...formData }]);
      addNotification(`New entity ${formData.name} registered.`);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', email: '', phone: '', type: 'Regular', balance: '', status: 'Active', city: 'Colombo' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this record permanently?')) {
      setCustomers(customers.filter(c => c.id !== id));
      addNotification('Record removed from local registry.', 'error');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-4 w-full px-5 py-3.5 rounded-2xl transition-all duration-300 group relative",
        activeTab === id 
          ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      )}
    >
      <Icon className={cn("w-5.5 h-5.5", activeTab === id ? "text-blue-400" : "text-slate-400 group-hover:text-slate-600")} />
      <span className="text-[15px] font-black tracking-tight">{label}</span>
      {activeTab === id && (
        <motion.div layoutId="sidebar-dot" className="absolute right-4 w-1.5 h-1.5 bg-blue-400 rounded-full" />
      )}
    </button>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8 font-sans selection:bg-blue-100">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[440px] space-y-10">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-slate-900/10">
              <Globe className="w-10 h-10 text-white animate-spin-slow" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">BillingPro <span className="text-blue-600">SL</span></h1>
            <p className="text-slate-400 font-black text-[12px] uppercase tracking-[0.4em] mt-3">Lanka Enterprise Gateway</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 shadow-sm">
            <form onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              if (email === 'admin@billing.lk' && password === 'admin123') {
                setIsLoggedIn(true);
                localStorage.setItem('billing_auth', 'true');
                addNotification('Ayubowan! Welcome to BillingPro.');
              } else {
                addNotification('Login Failed: Check Credentials', 'error');
              }
            }} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-[0.2em]">Email Address</label>
                <input name="email" type="email" required defaultValue="admin@billing.lk" className="w-full bg-white border border-slate-200 rounded-2xl py-4.5 px-6 text-[15px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-[0.2em]">Security Key</label>
                <input name="password" type="password" required className="w-full bg-white border border-slate-200 rounded-2xl py-4.5 px-6 text-[15px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-sm" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/10 active:scale-95">Secure Sign In</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-700 font-sans selection:bg-blue-100">
      {/* Toast Notifications */}
      <div className="fixed top-10 right-10 z-[100] space-y-4 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className={cn("px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 min-w-[340px] border", n.type === 'error' ? "bg-red-600 text-white border-red-500" : "bg-white text-slate-900 border-slate-100")}>
              {n.type === 'error' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6 text-blue-600" />}
              <span className="text-[14px] font-black">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside className="w-80 bg-slate-50 border-r border-slate-100 flex flex-col p-8 z-20">
        <div className="flex items-center gap-4 mb-14 px-2 pt-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-900/10">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">BillingPro <span className="text-blue-600">SL</span></h1>
            <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] mt-1">LANKA EDITION</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          <SidebarItem id="customers" icon={Users} label="Entity Registry" />
          <SidebarItem id="analytics" icon={BarChart3} label="Revenue Hub" />
          <SidebarItem id="settings" icon={SettingsIcon} label="Configurations" />
        </nav>

        <div className="pt-8 border-t border-slate-200 mt-auto">
          <div className="bg-white p-5 rounded-[2rem] mb-8 flex items-center gap-4 shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
              <img src="https://i.pravatar.cc/100?u=admin" alt="admin" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-[15px] font-black text-slate-900">Admin SL</p>
              <p className="text-[11px] font-bold text-slate-400">Colombo, LK</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-4 w-full px-6 py-4 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group">
            <LogOut className="w-5.5 h-5.5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[14px] font-black uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-24 bg-white/90 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-12 sticky top-0 z-10">
          <h2 className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em]">{activeTab} node // active</h2>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
              <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Network Live</span>
            </div>
            <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all relative group">
              <Bell className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.99 }} transition={{ duration: 0.3 }}>
              
              {activeTab === 'dashboard' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:bg-white transition-all group overflow-hidden relative">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-hover:text-blue-600 transition-colors">Total Revenue (LKR)</p>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatCurrency(stats.totalBalance)}</p>
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-emerald-600 text-[13px] font-black bg-emerald-50 w-fit px-3 py-1 rounded-full">
                        <ArrowUpRight className="w-4 h-4" /> 12.5% vs Prev Month
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:bg-white transition-all group relative">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-hover:text-blue-600 transition-colors">Active Merchants</p>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.activeCustomers}</p>
                        <span className="text-[14px] font-bold text-slate-400 mb-1.5">Across LK</span>
                      </div>
                      <div className="mt-8 flex -space-x-3 overflow-hidden">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-slate-50 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:bg-white transition-all group">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-hover:text-blue-600 transition-colors">Premium Penetration</p>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.premiumRate}%</p>
                        <span className="text-[14px] font-bold text-slate-400 mb-1.5">Tier 01 Entities</span>
                      </div>
                      <div className="mt-8 w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${stats.premiumRate}%` }} className="h-full bg-slate-900 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-sm">
                      <div className="flex items-center justify-between mb-12">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revenue Velocity</h3>
                          <p className="text-[14px] font-bold text-slate-400 mt-1">Quarterly growth analysis 2026</p>
                        </div>
                        <button className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"><Download className="w-5 h-5 text-slate-600" /></button>
                      </div>
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={REVENUE_DATA}>
                            <defs>
                              <linearGradient id="colorLKR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 800, fill: '#cbd5e1' }} dy={15} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 800, fill: '#cbd5e1' }} />
                            <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '14px' }} />
                            <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorLKR)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-[3.5rem] p-12 shadow-2xl text-white relative overflow-hidden">
                      <h3 className="text-2xl font-black tracking-tight mb-12">Regional Distribution</h3>
                      <div className="h-[350px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customers.slice(0, 4)} dataKey="balance" nameKey="city" cx="50%" cy="50%" innerRadius={90} outerRadius={130} paddingAngle={10}>
                              {customers.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={12} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                          <p className="text-4xl font-black text-white tracking-tighter">SL</p>
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">Edition</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="relative w-full md:w-[450px] group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input type="text" placeholder="Search by name, city or CB-Account..." className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 text-[16px] font-bold text-slate-900 focus:outline-none focus:ring-8 focus:ring-blue-600/5 focus:border-blue-300 transition-all shadow-sm placeholder:text-slate-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', email: '', phone: '', type: 'Regular', balance: '', status: 'Active', city: 'Colombo' }); setIsModalOpen(true); }} className="flex items-center gap-3 px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-[2rem] text-[15px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/10 active:scale-95">
                      <Plus className="w-6 h-6" /> Create Entry
                    </button>
                  </div>

                  <div className="bg-white border border-slate-50 rounded-[4rem] overflow-hidden shadow-2xl shadow-slate-200/40">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] border-b border-slate-50">
                            <th className="px-12 py-8">Account ID</th>
                            <th className="px-12 py-8">Merchant Entity</th>
                            <th className="px-12 py-8">Location</th>
                            <th className="px-12 py-8">Category</th>
                            <th className="px-12 py-8">Net Ledger</th>
                            <th className="px-12 py-8 text-right">Settings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-slate-50/70 transition-all group">
                              <td className="px-12 py-10">
                                <span className="font-mono text-[14px] font-black text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100">
                                  {customer.account}
                                </span>
                              </td>
                              <td className="px-12 py-10">
                                <div className="flex items-center gap-5">
                                  <div className="w-14 h-14 rounded-[1.5rem] bg-slate-900 border-4 border-white flex items-center justify-center text-[18px] font-black text-white shadow-xl overflow-hidden group-hover:scale-110 transition-transform">
                                    <img src={`https://i.pravatar.cc/150?u=${customer.id + 50}`} alt="avatar" />
                                  </div>
                                  <div>
                                    <p className="text-[18px] font-black text-slate-900 tracking-tight leading-tight">{customer.name}</p>
                                    <p className="text-[13px] font-bold text-slate-400 mt-1 flex items-center gap-1.5"><Mail className="w-4 h-4" /> {customer.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-12 py-10 text-[15px] font-black text-slate-500 italic">
                                {customer.city}, LK
                              </td>
                              <td className="px-12 py-10">
                                <span className={cn("text-[11px] font-black px-4 py-2 rounded-2xl border-2 uppercase tracking-widest", customer.type === 'Premium' ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10" : "bg-white text-slate-300 border-slate-100")}>
                                  {customer.type}
                                </span>
                              </td>
                              <td className="px-12 py-10">
                                <p className="text-[20px] font-black text-slate-900 tracking-tighter">{formatCurrency(customer.balance)}</p>
                                <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Sync {customer.lastSeen}</p>
                              </td>
                              <td className="px-12 py-10 text-right opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                <div className="flex items-center justify-end gap-3">
                                  <button onClick={() => { setEditingCustomer(customer); setFormData({ ...customer }); setIsModalOpen(true); }} className="p-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all active:scale-90">
                                    <Edit2 className="w-6 h-6" />
                                  </button>
                                  <button onClick={() => handleDelete(customer.id)} className="p-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-red-600 hover:border-red-200 shadow-sm transition-all active:scale-90">
                                    <Trash2 className="w-6 h-6" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={6} className="px-12 py-40 text-center text-slate-300 font-black text-2xl tracking-tighter italic">Data Node Empty: Search yielded zero registered merchants</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white border border-slate-100 p-12 rounded-[4rem] shadow-sm">
                      <h3 className="text-2xl font-black text-slate-900 mb-12 tracking-tight uppercase italic">Merchant Growth Hub</h3>
                      <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={REVENUE_DATA}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 800, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 800, fill: '#94a3b8' }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '28px', border: 'none', boxShadow: '0 40px 80px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '15px' }} />
                            <Bar dataKey="value" fill="#2563eb" radius={[15, 15, 0, 0]} barSize={50} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-12 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] text-white flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-black mb-14 tracking-tight uppercase italic text-slate-500">Lanka Strategy Matrix</h3>
                        <div className="space-y-14">
                          {[
                            { label: 'Western Province Share', val: '84%', color: 'bg-blue-600' },
                            { label: 'Rural Penetration Index', val: '62%', color: 'bg-emerald-500' },
                            { label: 'Merchant Retension', val: '98%', color: 'bg-indigo-500' },
                          ].map((m, i) => (
                            <div key={i}>
                              <div className="flex justify-between mb-4 text-[13px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <span>{m.label}</span>
                                <span>{m.val}</span>
                              </div>
                              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: m.val }} className={cn("h-full rounded-full", m.color)} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-14 grid grid-cols-2 gap-8">
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Est. LKR ARR</p>
                          <p className="text-3xl font-black tracking-tighter italic">Rs. 420M</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Sync Latency</p>
                          <p className="text-3xl font-black tracking-tighter italic text-blue-400">0.2ms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-4xl space-y-12">
                  <div className="bg-white border border-slate-100 p-14 rounded-[4rem] shadow-sm">
                    <h3 className="text-2xl font-black text-slate-900 mb-14 tracking-tight uppercase italic">Lanka Core Infrastructure</h3>
                    <div className="space-y-12">
                      {[
                        { title: 'SMS OTP Verification (Dialog/Mobitel)', desc: 'Secure 2FA login for Sri Lankan mobile networks.', enabled: true },
                        { title: 'LKR Tax Compliance (VAT/SSCL)', desc: 'Auto-calculate local taxes based on IRD guidelines.', enabled: false },
                        { title: 'Cloud Registry Sync', desc: 'Securely replicate merchant data to Colombo DC.', enabled: true },
                        { title: 'AI Balance Forecasting', desc: 'Predict future revenue trends using regional data.', enabled: false },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between pb-10 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <p className="text-[18px] font-black text-slate-900 tracking-tight">{s.title}</p>
                            <p className="text-[14px] font-bold text-slate-400 mt-1.5">{s.desc}</p>
                          </div>
                          <button className={cn("w-16 h-8 rounded-full flex items-center p-1.5 transition-all duration-500 shadow-inner", s.enabled ? "bg-blue-600" : "bg-slate-100 border border-slate-200")}>
                            <div className={cn("w-5 h-5 bg-white rounded-full shadow-2xl transition-all duration-500", s.enabled ? "translate-x-8" : "translate-x-0")} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 p-14 rounded-[4rem] border border-red-100 flex items-center justify-between shadow-sm">
                    <div>
                      <h3 className="text-2xl font-black text-red-900 tracking-tight uppercase italic">Security Protocol</h3>
                      <p className="text-[15px] font-bold text-red-600 mt-2">Initialize hard-reset of Sri Lanka merchant registry.</p>
                    </div>
                    <button className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white text-[14px] font-black rounded-[2rem] transition-all shadow-2xl shadow-red-600/20 active:scale-95 uppercase tracking-widest">Wipe Registry</button>
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
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-[600px] bg-white border border-white rounded-[4rem] p-14 shadow-[0_60px_120px_rgba(0,0,0,0.4)]">
              <h3 className="text-3xl font-black text-slate-900 mb-12 tracking-tighter italic uppercase text-center">Node Registry <span className="text-blue-600">Form</span></h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Merchant Ref</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4.5 text-[16px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-inner" value={formData.account} placeholder="e.g. CB-1001" onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4.5 text-[16px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-inner" value={formData.name} placeholder="Nimal Perera" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                    <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4.5 text-[16px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-inner" value={formData.email} placeholder="nimal.p@gmail.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Location</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4.5 text-[16px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-inner" value={formData.city} placeholder="Colombo" onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Merchant Tier</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4.5 text-[16px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 appearance-none transition-all shadow-inner" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Regular">Regular</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Balance (LKR)</label>
                    <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4.5 text-[16px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-inner" value={formData.balance} placeholder="0.00" onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-[2.5rem] bg-slate-100 text-[14px] font-black text-slate-400 hover:bg-slate-200 transition-all uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-1 px-8 py-5 rounded-[2.5rem] bg-slate-900 text-white text-[14px] font-black hover:bg-black shadow-2xl shadow-slate-900/20 active:scale-95 transition-all uppercase tracking-widest">Commit Node</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
