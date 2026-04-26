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
  ArrowDownRight
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
  { id: '1', account: '1001', name: 'John Doe', email: 'john@example.com', phone: '+94 77 123 4567', type: 'Premium', balance: 1250.50, status: 'Active', lastSeen: '2h ago' },
  { id: '2', account: '1002', name: 'Jane Smith', email: 'jane@example.com', phone: '+94 71 987 6543', type: 'Regular', balance: 450.00, status: 'Pending', lastSeen: '5h ago' },
  { id: '3', account: '1003', name: 'Robert Wilson', email: 'robert@example.com', phone: '+94 70 555 1212', type: 'Premium', balance: 8900.00, status: 'Active', lastSeen: '1h ago' },
];

const REVENUE_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const COLORS = ['#2563eb', '#9333ea', '#db2777', '#f59e0b'];

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
  const [formData, setFormData] = useState({ account: '', name: '', email: '', phone: '', type: 'Regular', balance: '', status: 'Active' });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
  }, [customers]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const filteredCustomers = useMemo(() => 
    customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.account.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    ), [customers, searchQuery]
  );

  const stats = {
    totalBalance: customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0),
    activeCustomers: customers.filter(c => c.status === 'Active').length,
    premiumRate: Math.round((customers.filter(c => c.type === 'Premium').length / customers.length) * 100) || 0
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email === 'admin@billing.com' && formData.password === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('billing_auth', 'true');
    } else {
      addNotification('Invalid credentials!', 'error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('billing_auth');
    addNotification('Logged out safely');
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...formData } : c));
      addNotification('Customer updated successfully');
    } else {
      setCustomers([...customers, { id: Date.now().toString(), lastSeen: 'Just now', ...formData }]);
      addNotification('New customer added to registry');
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', email: '', phone: '', type: 'Regular', balance: '', status: 'Active' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Confirm permanent deletion of this record?')) {
      setCustomers(customers.filter(c => c.id !== id));
      addNotification('Record deleted from database', 'error');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-200 group relative",
        activeTab === id 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
          : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
      )}
    >
      <Icon className={cn("w-5 h-5", activeTab === id ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
      <span className="text-[13.5px] font-bold tracking-tight">{label}</span>
      {activeTab === id && (
        <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-4 bg-white rounded-full ml-1" />
      )}
    </button>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans selection:bg-blue-100">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px] space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-600/20 rotate-3">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">BillingPro</h1>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] mt-2">Enterprise Resource Gateway</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <form onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              if (email === 'admin@billing.com' && password === 'admin123') {
                setIsLoggedIn(true);
                localStorage.setItem('billing_auth', 'true');
                addNotification('Welcome back, Admin');
              } else {
                addNotification('Access Denied: Invalid Credentials', 'error');
              }
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Authentication Email</label>
                <input name="email" type="email" required defaultValue="admin@billing.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Security Key</label>
                <input name="password" type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95">Verify & Initialize</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-700 font-sans">
      {/* Toast Notifications */}
      <div className="fixed top-8 right-8 z-[100] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={cn("px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] border", n.type === 'error' ? "bg-red-600 text-white border-red-500" : "bg-white text-slate-900 border-slate-100")}>
              {n.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-blue-600" />}
              <span className="text-[13px] font-bold">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-12 px-2 pt-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-600/20">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">BillingPro</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="customers" icon={Users} label="Entity Registry" />
          <SidebarItem id="analytics" icon={BarChart3} label="Global Analytics" />
          <SidebarItem id="settings" icon={SettingsIcon} label="System Settings" />
        </nav>

        <div className="pt-6 border-t border-slate-100 mt-auto">
          <div className="bg-slate-50 p-4 rounded-2xl mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-[13px] font-black text-slate-900">Admin Panel</p>
              <p className="text-[11px] font-bold text-slate-400">Ver 1.0.4 Premium</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[13px] font-black">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Node / {activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-black text-slate-500">System Online</span>
            </div>
            <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all relative group">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto space-y-10">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              
              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                      <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform">
                        <TrendingUp className="w-32 h-32" />
                      </div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Portfolio Value</p>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">${stats.totalBalance.toLocaleString()}</p>
                        <div className="flex items-center text-emerald-600 text-[12px] font-black bg-emerald-50 px-2 py-0.5 rounded-lg mb-1.5">
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 12.5%
                        </div>
                      </div>
                      <div className="mt-8 h-12 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={REVENUE_DATA.slice(-4)}>
                            <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Entities</p>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.activeCustomers}</p>
                        <div className="flex items-center text-blue-600 text-[12px] font-black bg-blue-50 px-2 py-0.5 rounded-lg mb-1.5">
                          +3 New
                        </div>
                      </div>
                      <div className="mt-8 flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center -ml-2 first:ml-0 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-black -ml-2">+12</div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Premium Ratio</p>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.premiumRate}%</p>
                        <p className="text-[11px] font-bold text-slate-400 mb-1.5">Market Share</p>
                      </div>
                      <div className="mt-8 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${stats.premiumRate}%` }} className="h-full bg-blue-600 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Growth Trajectory</h3>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-black rounded-lg">Real-time</button>
                          <button className="px-3 py-1.5 bg-slate-50 text-slate-400 text-[11px] font-black rounded-lg">Historical</button>
                        </div>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={REVENUE_DATA}>
                            <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800 }} />
                            <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight mb-10">Asset Distribution</h3>
                      <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customers.slice(0, 4)} dataKey="balance" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8}>
                              {customers.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                          <p className="text-3xl font-black text-slate-900 tracking-tighter">72%</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimized</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative w-full md:w-96 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input type="text" placeholder="Query entities, accounts, or emails..." className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-[14px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2.5 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Filter className="w-4.5 h-4.5" /> Filter
                      </button>
                      <button onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', email: '', phone: '', type: 'Regular', balance: '', status: 'Active' }); setIsModalOpen(true); }} className="flex items-center gap-2.5 px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[13px] font-black transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                        <Plus className="w-5 h-5" /> New Entity
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                            <th className="px-10 py-6">ID Node</th>
                            <th className="px-10 py-6">Entity Profile</th>
                            <th className="px-10 py-6">Status</th>
                            <th className="px-10 py-6">Classification</th>
                            <th className="px-10 py-6">Net Valuation</th>
                            <th className="px-10 py-6 text-right">Operations</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-slate-50/50 transition-all group">
                              <td className="px-10 py-8">
                                <span className="font-mono text-[13px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                                  #{customer.account}
                                </span>
                              </td>
                              <td className="px-10 py-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[14px] font-black text-white shadow-lg overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${customer.id}`} alt="avatar" />
                                  </div>
                                  <div>
                                    <p className="text-[15px] font-black text-slate-900 tracking-tight">{customer.name}</p>
                                    <p className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {customer.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-1.5 h-1.5 rounded-full", customer.status === 'Active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500")} />
                                  <span className={cn("text-[11px] font-black uppercase tracking-widest", customer.status === 'Active' ? "text-emerald-600" : "text-amber-600")}>
                                    {customer.status}
                                  </span>
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <span className={cn("text-[10px] font-black px-3 py-1.5 rounded-xl border-2 uppercase tracking-widest", customer.type === 'Premium' ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-200")}>
                                  {customer.type}
                                </span>
                              </td>
                              <td className="px-10 py-8">
                                <p className="text-[16px] font-black text-slate-900 tracking-tight">${parseFloat(customer.balance).toFixed(2)}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Sync {customer.lastSeen}</p>
                              </td>
                              <td className="px-10 py-8 text-right opacity-0 group-hover:opacity-100 transition-all">
                                <div className="flex items-center justify-end gap-3">
                                  <button onClick={() => { setEditingCustomer(customer); setFormData({ ...customer }); setIsModalOpen(true); }} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all active:scale-90">
                                    <Edit2 className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => handleDelete(customer.id)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-red-600 hover:border-red-100 shadow-sm transition-all active:scale-90">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={6} className="px-10 py-32 text-center text-slate-300 font-black text-xl tracking-tight italic">Null results: Database query yielded zero records</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
                      <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Revenue Stream Velocity</h3>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={REVENUE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', fontWeight: 900 }} />
                            <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
                      <div className="absolute top-10 right-10 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <h3 className="text-xl font-black mb-10 tracking-tight text-slate-400">Strategic Overview</h3>
                      <div className="space-y-12">
                        <div>
                          <div className="flex justify-between mb-3 text-[12px] font-black uppercase tracking-widest text-slate-500">
                            <span>Market Penetration</span>
                            <span>84%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full">
                            <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-blue-600 rounded-full" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-3 text-[12px] font-black uppercase tracking-widest text-slate-500">
                            <span>Resource Optimization</span>
                            <span>92%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full">
                            <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-emerald-500 rounded-full" />
                          </div>
                        </div>
                        <div className="pt-10 grid grid-cols-2 gap-6">
                          <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Net ARR</p>
                            <p className="text-2xl font-black">$4.2M</p>
                          </div>
                          <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Churn Rate</p>
                            <p className="text-2xl font-black text-red-400">0.8%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-3xl space-y-10">
                  <div className="bg-white border border-slate-100 p-12 rounded-[3rem] shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-12 tracking-tight">System Infrastructure</h3>
                    <div className="space-y-10">
                      {[
                        { title: 'Global Database Sync', desc: 'Auto-replicate all transaction data to secure cloud storage.', enabled: true },
                        { title: 'AI Predictive Billing', desc: 'Enable smart forecasting for future customer balances.', enabled: false },
                        { title: 'Audit Log Protocol', desc: 'Generate encrypted logs for every administrative action.', enabled: true },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between pb-8 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <p className="text-[15px] font-black text-slate-900">{s.title}</p>
                            <p className="text-[13px] font-bold text-slate-400 mt-1">{s.desc}</p>
                          </div>
                          <button className={cn("w-14 h-7 rounded-full flex items-center p-1.5 transition-all duration-300", s.enabled ? "bg-blue-600" : "bg-slate-100 border border-slate-200")}>
                            <div className={cn("w-4 h-4 bg-white rounded-full shadow-md", s.enabled ? "ml-auto" : "ml-0")} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-12 rounded-[3rem] text-white flex items-center justify-between shadow-2xl">
                    <div>
                      <h3 className="text-xl font-black tracking-tight">Dangerous Actions</h3>
                      <p className="text-[13px] font-bold text-slate-500 mt-1">Permanent system data modification protocols.</p>
                    </div>
                    <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-[13px] font-black rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95">Purge Registry</button>
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
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-[500px] bg-white border border-white rounded-[3rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
              <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter italic uppercase">{editingCustomer ? 'Modify Node' : 'Initialize Node'}</h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Ref</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Endpoint</label>
                  <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 appearance-none transition-all" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Regular">Regular</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Valuation</label>
                    <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4.5 rounded-2xl bg-slate-100 text-[13px] font-black text-slate-400 hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-8 py-4.5 rounded-2xl bg-slate-900 text-white text-[13px] font-black hover:bg-black shadow-2xl shadow-slate-900/10 active:scale-95 transition-all">Process Node</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
